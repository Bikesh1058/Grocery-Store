import express from "express";
import {
  getStoreSettings,
  updateStoreSettings,
} from "../controllers/settingsController.js";
import { admin } from "../middleware/admin.js";
import { protect } from "../middleware/auth.js";

const router = express.Router();

router.get("/", getStoreSettings);
router.put("/", protect, admin, updateStoreSettings);

export default router;