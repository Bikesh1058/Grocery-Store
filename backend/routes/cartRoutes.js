import express from "express";
import {
  getCart,
  addToCart,
  updateCartItem,
  removeFromCart,
  clearCart,
} from "../controllers/cartController.js";
import { protect } from "../middleware/auth.js";

const router = express.Router();

// All cart routes require login
router.use(protect);

router.route("/").get(getCart);
router.route("/add").post(addToCart);
router.route("/update").put(updateCartItem);
router.route("/remove/:productId").delete(removeFromCart);
router.route("/clear").delete(clearCart);

export default router;