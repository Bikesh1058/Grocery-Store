import jwt from "jsonwebtoken";
import asyncHandler from "express-async-handler";
import User from "../models/User.js";

// @desc    Verify JWT from cookie and attach user to request
// @access  Private
export const protect = asyncHandler(async (req, res, next) => {
  let token;

  // 1. Check HTTP-only cookie first
  if (req.cookies?.jwt) {
    token = req.cookies.jwt;
  }
  // 2. Fallback: Authorization header (Bearer token) — useful for Postman/API clients
  else if (
    req.headers.authorization &&
    req.headers.authorization.startsWith("Bearer")
  ) {
    token = req.headers.authorization.split(" ")[1];
  }

  if (!token) {
    res.status(401);
    throw new Error("Not authorized, no token");
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    // Attach user (without password) to req
    req.user = await User.findById(decoded.userId).select("-password");

    if (!req.user) {
      res.status(401);
      throw new Error("Not authorized, user no longer exists");
    }

    next();
  } catch (error) {
    console.error("JWT verification failed:", error.message);
    res.status(401);
    throw new Error("Not authorized, token failed");
  }
});

// @desc    Optional auth — attaches user if logged in, but doesn't block guests
// @access  Public
export const optionalAuth = asyncHandler(async (req, res, next) => {
  let token;

  if (req.cookies?.jwt) {
    token = req.cookies.jwt;
  } else if (
    req.headers.authorization &&
    req.headers.authorization.startsWith("Bearer")
  ) {
    token = req.headers.authorization.split(" ")[1];
  }

  if (!token) return next();

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = await User.findById(decoded.userId).select("-password");
  } catch (error) {
    // Silently ignore invalid token for optional auth
  }

  next();
});