import Staff from "../models/staff.model.js";
import Order from "../models/order.model.js";

export const createStaffInfo = async (req, res) => {
  try {
    const newStaffInfo = new Staff({
      name: req.body.name,
      gender: req.body.gender,
      phone: req.body.phone,
      email: req.body.email,
      address: req.body.address,
      photo: req.body.photo || "",
      idCompany: req.body.idCompany,
    });
    const saved = await newStaffInfo.save();

    if (!saved) {
      return res
        .status(401)
        .json({
          success: false,
          message: "Fail to create new staff infomation",
        });
    }
    res
      .status(200)
      .json({ success: true, messgae: "Successfully created.", data: saved });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const updateStaff = async (req, res) => {
  const { id } = req.params;
  try {
    const staff = await Staff.findById(id);
    if (!staff) {
      return res.status(404).json({
        success: false,
        message: "Staff not found.",
      });
    }

    if (req.body.phone) {
      const existingUserWithPhone = await Staff.findOne({
        phone: req.body.phone,
        _id: { $ne: staff._id },
      });
      if (existingUserWithPhone) {
        return res.status(400).json({
          success: false,
          message: "Phone number is already in use.",
        });
      }
    }

    const idUserUpdated = await Staff.findByIdAndUpdate(
      staff._id,
      {
        $set: req.body,
      },
      { new: true }
    );

    if (!idUserUpdated) {
      return res
        .status(404)
        .json({ success: false, message: "Staff not found." });
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

export const deleteStaff = async (req, res) => {
  try {
    const id = req.params.id;
    const staff = await Staff.findByIdAndDelete(id);
    if (!staff) {
      res.status(404).json({ success: false, message: "Staff not found." });
    } else {
      res.status(200).json({
        success: true,
        messgae: "Successfully delete staff.",
        data: staff,
      });
    }
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const getAllStaff = async (req, res) => {
  try {
    const page = parseInt(req.query.page);
    const limit = parseInt(req.query.limit || 10);
    let filters = {};

    const staff = await Staff.find(filters)
      .limit(limit)
      .skip(page * limit);
    if (!staff) {
      return res
        .status(404)
        .json({ success: false, message: "Staff not found." });
    } else {
      res.status(200).json({
        success: true,
        messgae: "Successfully get all staffs.",
        total: staff.length,
        data: staff,
      });
    }
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const getOneStaff = async (req, res) => {
  const { id } = req.params;
  try {
    const staff = await Staff.findById(id);

    if (!staff) {
      return res
        .status(404)
        .json({ success: false, message: "User not found." });
    }
    // Trả về thông tin người dùng
    res.status(200).json({
      success: true,
      message: "Successfully get user information.",
      data: staff,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const getOrderByIdStaff = async (req, res) => {
  const { id } = req.params;
  try {
    // Tìm các đơn hàng theo _id
    const page = parseInt(req.query.page) || 0; // Default to page 0 if not specified
    const orders = await Order.find({ idStaff: id })
      .limit(page)
      .skip(page * 10);

    if (!orders || orders.length === 0) {
      return res
        .status(404)
        .json({ success: false, message: "No orders found" });
    }

    return res
      .status(200)
      .json({ success: true, total: orders.length, data: orders });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: "Server error" });
  }
}