import Account from "../models/account.model.js";
import User from "../models/user.model.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import asyncHandler from "express-async-handler";
import { sendEmail, sendVerificationEmail } from "../utils/sendEmail.js";
import generateAccessToken from "../utils/createToken.js";

export const getAllAccount = async (req, res) => {
  const _id = req.userAuthId;
  const account = await Account.findById(_id);

  if (!account) {
    return res.status(200).json({
      success: false,
      message: "Account not found.",
    });
  }

  const page = parseInt(req.query.page);
  try {
    const account = await Account.find()
      .limit(10)
      .skip(page * 10);
    if (!account) {
      return res
        .status(404)
        .json({ success: false, message: "Account is empty." });
    } else {
      res.status(200).json({
        success: true,
        message: "Successfully get all accounts.",
        total: account.length,
        data: account,
      });
    }
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const disableAccount = async (req, res) => {
  try {
    const id = req.params.id;
    const account = await Account.findByIdAndUpdate({_id: id}, {isActive: false}, {new: true});
    if (!account) {
      res.status(404).json({ success: false, message: "Account not found." });
    } else {
      res.status(200).json({
        success: true,
        message: "Successfully disable account.",
        data: account,
      });
    }
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const deleteAccount = async (req, res) => {
  try {
    const id = req.params.id;
    const acc = await Account.findByIdAndDelete(id);
    if (!acc) {
      res.status(404).json({ success: false, message: "Account not found." });
    } else {
      res.status(200).json({
        success: true,
        message: "Successfully delete account.",
        data: acc,
      });
    }
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const updateAccount = async (req, res) => {
  try {
    const id = req.params.id;
    const user = req.userAuthId;
    const updateData = { ...req.body };
    const currentUser = await Account.findById(user);

    // Kiểm tra nếu người dùng hiện tại không phải là admin và không phải tài khoản chính họ
    if (user !== id && currentUser.role !== "admin") {
      return res.status(403).json({ success: false, message: "Permission denied." });
    }

    // Nếu không phải admin, không cho phép cập nhật role
    if (currentUser.role !== "admin") {
      delete updateData.role;
    }

    if (updateData.username) { 
      const existingUsername = await Account.findOne({ username: updateData.username, _id: { $ne: id }});
      if (existingUsername) {
        return res
          .status(400)
          .json({ success: false, message: "Username is already in use." });
      }
    }

    if (req.body.password) {
      const salt = bcrypt.genSaltSync(10);
      const hash = bcrypt.hashSync(req.body.password, salt);
      updateData.password = hash;
    }

    // Cập nhật tài khoản
    const updatedAccount = await Account.findByIdAndUpdate(
      id,
      {
        $set: updateData,
      },
      { new: true }
    );

    if (!updatedAccount) {
      return res
        .status(404)
        .json({ success: false, message: "Account not found." });
    } else {
      res.status(200).json({
        success: true,
        message: "Successfully updated.",
        data: updatedAccount,
      });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: "Internal server error." });
  }
};

export const getAccount = async (req, res) => {
  try {
    const _id = req.userAuthId;
    const account = await Account.findById(_id);

    if (!account) {
      return res.status(200).json({
        success: false,
        message: "Account not found.",
      });
    } else {
      res.status(200).json({
        success: true,
        message: "Successfully get account information.",
        data: account,
      });
    }
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const SignUp = asyncHandler(async (req, res) => {
  const { username, email, password, phone } = req.body;

  // Make sure both email and password are provided
  if (!email || !password) {
    return res
      .status(400)
      .json({ success: false, message: "Email and password are required." });
  }

  try {
    const existingUsername = await Account.findOne({ username });
    if (existingUsername) {
      return res
        .status(400)
        .json({ success: false, message: "Username is already registered." });
    }
    const existingEmail = await Account.findOne({ email });
    if (existingEmail) {
      return res
        .status(400)
        .json({ success: false, message: "Email is already registered." });
    }

    // Create a new account
    const account = new Account({
      username,
      email,
      password: bcrypt.hashSync(password, 10), // hash the password
      isActive: false, // set account as not verified
    });
    
    if (!existingUsername && !existingEmail) {
      // Save the account to the database
      const savedAccount = await account.save();
      
      // Check if the account was successfully created
      if (!savedAccount) {
        return res
        .status(500)
        .json({ success: false, message: "Account creation failed." });
      }

      const user = new User({
        email,
        idAccount: savedAccount._id, // liên kết với account vừa tạo
        name: "Nguyen Van A",
        gender: "Male",
        phone: "0123456789",
        address: "HCM",
        photo: "",
      });
      const savedUser = await user.save();
      if (!savedUser) {
        return res
          .status(500)
          .json({ success: false, message: "User creation failed." });
      }

      // Generate a verification token
      const verificationToken = jwt.sign(
        { userAuthId: savedAccount._id },
        process.env.JWT_ACCESS_SECRET,
        {
          expiresIn: "1h",
        }
      );

      // Generate the verification link
      const verificationLink = `${req.protocol}://${req.get(
        "host"
      )}/auth/verify-email/${verificationToken}`;

      // Send the verification email
      await sendVerificationEmail(email, verificationLink);

      res.status(201).json({
        success: true,
        message:
          "Account registered successfully! Please verify your email to activate your account.",
      });
    }
  } catch (error) {
    // Catch and return any errors
    res.status(500).json({ success: false, message: error.message });
  }
});

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
    process.env.JWT_ACCESS_SECRET, // You can use a separate secret for password reset if needed
    { expiresIn: "10m" } // Token will expire in 10 minutes
  );

  // Generate reset URL with the JWT token
  const resetURL = `${req.protocol}://${req.get(
    "host"
  )}/account/reset-password/${resetToken}`;
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

    // Find the associated account using the user's email
    const account = await Account.findById(decoded.resetToken);
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
      token: generateAccessToken(account._id),
    });
  } catch (err) {
    if (err.name === "TokenExpiredError") {
      return res
        .status(401)
        .json({ success: false, message: "Token has expired" });
    } else if (err.name === "JsonWebTokenError") {
      return res.status(401).json({ success: false, message: "Invalid token" });
    }

    res.status(500).json({ success: false, message: "Something error" });
  }
});