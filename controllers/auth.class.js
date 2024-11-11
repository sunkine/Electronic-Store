import Account from "../models/account.model.js";
import bcrypt from "bcryptjs";
import {
  generateAccessToken,
  generateRefreshToken,
} from "../utils/createToken.js";
import asyncHandler from "express-async-handler";
import jwt from "jsonwebtoken";
import User from "../models/user.model.js";
import Cart from "../models/cart.model.js";

export const SignIn = async (req, res) => {
  try {
    const account = await Account.findOne({ email: req.body.email });
    if (!account) {
      return res.status(404).json({
        success: false,
        message: "Email or password is incorrect.",
      });
    }

    if (!account.isActive) {
      return res.status(401).json({
        success: false,
        message:
          "Your account has been disabled. Please contact the administrator.",
      });
    }

    const isPasswordValid = await bcrypt.compare(
      req.body.password,
      account.password
    );

    if (!isPasswordValid) {
      return res.status(401).json({
        success: false,
        message: "Email or password is incorrect.",
      });
    }

    const user = await User.findOne({ email: req.body.email });
    const cart = await Cart.findOne({ idAccount: account._id });

    if (!user || !cart) {
      return res.status(404).json({
        success: false,
        message: "Associated user or cart not found.",
      });
    }

    const { password: pwHash, ...userDetails } = account._doc;

    // Generate JWT tokens
    const accessToken = generateAccessToken(account._id);
    const refreshToken = generateRefreshToken(account._id);

    res
      .cookie("refreshToken", refreshToken, {
        httpOnly: true,
        maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
        secure: process.env.NODE_ENV === "production", // Only use HTTPS in production
        sameSite: "strict",
      })
      .status(200)
      .json({
        success: true,
        message: "Successfully logged in.",
        accessToken,
        data: userDetails,
        idUser: user._id,
        idCart: cart._id,
      });
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      success: false,
      message: "Internal server error.",
    });
  }
};

export const verifyEmail = asyncHandler(async (req, res) => {
  const { token } = req.params;

  try {
    // Verify the token
    const decoded = jwt.verify(token, process.env.JWT_ACCESS_SECRET);

    // Find the account by the decoded ID
    const account = await Account.findById(decoded.userAuthId);
    if (!account) {
      return res
        .status(404)
        .json({ success: false, message: "Account not found" });
    }

    // If the account is already verified
    if (account.isActive) {
      return res
        .status(400)
        .json({ success: false, message: "Account already verified" });
    }

    // Set the account to verified
    account.isActive = true;
    await account.save();
    res.redirect(`http://localhost:3001/verification-success`);
    // res.status(200).json({
    //   success: true,
    //   message: "Account successfully verified!",
    //   data: {
    //     id: account._id,
    //     email: account.email,
    //   },
    // });
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

    res
      .status(500)
      .json({
        success: false,
        message: "An error occurred during verification.",
      });
  }
});

export const refreshAccessToken = (req, res) => {
  const refreshToken = req.cookies.refreshToken;

  if (!refreshToken) {
    return res
      .status(403)
      .json({ success: false, message: "Refresh token not provided" });
  }

  // Xác thực `refreshToken`
  jwt.verify(refreshToken, process.env.JWT_REFRESH_SECRET, (err, decoded) => {
    if (err) {
      return res
        .status(403)
        .json({ success: false, message: "Invalid refresh token" });
    }

    // Tạo `accessToken` mới
    const newAccessToken = generateAccessToken(decoded._id);

    res.status(200).json({
      success: true,
      accessToken: newAccessToken,
    });
  });
};
