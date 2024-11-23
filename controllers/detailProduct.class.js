import detailProduct from "../models/detailProduct.model.js";
import Product from "../models/product.model.js";

export const getDetailProduct = async (req, res) => {
  try {
    const id = req.params.id;
    const product = await detailProduct.findOne({ idProduct: id });
    if (!product) {
      res.status(404).json({
        success: false,
        message: "Product dont have detail information",
      });
    } else {
      res.status(200).json({
        success: true,
        message: "Successfully get detail of product.",
        data: product,
      });
    }
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const deleteDetailProductByID = async (req, res) => {
  try {
    const { id } = req.params; // Lấy id từ params

    // Xóa chi tiết sản phẩm theo ID
    const deletedDetailProduct = await detailProduct.findByIdAndDelete(id);

    if (!deletedDetailProduct) {
      return res.status(404).json({
        success: false,
        message: "Detail product not found.",
      });
    }

    // Cập nhật sản phẩm liên quan để xóa liên kết chi tiết
    const updatedProduct = await Product.findOneAndUpdate(
      { detail: id }, // Tìm sản phẩm có chi tiết này
      { detail: null }, // Đặt trường detail thành null
      { new: true } // Trả về sản phẩm đã cập nhật
    );

    if (!updatedProduct) {
      return res.status(404).json({
        success: false,
        message: "No product found linked to this detail.",
      });
    }

    res.status(200).json({
      success: true,
      message: "Detail product deleted successfully.",
      data: deletedDetailProduct,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const createDetailProduct = async (req, res) => {
  try {
    const { idProduct, detailDescription } = req.body;

    const isExistProduct = await Product.findById(idProduct);

    if (!isExistProduct) {
      return res
        .status(404)
        .json({ success: false, message: "Product are not found." });
    }

    // Tạo một chi tiết sản phẩm mới
    const newDetailProduct = new detailProduct({
      idProduct,
      detailDescription,
    });

    // Lưu chi tiết sản phẩm vào cơ sở dữ liệu
    await newDetailProduct.save();

    isExistProduct.detail = newDetailProduct._id;
    await isExistProduct.save();

    await res.status(201).json({
      success: true,
      message: "Detail product created successfully.",
      data: newDetailProduct,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const getAllDetailProducts = async (req, res) => {
  const page = parseInt(req.query.page);
  try {
    const detailProducts = await detailProduct
      .find({})
      .limit(10)
      .skip(page * 10);
    if (!detailProducts) {
      return res
        .status(404)
        .json({ success: false, message: "Products are empty." });
    } else {
      res.status(200).json({
        success: true,
        message: "Successfully get all detail products.",
        total: detailProducts.length,
        data: detailProducts,
      });
    }
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const updateDetailProduct = async (req, res) => {
  try {
    const idProduct = req.params.id;
    const detailDescription = req.body;

    const isExistProduct = await detailProduct.findOneAndUpdate(
      { idProduct },
      detailDescription,
      { new: true }
    );

    if (!isExistProduct) {
      return res
        .status(404)
        .json({ success: false, message: "Product are not found." });
    }

    res.status(201).json({
      success: true,
      message: "Detail product updated successfully.",
      data: isExistProduct,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
