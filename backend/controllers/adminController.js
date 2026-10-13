import asyncHandler from "express-async-handler";
import Order from "../models/Order.js";
import Product from "../models/Product.js";
import User from "../models/User.js";

export const getDashboardStats = asyncHandler(async (_req, res) => {
  const [
    totalProducts,
    totalUsers,
    totalOrders,
    revenueResult,
    recentOrders,
    lowStockProducts,
  ] = await Promise.all([
    Product.countDocuments(),
    User.countDocuments({ role: "user" }),
    Order.countDocuments(),
    Order.aggregate([
      { $match: { isPaid: true } },
      { $group: { _id: null, total: { $sum: "$totalPrice" } } },
    ]),
    Order.find()
      .sort({ createdAt: -1 })
      .limit(6)
      .select("user totalPrice status isPaid createdAt")
      .populate("user", "name email")
      .lean(),
    Product.find({ stock: { $lte: 5 } })
      .sort({ stock: 1 })
      .limit(6)
      .select("name stock category")
      .lean(),
  ]);

  res.json({
    totalProducts,
    totalUsers,
    totalOrders,
    paidRevenue: revenueResult[0]?.total || 0,
    recentOrders,
    lowStockProducts,
  });
});
