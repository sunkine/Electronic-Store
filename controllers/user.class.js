import User from "../models/user.model.js";
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
  const _id = req.userAuthId;
  try {
    const account = await Account.findById(_id);

    if (!account) {
      return res.status(200).json({
        success: false,
        message: "Account not found.",
      });
    }

    const { email } = account;
    const user = await User.findOne({ email });
    
    const idUserUpdated = await User.findByIdAndUpdate(
      user._id,
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
    const _id = req.userAuthId;
    const account = await Account.findById(_id);

    if (!account) {
      return res.status(200).json({
        success: false,
        message: "Account not found.",
      });
    }

    const { email } = account;
    const user = await User.findOne({ email });

    if (!user) {
      return res
        .status(404)
        .json({ success: false, message: "User not found." });
    }
    // Trả về thông tin người dùng
    res.status(200).json({
      success: true,
      message: "Successfully get user information.",
      data: user,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
