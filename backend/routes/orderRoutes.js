import express from "express";
import {
  addOrderItems,
  getOrderById,
  getMyOrders,
  getOrders,
  updateOrderToPaid,
  updateOrderStatus,
} from "../controllers/orderController.js";
import { protect } from "../middleware/auth.js";
import { admin } from "../middleware/admin.js";

const router = express.Router();

// All order routes require login
router.use(protect);

// Create order + get all orders (admin)
router
  .route("/")
  .post(addOrderItems)
  .get(admin, getOrders);

// Get logged-in user's orders
router.route("/myorders").get(getMyOrders);

// Get / update single order
router.route("/:id").get(getOrderById);
router.route("/:id/pay").put(updateOrderToPaid);
router.route("/:id/status").put(admin, updateOrderStatus);

export default router;