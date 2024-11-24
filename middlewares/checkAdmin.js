import Account from "../models/account.model.js";
import jwt from "jsonwebtoken";

const isAdmin = async (req, res, next) => {
  try {
    const userId = req.userAuthId;
    const acc = await Account.findById(userId);

    if (!acc) {
      return res.status(200).json({
        success: false,
        message: "Account not found.",
      });
    }

    if (acc.role === "admin") {
      next(); // Cho phép tiếp tục nếu là admin
    } else {
      return res.status(403).json({
        success: false,
        message: "Access denied, admin only",
      });
    }
  } catch (err) {
    if (err.name === "TokenExpiredError") {
      return res
        .status(401)
        .json({ success: false, message: "Verification token has expired" });
    } else if (err.name === "JsonWebTokenError") {
      return res
        .status(401)
        .json({ success: false, message: "Invalid verification token" });
    }
    return res.status(500).json({
      success: false,
      message: "Internal server error.",
    });
  }
};

export default isAdmin;
