import express from "express";
import { getDashboardStats } from "../controllers/adminController.js";
import { admin } from "../middleware/admin.js";
import { protect } from "../middleware/auth.js";

const router = express.Router();

router.use(protect, admin);
router.get("/dashboard", getDashboardStats);

export default router;
