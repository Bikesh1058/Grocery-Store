import asyncHandler from "express-async-handler";
import Settings, { defaultStoreSettings } from "../models/Settings.js";

const textFields = [
  "storeName",
  "tagline",
  "announcementText",
  "logoUrl",
  "faviconUrl",
  "heroImageUrl",
  "supportEmail",
  "supportPhone",
  "address",
  "currencySymbol",
];

export const getStoreSettings = asyncHandler(async (_req, res) => {
  const settings = await Settings.findOne({ key: "store" }).lean();
  res.json({ ...defaultStoreSettings, ...(settings || {}) });
});

export const updateStoreSettings = asyncHandler(async (req, res) => {
  const updates = {};

  for (const field of textFields) {
    if (req.body[field] === undefined) continue;
    if (typeof req.body[field] !== "string") {
      res.status(400);
      throw new Error(`${field} must be text`);
    }
    updates[field] = req.body[field].trim();
  }

  for (const field of ["shippingFee", "freeShippingThreshold"]) {
    if (req.body[field] === undefined) continue;
    const value = Number(req.body[field]);
    if (!Number.isFinite(value) || value < 0 || value > 100000000) {
      res.status(400);
      throw new Error(`${field} must be a non-negative amount`);
    }
    updates[field] = value;
  }

  if (req.body.primaryColor !== undefined) {
    if (
      typeof req.body.primaryColor !== "string" ||
      !/^#[0-9a-fA-F]{6}$/.test(req.body.primaryColor)
    ) {
      res.status(400);
      throw new Error("primaryColor must be a six-digit hex color");
    }
    updates.primaryColor = req.body.primaryColor;
  }

  if (updates.storeName !== undefined && !updates.storeName) {
    res.status(400);
    throw new Error("Store name cannot be empty");
  }

  const settings = await Settings.findOneAndUpdate(
    { key: "store" },
    { $set: updates, $setOnInsert: { key: "store" } },
    { new: true, upsert: true, runValidators: true, setDefaultsOnInsert: true }
  ).lean();

  res.json({ ...defaultStoreSettings, ...settings });
});