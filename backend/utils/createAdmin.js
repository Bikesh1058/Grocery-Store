import dotenv from "dotenv";
import mongoose from "mongoose";
import connectDB from "../config/db.js";
import User from "../models/User.js";

dotenv.config();

const createAdmin = async () => {
  const email = process.env.ADMIN_EMAIL?.trim().toLowerCase();
  const password = process.env.ADMIN_PASSWORD;

  if (!email || !password || password.length < 8) {
    throw new Error("Set ADMIN_EMAIL and an ADMIN_PASSWORD of at least 8 characters.");
  }

  await connectDB();
  const existingUser = await User.findOne({ email });

  if (existingUser) {
    if (existingUser.role !== "admin") {
      throw new Error("An account already uses this email and is not an administrator.");
    }
    console.log(`Administrator account ${email} already exists; no changes were made.`);
    return;
  }

  await User.create({
    name: process.env.ADMIN_NAME?.trim() || "Store Administrator",
    email,
    password,
    phone: process.env.ADMIN_PHONE?.trim() || "0000000000",
    role: "admin",
  });
  console.log(`Administrator account ${email} created.`);
};

createAdmin()
  .catch((error) => {
    console.error(`Could not create administrator: ${error.message}`);
    process.exitCode = 1;
  })
  .finally(async () => {
    await mongoose.disconnect();
  });
