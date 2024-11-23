import Account from "../models/account.model.js";
import User from "../models/user.model.js";
import Cart from "../models/cart.model.js";
import asyncHandler from "express-async-handler";
import { sendEmail, sendVerificationEmail } from "../utils/sendEmail.js";
import { generateAccessToken } from "../utils/createToken.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import mongoose from "../config/mongoose.js";

export const createStaffAccount = async (req, res) => {
    const newAccount = new Account(req.body);
    try {
      const saved = await newAccount.save();
      res
        .status(200)
        .json({ success: true, messgae: "Successfully created.", data: saved });
    } catch (error) {
      res.status(500).json({ success: false, message: error.message });
    }
};

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
  const limit = parseInt(req.query.limit || 10);

  let filters = {};

  try {
    const account = await Account.find(filters)
      .limit(limit)
      .skip(page * limit);
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

export const deleteAccount = async (req, res) => {
  try {
    const id = req.params.id;

    // Start deleting the account, user, and cart in parallel to optimize performance
    const deleteAccount = Account.findByIdAndDelete(id);
    const deleteUser = User.findOneAndDelete({ idAccount: id });
    const deleteCart = Cart.findOneAndDelete({ idAccount: id });

    const [account, user, cart] = await Promise.all([
      deleteAccount,
      deleteUser,
      deleteCart,
    ]);

    // Check if any of the deletions failed and return a response accordingly
    if (!account || !user || !cart) {
      return res.status(404).json({
        success: false,
        message: "One or more items (account, user, or cart) were not found.",
      });
    }

    // All deletions were successful
    res.status(200).json({
      success: true,
      message: "Successfully deleted account, user, and cart.",
      dataAccount: account,
      dataUser: user,
      dataCart: cart,
    });
  } catch (error) {
    // Handle unexpected errors
    res.status(500).json({ success: false, message: error.message });
  }
};

export const updateAccount = async (req, res) => {
  try {
    const id = req.params.id;
    const updateData = { ...req.body };

    if (req.body.password) {
      const salt = bcrypt.genSaltSync(10);
      const hash = bcrypt.hashSync(req.body.password, salt);
      updateData.password = hash;
    }

    const existingEmail = await Account.findOne({ email: updateData.email });
    if (existingEmail) {
      return res
        .status(401)
        .json({ success: false, message: "Email is already registered. " });
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

export const updatePassword = async (req, res) => {
  const userId = req.userAuthId; // Lấy user ID từ token
  const { oldPassword, newPassword } = req.body;

  try {
    // 1. Tìm user theo ID
    const account = await Account.findById(userId);

    if (!account) {
      return res.status(404).json({
        success: false,
        message: "Account not found.",
      });
    }

    // 2. Kiểm tra mật khẩu cũ
    const isPasswordMatch = await bcrypt.compare(oldPassword, account.password);
    if (!isPasswordMatch) {
      return res.status(400).json({ message: "Mật khẩu cũ không đúng." });
    }

    // 3. Kiểm tra mật khẩu mới không trùng mật khẩu cũ
    const isSameAsOldPassword = await bcrypt.compare(newPassword, account.password);
    if (isSameAsOldPassword) {
      return res.status(400).json({
        success: false,
        message: "Mật khẩu mới không được trùng với mật khẩu cũ.",
      });
    }

    // 4. Mã hóa mật khẩu mới
    const hashedPassword = await bcrypt.hash(newPassword, 10);

    // 5. Cập nhật mật khẩu trong cơ sở dữ liệu
    account.password = hashedPassword;
    await account.save();

    res
      .status(200)
      .json({ success: true, message: "Đổi mật khẩu thành công." });
  } catch (error) {
    console.error(error);
    res
      .status(500)
      .json({
        success: false,
        message: "Đã xảy ra lỗi. Vui lòng thử lại sau.",
      });
  }
};

export const getAccount = async (req, res) => {
  try {
    const { id } = req.params;
    const account = await Account.findById(id);

    if (!account) {
      return res.status(200).json({
        success: false,
        message: "Account not found.",
      });
    }

    res.status(200).json({
      success: true,
      message: "Successfully get account information.",
      data: account,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const SignUp = asyncHandler(async (req, res) => {
  const { username, email, password } = req.body;
  if (!email || !password) {
    return res
      .status(400)
      .json({ success: false, message: "Email and password are required." });
  }

  const session = await mongoose.startSession();
  session.startTransaction();

  try {
    const existingEmail = await Account.findOne({ email }).session(session);
    if (existingEmail) {
      await session.abortTransaction();
      session.endSession();
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
    const savedAccount = await account.save({ session });
    if (!savedAccount) {
      await session.abortTransaction();
      session.endSession();
      return res
        .status(500)
        .json({ success: false, message: "Account creation failed." });
    }

    const user = new User({
      name: username,
      email,
      idAccount: savedAccount._id,
    });
    const savedUser = await user.save({ session });
    if (!savedUser) {
      await session.abortTransaction();
      session.endSession();
      return res
        .status(500)
        .json({ success: false, message: "User creation failed." });
    }

    const cart = new Cart({
      idAccount: savedAccount._id,
      products: [],
    });
    const savedCart = await cart.save({ session });
    if (!savedCart) {
      await session.abortTransaction();
      session.endSession();
      return res
        .status(500)
        .json({ success: false, message: "Cart creation failed." });
    }

    // Commit the transaction if everything is successful
    await session.commitTransaction();
    session.endSession();

    // Generate a verification token
    const verificationToken = jwt.sign(
      { userAuthId: savedAccount._id },
      process.env.JWT_ACCESS_SECRET,
      { expiresIn: "1h" }
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
  } catch (error) {
    // Rollback transaction if any error occurs
    await session.abortTransaction();
    session.endSession();
    res.status(500).json({ success: false, message: error.message });
  }
});

export const forgotPasswordCtrl = asyncHandler(async (req, res) => {
  const account = await Account.findOne({ email: req.body.email });
  if (!account) {
    return res.status(401).json({
      status: "failed",
      message: "Account not found. Please check your email!",
    });
  }

  const resetToken = jwt.sign(
    { resetToken: account._id },
    process.env.JWT_RESET_PASSWORD_SECRET,
    { expiresIn: "10m" }
  );

  // Lưu token và thời gian hết hạn
  account.resetPasswordToken = resetToken;
  account.resetPasswordExpires = Date.now() + 10 * 60 * 1000; // 10 phút

  await account.save();

  const resetURL = `http://localhost:3001/ResetPassword/${resetToken}`;
  const message = `Forgot your password? Click this link to reset it: ${resetURL}`;

  try {
    await sendEmail({
      email: account.email,
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
      message: "Failed to send email. Please try again later.",
    });
  }
});

export const resetPasswordCtrl = asyncHandler(async (req, res) => {
  const { token } = req.params;
  const { password, confirmPassword } = req.body;

  if (password !== confirmPassword) {
    return res.status(400).json({
      success: false,
      message: "Passwords do not match.",
    });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_RESET_PASSWORD_SECRET);

    const account = await Account.findOne({
      _id: decoded.resetToken,
      resetPasswordToken: token,
      resetPasswordExpires: { $gt: Date.now() }, // Kiểm tra thời hạn của token
    });

    if (!account) {
      return res
        .status(400)
        .json({ success: false, message: "Token is invalid or has expired" });
    }

    const salt = await bcrypt.genSalt(10);
    account.password = await bcrypt.hash(password, salt);

    // Xóa token sau khi sử dụng
    account.resetPasswordToken = undefined;
    account.resetPasswordExpires = undefined;

    await account.save();
    const accessToken = generateAccessToken(account._id);

    res.status(200).json({
      status: "success",
      message: "Password reset successful!",
      token: accessToken,
    });
  } catch (err) {
    if (err.name === "TokenExpiredError") {
      return res
        .status(401)
        .json({ success: false, message: "Token has expired" });
    } else if (err.name === "JsonWebTokenError") {
      return res.status(401).json({ success: false, message: "Invalid token" });
    }
    res.status(500).json({ success: false, message: err.message });
  }
});

export const resendEmailVerification = asyncHandler(async (req, res) => {
  const { email } = req.body;

  // Kiểm tra xem email có tồn tại trong hệ thống không
  const account = await Account.findOne({ email });
  if (!account) {
    return res
      .status(404)
      .json({ success: false, message: "Account not found" });
  }

  // Nếu tài khoản đã được kích hoạt
  if (account.isActive) {
    return res
      .status(400)
      .json({ success: false, message: "Account is already verified" });
  }

  // Tạo token mới
  const verificationToken = jwt.sign(
    { userAuthId: account._id },
    process.env.JWT_ACCESS_SECRET,
    { expiresIn: "1h" }
  );

  // Generate the verification link
  const verificationLink = `${req.protocol}://${req.get(
    "host"
  )}/auth/verify-email/${verificationToken}`;

  // Send the verification email
  await sendVerificationEmail(email, verificationLink);

  res
    .status(200)
    .json({ success: true, message: "Verification email resent successfully" });
});
