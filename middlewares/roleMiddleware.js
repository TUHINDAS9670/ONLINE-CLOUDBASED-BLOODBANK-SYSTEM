const User = require("../models/userModel");

const isAdminOrOrg = async (req, res, next) => {
  try {
    const user = await User.findById(req.body.userId);
    if (!user) {
      return res.status(401).json({ success: false, message: "User not found" });
    }

    if (user.role === "admin" || user.role === "organisation") {
      next();
    } else {
      return res.status(403).json({ success: false, message: "Access denied: not admin or organisation" });
    }
  } catch (error) {
    console.error("Role check error:", error);
    return res.status(500).json({ success: false, message: "Server error", error });
  }
};

module.exports = { isAdminOrOrg };
