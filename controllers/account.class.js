import Account from "../models/account.model.js";
import User from "../models/user.model.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import asyncHandler from "express-async-handler";
import { sendVerificationEmail } from "../utils/sendEmail.js";

export const getAllAccount = async (req, res) => {
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
    const _id = req.userAuthId;

    const updateData = { ...req.body };
    const isRole = await Account.findById({_id})

    // Kiểm tra nếu người dùng không phải là admin, loại bỏ trường role
    if (isRole.role !== 'admin') {
      delete updateData.role;
      return res.status(404).json({ success: false, message: "Cannot updated role, admin only." });
    }
    // Nếu có mật khẩu trong request, mã hóa mật khẩu trước khi cập nhật
    if (req.body.password) {
      const salt = bcrypt.genSaltSync(10);
      const hash = bcrypt.hashSync(req.body.password, salt);
      updateData.password = hash;
    }

    // Cập nhật tài khoản
    const updatedAccount = await Account.findByIdAndUpdate(_id, {
      $set: updateData,
    }, { new: true });

    if (!updatedAccount) {
      return res.status(404).json({ success: false, message: "Account not found." });
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
    const id = req.params.id;
    const acc = await Account.findById(id);
    if (!acc) {
      res.status(404).json({ success: false, message: "Account not found." });
    } else {
      res.status(200).json({
        success: true,
        message: "Successfully get account information.",
        data: acc,
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
        .json({ success: false, message: "Email is already registered." });
    }

    // Check if the user already exists
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

    const existingPhone = await User.findOne({ phone });
    if (existingPhone) {
      return res
        .status(400)
        .json({ success: false, message: "Phone is already registered." });
    }

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
      AccountId: savedAccount._id, // liên kết với account vừa tạo
      name: req.body.name,
      gender: req.body.gender,
      phone: req.body.phone,
      address: req.body.address,
      photo: "",
    });

    if (!existingUsername && !existingEmail) {
      const savedUser = await user.save();
      if (!savedUser) {
        return res
          .status(500)
          .json({ success: false, message: "User creation failed." });
      }

      // Generate a verification token
      const verificationToken = jwt.sign(
        { userAuthId: savedAccount._id },
        process.env.JWT_SECRET,
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
