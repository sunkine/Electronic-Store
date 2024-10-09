import products from "../models/products.model.js";

export const createProduct = async (req, res) => {
  try {
    const productData = req.body;  // Lấy dữ liệu sản phẩm từ request body
    const newProduct = new products(productData); // Tạo đối tượng mới từ model
    await newProduct.save();  // Lưu sản phẩm mới vào database

    res.status(201).json({
      success: true,
      message: "Product created successfully.",
      data: newProduct,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
export const updateProductByID = async (req, res) => {
  try {
    const { ID_Product } = req.params;  // Lấy ID_Product từ params
    const updatedData = req.body;  // Dữ liệu cập nhật từ request body

    const updatedProduct = await products.findOneAndUpdate({ ID_Product }, updatedData, { new: true });  // Cập nhật sản phẩm theo ID_Product

    if (!updatedProduct) {
      return res.status(404).json({
        success: false,
        message: "Product not found.",
      });
    }

    res.status(200).json({
      success: true,
      message: "Product updated successfully.",
      data: updatedProduct,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const deleteProductByID = async (req, res) => {
  try {
    const { ID_Product } = req.params;  // Lấy ID_Product từ params
    const deletedProduct = await products.findOneAndDelete({ ID_Product });  // Xóa sản phẩm theo ID_Product

    if (!deletedProduct) {
      return res.status(404).json({
        success: false,
        message: "Product not found.",
      });
    }

    res.status(200).json({
      success: true,
      message: "Product deleted successfully.",
      data: deletedProduct,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

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
export const getProduct = async (req, res) => {
  try {
    const { ID_Product } = req.params;  // Lấy ID_Product từ params
    const product = await products.findOne({ ID_Product });  // Tìm sản phẩm theo ID_Product

    if (!product) {
      return res
        .status(404)
        .json({ success: false, message: "Product not found." });
    } else {
      res.status(200).json({
        success: true,
        message: "Successfully retrieved the product.",
        data: product,
      });
    }
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export default {getAllProducts, createProduct, updateProductByID, deleteProductByID, getProduct}


