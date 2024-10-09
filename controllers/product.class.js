import products from "../models/products.model.js";

export const getAllProducts = async (req, res) => {
  try {
    const product = await products.find();
    if (!product) {
      return res
        .status(404)
        .json({ success: false, message: "Products are empty." });
    } else {
      res.status(200).json({
        success: true,
        messgae: "Successfully get all products.",
        data: product,
      });
    }
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export default getAllProducts
