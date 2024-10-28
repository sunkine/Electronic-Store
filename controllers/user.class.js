import User from "../models/user.model.js";
import asyncHandler from "express-async-handler";
import jwt from "jsonwebtoken";
import { sendEmail, sendVerificationEmail } from "../utils/sendEmail.js";
import bcrypt from "bcryptjs";
import generateToken from "../utils/createToken.js";
import Account from "../models/account.model.js";

export const createUser = async (req, res) => {
  const newUser = new User(req.body);
  try {
    const saved = await newUser.save();
    res
      .status(200)
      .json({ success: true, messgae: "Successfully created.", data: saved });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const updateUser = async (req, res) => {
  try {
    const id = req.params.id;
    const idUserUpdated = await User.findByIdAndUpdate(
      id,
      {
        $set: req.body,
      },
      { new: true }
    );

    if (!idUserUpdated) {
      return res
        .status(404)
        .json({ success: false, message: "User not found." });
    } else {
      res.status(200).json({
        success: true,
        messgae: "Successfully updated.",
        data: idUserUpdated,
      });
    }
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const deleteUser = async (req, res) => {
  try {
    const id = req.params.id;
    const user = await User.findByIdAndDelete(id);
    if (!user) {
      res.status(404).json({ success: false, message: "User not found." });
    } else {
      res.status(200).json({
        success: true,
        messgae: "Successfully delete user.",
        data: user,
      });
    }
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const getAllUser = async (req, res) => {
  try {
    const page = parseInt(req.query.page);
    const user = await User.find()
      .limit(10)
      .skip(page * 10);
    if (!user) {
      return res
        .status(404)
        .json({ success: false, message: "User not found." });
    } else {
      res.status(200).json({
        success: true,
        messgae: "Successfully get all users.",
        total: user.length,
        data: user,
      });
    }
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const getOneUser = async (req, res) => {
  try {
    const id = req.params.id;
    const user = await User.findById(id);
    if (!user) {
      return res
        .status(404)
        .json({ success: false, message: "User not found." });
    } else {
      res.status(200).json({
        success: true,
        messgae: "Successfully get user information.",
        data: user,
      });
    }
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const forgotPasswordCtrl = asyncHandler(async (req, res) => {
  // Check if the user exists
  const user = await Account.findOne({ email: req.body.email });
  if (!user) {
    res.status(401).json({
      status: "failed",
      message: "Not found your. Please check your email!.",
    });
  }
  // Create a JWT token for password reset
  const resetToken = jwt.sign(
    { resetToken: user._id },
    process.env.JWT_SECRET, // You can use a separate secret for password reset if needed
    { expiresIn: "10m" } // Token will expire in 10 minutes
  );

  // Generate reset URL with the JWT token
  const resetURL = `${req.protocol}://${req.get(
    "host"
  )}/user/reset-password/${resetToken}`;
  const message = `Forgot your password? Click this link to reset it: ${resetURL}`;

  try {
    // Send the email
    await sendEmail({
      email: user.email,
      subject: "Your Password Reset Token (valid for 10 minutes)",
      message,
    });

    res.status(200).json({
      status: "success",
      message: "Token sent to email!",
    });
  } catch (err) {
    res.status(500).json({
      status: "failed",
      message: err.message,
    });
  }
});

export const resetPasswordCtrl = asyncHandler(async (req, res) => {
  const { token } = req.params;

  try {
    // Verify the token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // Find the account by the decoded ID
    const user = await Account.findById(decoded.resetToken);
    if (!user) {
      return res
        .status(404)
        .json({ success: false, message: "User not found" });
    }

    // Find the associated account using the user's email
    const account = await Account.findOne({ email: user.email });
    if (!account) {
      return res
        .status(404)
        .json({ success: false, message: "Account not found" });
    }

    // Set the new password in the Account model
    const salt = await bcrypt.genSalt(10);
    account.password = await bcrypt.hash(req.body.password, salt);

    // Save the updated account
    await account.save();

    // Send response without returning the password
    res.status(200).json({
      status: "success",
      message: "Password reset successful!",
      token: generateToken(user._id), // Log the user in after resetting password
    });
  } catch (err) {
    if (err.name === "TokenExpiredError") {
      return res
        .status(401)
        .json({ success: false, message: "Token has expired" });
    } else if (err.name === "JsonWebTokenError") {
      return res.status(401).json({ success: false, message: "Invalid token" });
    }

    // Other errors
    res.status(500).json({ success: false, message: "An error occurred" });
  }
});
