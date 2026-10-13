import asyncHandler from "express-async-handler";
import payments, {
  esewaPaymentUrl,
  esewaProductCode,
  signEsewaPayment,
} from "../config/payment.js";
import Order from "../models/Order.js";

// ---------------------------------------------------------
// ESEWA
// ---------------------------------------------------------

// @desc    Initiate eSewa payment
// @route   POST /api/payment/esewa/initiate
// @access  Private
export const initiateEsewa = asyncHandler(async (req, res) => {
  const { orderId } = req.body;

  const order = await Order.findById(orderId);
  if (!order) {
    res.status(404);
    throw new Error("Order not found");
  }

  if (order.user.toString() !== req.user._id.toString()) {
    res.status(403);
    throw new Error("Not authorized to pay for this order");
  }
  if (order.paymentMethod !== "esewa" || order.isPaid) {
    res.status(400);
    throw new Error("This order is not awaiting eSewa payment");
  }

  const transactionUuid = `ORDER-${order._id}-${Date.now()}`;

  const fields = {
    amount: order.totalPrice,
    tax_amount: 0,
    total_amount: order.totalPrice,
    transaction_uuid: transactionUuid,
    product_code: esewaProductCode,
    product_service_charge: 0,
    product_delivery_charge: 0,
    success_url: `${process.env.CLIENT_URL}/payment-success?orderId=${order._id}`,
    failure_url: `${process.env.CLIENT_URL}/payment-failure?orderId=${order._id}`,
    signed_field_names: "total_amount,transaction_uuid,product_code",
  };
  fields.signature = signEsewaPayment(fields);

  // Save transaction uuid for later verification
  order.paymentResult = { transactionId: transactionUuid, status: "pending" };
  await order.save();

  res.status(200).json({
    success: true,
    payment_url: esewaPaymentUrl,
    fields,
  });
});

// @desc    Verify eSewa payment
// @route   POST /api/payment/esewa/verify
// @access  Private
export const verifyEsewa = asyncHandler(async (req, res) => {
  const { orderId } = req.body;

  const order = await Order.findById(orderId);
  if (!order) {
    res.status(404);
    throw new Error("Order not found");
  }

  if (order.user.toString() !== req.user._id.toString()) {
    res.status(403);
    throw new Error("Not authorized to verify this order");
  }
  if (order.paymentMethod !== "esewa" || !order.paymentResult?.transactionId) {
    res.status(400);
    throw new Error("This order has no eSewa transaction to verify");
  }
  if (order.isPaid) {
    return res
      .status(200)
      .json({ success: true, message: "Payment was already verified" });
  }

  const verification = await payments.esewa.verifyPayment({
    product_code: esewaProductCode,
    transaction_uuid: order.paymentResult.transactionId,
    total_amount: order.totalPrice,
  });

  if (
    verification.status === "COMPLETED" &&
    Number(verification.amount) === Number(order.totalPrice)
  ) {
    order.isPaid = true;
    order.paidAt = new Date();
    order.paymentResult = {
      transactionId: order.paymentResult.transactionId,
      status: verification.status,
      paidAt: new Date(),
    };
    order.status = "confirmed";
    await order.save();

    return res
      .status(200)
      .json({ success: true, message: "Payment verified successfully" });
  }

  res.status(400);
  throw new Error("Payment verification failed");
});
