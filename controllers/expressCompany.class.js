import expressCompany from "../models/expressCompany.model.js";

export const createExpressCompany = async (req, res) => {
  const newExpressCompany = new expressCompany(req.body);
  try {
    const saved = await newExpressCompany.save();
    res
      .status(200)
      .json({ success: true, messgae: "Successfully created.", data: saved });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const updateExpressCompany = async (req, res) => {
  const {id} = req.params;
  try {
    const company = await expressCompany.findById(id)
    if (!company) {
      return res.status(404).json({
        success: false,
        message: "User not found.",
      });
    }

    const idCompanyUpdated = await expressCompany.findByIdAndUpdate(
      company._id,
      {
        $set: req.body,
      },
      { new: true }
    );

    if (!idCompanyUpdated) {
      return res
        .status(404)
        .json({ success: false, message: "User not found." });
    } else {
      res.status(200).json({
        success: true,
        messgae: "Successfully updated.",
        data: idCompanyUpdated,
      });
    }
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const deleteExpressCompany = async (req, res) => {
  try {
    const id = req.params.id;
    const eCompany = await expressCompany.findByIdAndDelete(id);
    if (!eCompany) {
      res.status(404).json({ success: false, message: "User not found." });
    } else {
      res.status(200).json({
        success: true,
        messgae: "Successfully delete user.",
        data: eCompany,
      });
    }
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const getAllUser = async (req, res) => {
  try {
    const page = parseInt(req.query.page);
    const limit = parseInt(req.query.limit || 10);
    let filters = {}

    const user = await User.find(filters)
      .limit(limit)
      .skip(page * limit);
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
  const {id} = req.params;
  try {
    const user = await User.findById(id);

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
