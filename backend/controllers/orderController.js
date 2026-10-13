import asyncHandler from "express-async-handler";
import mongoose from "mongoose";
import Order from "../models/Order.js";
import Cart from "../models/Cart.js";
import Product from "../models/Product.js";
import Settings, { defaultStoreSettings } from "../models/Settings.js";

// @desc    Create new order
// @route   POST /api/orders
// @access  Private
export const addOrderItems = asyncHandler(async (req, res) => {
  const { items, shippingAddress, paymentMethod } = req.body;

  if (!Array.isArray(items) || items.length === 0) {
    res.status(400);
    throw new Error("No order items");
  }

  if (!["esewa", "cod"].includes(paymentMethod)) {
    res.status(400);
    throw new Error("Please select a supported payment method");
  }

  if (!shippingAddress?.street?.trim() || !shippingAddress?.city?.trim()) {
    res.status(400);
    throw new Error("Please provide a street address and city");
  }

  const quantities = new Map();
  for (const item of items) {
    if (
      !item ||
      !mongoose.isValidObjectId(item.product) ||
      !Number.isInteger(Number(item.quantity)) ||
      Number(item.quantity) < 1
    ) {
      res.status(400);
      throw new Error("One or more order items are invalid");
    }
    const productId = item.product.toString();
    quantities.set(
      productId,
      (quantities.get(productId) || 0) + Number(item.quantity)
    );
  }

  const products = await Product.find({ _id: { $in: [...quantities.keys()] } });
  const productsById = new Map(
    products.map((product) => [product._id.toString(), product])
  );
  const orderItems = [...quantities].map(([productId, quantity]) => {
    const product = productsById.get(productId);
    if (!product) {
      res.status(404);
      throw new Error("A product in your cart is no longer available");
    }
    if (product.stock < quantity) {
      res.status(400);
      throw new Error(`${product.name} does not have enough stock`);
    }
    return {
      product: product._id,
      name: product.name,
      price: product.price,
      quantity,
      image: product.image,
      unit: product.unit,
    };
  });

  const itemsPrice = orderItems.reduce(
    (sum, item) => sum + item.price * item.quantity,
    0
  );
  const storeSettings = await Settings.findOne({ key: "store" }).lean();
  const freeShippingThreshold =
    storeSettings?.freeShippingThreshold ??
    defaultStoreSettings.freeShippingThreshold;
  const shippingPrice =
    itemsPrice >= freeShippingThreshold
      ? 0
      : storeSettings?.shippingFee ?? defaultStoreSettings.shippingFee;
  const totalPrice = itemsPrice + shippingPrice;

  const order = new Order({
    user: req.user._id,
    items: orderItems,
    shippingAddress,
    paymentMethod,
    itemsPrice,
    shippingPrice,
    totalPrice,
  });

  const reservedItems = [];
  const restoreStock = async () => {
    await Promise.all(
      reservedItems.map((item) =>
        Product.updateOne(
          { _id: item.product },
          { $inc: { stock: item.quantity } }
        )
      )
    );
  };

  for (const item of orderItems) {
    const result = await Product.updateOne(
      { _id: item.product, stock: { $gte: item.quantity } },
      { $inc: { stock: -item.quantity } }
    );
    if (result.modifiedCount !== 1) {
      res.status(400);
      await restoreStock();
      throw new Error(`${item.name} no longer has enough stock`);
    }
    reservedItems.push(item);
  }

  let createdOrder;
  try {
    createdOrder = await order.save();
  } catch (error) {
    await restoreStock();
    throw error;
  }

  // Clear the user's cart after order
  await Cart.findOneAndUpdate({ user: req.user._id }, { items: [] });

  res.status(201).json(createdOrder);
});

// @desc    Get order by ID
// @route   GET /api/orders/:id
// @access  Private
export const getOrderById = asyncHandler(async (req, res) => {
  const order = await Order.findById(req.params.id).populate(
    "user",
    "name email phone"
  );

  if (!order) {
    res.status(404);
    throw new Error("Order not found");
  }

  // Make sure the order belongs to the user (or they're an admin)
  if (
    order.user._id.toString() !== req.user._id.toString() &&
    req.user.role !== "admin"
  ) {
    res.status(403);
    throw new Error("Not authorized to view this order");
  }

  res.json(order);
});

// @desc    Get logged-in user's orders
// @route   GET /api/orders/myorders
// @access  Private
export const getMyOrders = asyncHandler(async (req, res) => {
  const orders = await Order.find({ user: req.user._id }).sort({
    createdAt: -1,
  });
  res.json(orders);
});

// @desc    Get all orders (admin)
// @route   GET /api/orders
// @access  Private/Admin
export const getOrders = asyncHandler(async (req, res) => {
  const orders = await Order.find({})
    .populate("user", "id name email")
    .sort({ createdAt: -1 });
  res.json(orders);
});

// @desc    Update order to paid
// @route   PUT /api/orders/:id/pay
// @access  Private
export const updateOrderToPaid = asyncHandler(async (req, res) => {
  const order = await Order.findById(req.params.id);

  if (!order) {
    res.status(404);
    throw new Error("Order not found");
  }

  order.isPaid = true;
  order.paidAt = Date.now();
  order.paymentResult = {
    transactionId: req.body.transactionId,
    status: req.body.status,
    paidAt: Date.now(),
  };

  const updatedOrder = await order.save();
  res.json(updatedOrder);
});

// @desc    Update order status (admin)
// @route   PUT /api/orders/:id/status
// @access  Private/Admin
export const updateOrderStatus = asyncHandler(async (req, res) => {
  const allowedStatuses = [
    "pending",
    "confirmed",
    "processing",
    "shipped",
    "delivered",
    "cancelled",
  ];
  if (!allowedStatuses.includes(req.body.status)) {
    res.status(400);
    throw new Error("Please provide a valid order status");
  }

  const order = await Order.findById(req.params.id);

  if (!order) {
    res.status(404);
    throw new Error("Order not found");
  }

  order.status = req.body.status;
  const updatedOrder = await order.save();
  res.json(updatedOrder);
});
