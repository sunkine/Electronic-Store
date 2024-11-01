import Product from "../models/product.model.js";

export const createProduct = async (req, res) => {
  try {
    const productData = req.body; // Lấy dữ liệu sản phẩm từ request body
    const newProduct = new Product(productData); // Tạo đối tượng mới từ model
    await newProduct.save(); // Lưu sản phẩm mới vào database

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
    const id = req.params.id; 
    const updatedData = req.body; // Dữ liệu cập nhật từ request body

    const updatedProduct = await Product.findByIdAndUpdate(
      id,
      updatedData,
      { new: true }
    );

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
    const { ID_Product } = req.params; // Lấy ID_Product từ params
    const deletedProduct = await Product.findOneAndDelete({ ID_Product }); // Xóa sản phẩm theo ID_Product

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
  const page = parseInt(req.query.page);
  try {
    const product = await Product
      .find({})
      .limit(10)
      .skip(page * 10);
    if (!product) {
      return res
        .status(404)
        .json({ success: false, message: "Products are empty." });
    } else {
      res.status(200).json({
        success: true,
        message: "Successfully get all products.",
        total: product.length,
        data: product,
      });
    }
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const getProduct = async (req, res) => {
  try {
    const id = req.params.id;
    const acc = await Product.findById(id);
    if (!acc) {
      res.status(404).json({ success: false, message: "Product not found." });
    } else {
      res.status(200).json({
        success: true,
        message: "Successfully get product information.",
        data: acc,
      });
    }
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const listProductSearch = async (req, res) => {
  const { name, idTypeProduct } = req.query;
  let filters = {};

  if (name) filters.name = { $regex: name, $options: "i" };
  if (idTypeProduct) filters.idTypeProduct = { $regex: idTypeProduct, $options: "i" };

  try {
    const products = await Product.find(filters);
    res.status(200).json({
      success: true,
      message: "Successfully search item.",
      total: products.length,
      data: products,
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
