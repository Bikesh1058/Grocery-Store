import jwt from "jsonwebtoken";

/**
 * Generate a JWT for the given user and attach it as an HTTP-only cookie.
 *
 * @param {Object} res      - Express response object
 * @param {String} userId   - MongoDB user _id
 * @returns {String} token  - The signed JWT (also returned for API clients)
 */
const generateToken = (res, userId) => {
  const token = jwt.sign({ userId }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRE || "7d",
  });

  // Set JWT as HTTP-only cookie
  res.cookie("jwt", token, {
    httpOnly: true,
    secure: process.env.NODE_ENV !== "development", // HTTPS in production
    sameSite: process.env.NODE_ENV === "development" ? "lax" : "strict",
    maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days in ms
  });

  return token;
};

export default generateToken;