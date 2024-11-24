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
  const { id } = req.params;
  try {
    const eCompany = await expressCompany.findById(id);
    if (!eCompany) {
      return res.status(404).json({
        success: false,
        message: "Express company not found.",
      });
    }

    const idCompanyUpdated = await expressCompany.findByIdAndUpdate(
      eCompany._id,
      {
        $set: req.body,
      },
      { new: true }
    );

    if (!idCompanyUpdated) {
      return res
        .status(404)
        .json({ success: false, message: "Express company not found." });
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
      res
        .status(404)
        .json({ success: false, message: "Express company not found." });
    } else {
      res.status(200).json({
        success: true,
        messgae: "Successfully delete express company.",
        data: eCompany,
      });
    }
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const getAllexpressCompany = async (req, res) => {
  try {
    const page = parseInt(req.query.page);
    const limit = parseInt(req.query.limit || 10);
    let filters = {};

    const eCompany = await expressCompany
      .find(filters)
      .limit(limit)
      .skip(page * limit);
    if (!eCompany) {
      return res
        .status(404)
        .json({ success: false, message: "Express company not found." });
    } else {
      res.status(200).json({
        success: true,
        messgae: "Successfully get all express company.",
        total: eCompany.length,
        data: eCompany,
      });
    }
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const getOneExpressCompany = async (req, res) => {
  const { id } = req.params;
  try {
    const eCompany = await expressCompany.findById(id);

    if (!eCompany) {
      return res
        .status(404)
        .json({ success: false, message: "Express company not found." });
    }
    // Trả về thông tin người dùng
    res.status(200).json({
      success: true,
      message: "Successfully get express company information.",
      data: eCompany,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
