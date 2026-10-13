import asyncHandler from "express-async-handler";

// @desc    Allow only users with role === "admin"
// @access  Private/Admin
export const admin = (req, res, next) => {
  if (req.user && req.user.role === "admin") {
    next();
  } else {
    res.status(403);
    throw new Error("Not authorized as an admin");
  }
};

// @desc    Allow specific roles (e.g., adminOnly or user+admin)
// @usage   authorize("admin", "vendor")
// @access  Private
export const authorize = (...roles) => {
  return (req, res, next) => {
    if (!req.user) {
      res.status(401);
      throw new Error("Not authorized, please log in");
    }

    if (!roles.includes(req.user.role)) {
      res.status(403);
      throw new Error(
        `Role '${req.user.role}' is not allowed to access this resource`
      );
    }

    next();
  };
};