import Product from "../models/product.model.js";

export const createProduct = async (req, res) => {
  try {
    const productData = req.body; // Dữ liệu sản phẩm từ request body
    const imagePath = req.file ? req.file.path : ""; // Kiểm tra nếu có tệp hình ảnh được tải lên

    // Tạo đối tượng sản phẩm mới
    const newProduct = new Product({
      ...productData,
      image: imagePath, // Lưu đường dẫn hình ảnh vào cơ sở dữ liệu
    });

    await newProduct.save(); // Lưu sản phẩm mới vào cơ sở dữ liệu

    res.status(201).json({
      success: true,
      message: "Tạo sản phẩm thành công.",
      data: newProduct,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const updateProductByID = async (req, res) => {
  try {
    const idProduct = req.params.id;
    const updatedData = { ...req.body };

    // If there's a new image file, add its path to updatedData
    if (req.file) {
      updatedData.image = req.file.path.replace(/\\/g, '/'); // Adjust path format if necessary
    }

    console.log('Dữ liệu cập nhật:', updatedData);

    const updatedProduct = await Product.findOneAndUpdate(
      { idProduct },
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
    const { id } = req.params; // Lấy id từ params
    const deletedProduct = await Product.findOneAndDelete({ idProduct: id }); // Xóa sản phẩm theo idProduct

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

