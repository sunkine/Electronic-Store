import Account from "../models/account.model.js";
import jwt from 'jsonwebtoken'
import { verifyToken } from "./checkLogin.js";

const isAdmin = async (req, res, next) => {
  try {
    // Lấy token từ cookie
    const token = req.cookies.userAuthId; 

    if (!token) {
      return res.status(403).json({
        success: false,
        message: "Access denied, no token provided",
      });
    }

    // Xác thực và giải mã token
    const decoded = verifyToken(token);
    req.userAuthId = decoded.id; // Gán id từ payload vào req.userAuthId

    // Truy vấn user từ database
    const user = await Account.findById(req.userAuthId);

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found.",
      });
    }

    if (user.role === "admin") {
      next(); // Cho phép tiếp tục nếu là admin
    } else {
      return res.status(403).json({
        success: false,
        message: "Access denied, admin only",
      });
    }
  } catch (error) {
    console.error(error); // Log lỗi để dễ dàng debug
    if (error instanceof jwt.TokenExpiredError) {
      return res.status(401).json({
          success: false,
          message: "Token has expired",
      });
    } else if (error instanceof jwt.JsonWebTokenError) {
      return res.status(403).json({
          success: false,
          message: "Invalid token",
      });
    }
    return res.status(500).json({
      success: false,
      message: "Internal server error.",
    });
  }
};


export default isAdmin;
