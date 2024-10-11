import User from "../models/user.model.js";
import asyncHandler from "express-async-handler";
import jwt from "jsonwebtoken";
import sendEmail from "../utils/sendEmail.js";
import bcrypt from "bcryptjs";
import generateToken from "../utils/createToken.js"

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
      res
        .status(200)
        .json({
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
    const user = await User.find();
    if (!user) {
      return res
        .status(404)
        .json({ success: false, message: "User not found." });
    } else {
      res.status(200).json({
        success: true,
        messgae: "Successfully get all users.",
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
  const user = await User.findOne({ Email: req.body.Email });
  if (!user) {
    throw new Error("User not found with this email");
  }

  // Create a JWT token for password reset
  const resetToken = jwt.sign(
    { userId: user._id },
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
      email: user.Email,
      subject: "Your Password Reset Token (valid for 10 minutes)",
      message,
    });

    res.status(200).json({
      status: "success",
      message: "Token sent to email!",
    });
  } catch (err) {
    throw new Error("There was an error sending the email. Try again later.");
  }
});

export const resetPasswordCtrl = asyncHandler(async (req, res) => {
  const { token } = req.params;

  try {
    // Verify the token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // Find the user by the decoded ID
    const user = await User.findById(decoded.userId);
    if (!user) {
      throw new Error("User not found");
    }

    // Set the new password
    const salt = await bcrypt.genSalt(10);
    user.Password = await bcrypt.hash(req.body.Password, salt);

    // Save the updated user
    await user.save();

    // Send response
    res.status(200).json({
      status: "success",
      message: "Password reset successful!",
      token: generateToken(user._id), // Log the user in after resetting password
    });
  } catch (err) {
    // Handle invalid or expired token
    // throw new Error("Token is invalid or has expired");
    res.status(500).json({ success: false, message: err.message });
  }
});
