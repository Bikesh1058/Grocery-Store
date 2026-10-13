import asyncHandler from "express-async-handler";
import Product from "../models/Product.js";

// @desc    Fetch all products (with search, filter, pagination)
// @route   GET /api/products
// @access  Public
export const getProducts = asyncHandler(async (req, res) => {
  const pageSize = Number(req.query.pageSize) || 12;
  const page = Number(req.query.page) || 1;

  const keyword = req.query.keyword
    ? { name: { $regex: req.query.keyword, $options: "i" } }
    : {};

  const category = req.query.category ? { category: req.query.category } : {};

  const minPrice = req.query.minPrice ? { price: { $gte: Number(req.query.minPrice) } } : {};
  const maxPrice = req.query.maxPrice
    ? { price: { ...minPrice.price, $lte: Number(req.query.maxPrice) } }
    : minPrice;

  const filter = { ...keyword, ...category, ...maxPrice };

  const count = await Product.countDocuments(filter);
  const products = await Product.find(filter)
    .limit(pageSize)
    .skip(pageSize * (page - 1))
    .sort({ createdAt: -1 });

  res.json({
    products,
    page,
    pages: Math.ceil(count / pageSize),
    total: count,
  });
});

// @desc    Fetch single product
// @route   GET /api/products/:id
// @access  Public
export const getProductById = asyncHandler(async (req, res) => {
  const product = await Product.findById(req.params.id);

  if (product) {
    res.json(product);
  } else {
    res.status(404);
    throw new Error("Product not found");
  }
});

// @desc    Create a product
// @route   POST /api/products
// @access  Private/Admin
export const createProduct = asyncHandler(async (req, res) => {
  const { name, description, price, category, image, stock, unit, isOrganic } = req.body;

  const product = new Product({
    name,
    description,
    price,
    originalPrice: req.body.originalPrice || price,
    category,
    image,
    stock,
    unit,
    isOrganic,
    user: req.user._id,
  });

  const createdProduct = await product.save();
  res.status(201).json(createdProduct);
});

// @desc    Update a product
// @route   PUT /api/products/:id
// @access  Private/Admin
export const updateProduct = asyncHandler(async (req, res) => {
  const product = await Product.findById(req.params.id);

  if (!product) {
    res.status(404);
    throw new Error("Product not found");
  }

  product.name = req.body.name || product.name;
  product.description = req.body.description || product.description;
  product.price = req.body.price ?? product.price;
  product.originalPrice = req.body.originalPrice ?? product.originalPrice;
  product.category = req.body.category || product.category;
  product.image = req.body.image || product.image;
  product.stock = req.body.stock ?? product.stock;
  product.unit = req.body.unit || product.unit;
  product.isOrganic = req.body.isOrganic ?? product.isOrganic;

  const updatedProduct = await product.save();
  res.json(updatedProduct);
});

// @desc    Delete a product
// @route   DELETE /api/products/:id
// @access  Private/Admin
export const deleteProduct = asyncHandler(async (req, res) => {
  const product = await Product.findById(req.params.id);

  if (!product) {
    res.status(404);
    throw new Error("Product not found");
  }

  await product.deleteOne();
  res.json({ message: "Product removed" });
});

// @desc    Create a new review
// @route   POST /api/products/:id/reviews
// @access  Private
export const createProductReview = asyncHandler(async (req, res) => {
  const { rating, comment } = req.body;

  const product = await Product.findById(req.params.id);

  if (!product) {
    res.status(404);
    throw new Error("Product not found");
  }

  // Here you'd typically have a Review model, but keeping it simple:
  product.ratings =
    (product.ratings * product.numReviews + Number(rating)) / (product.numReviews + 1);
  product.numReviews += 1;

  await product.save();
  res.status(201).json({ message: "Review added" });
});