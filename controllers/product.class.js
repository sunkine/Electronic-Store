import Product from "../models/product.model.js";
import detailProduct from "../models/detailProduct.model.js";

export const createProduct = async (req, res) => {
  try {
    const productData = req.body; // Dữ liệu sản phẩm từ request body
    const imagePath = req.file ? req.file.path : ""; // Kiểm tra nếu có tệp hình ảnh được tải lên

    // Tạo đối tượng sản phẩm mới
    const newProduct = new Product({
      ...productData,
      image: imagePath, // Lưu đường dẫn hình ảnh vào cơ sở dữ liệu
    });

    // Lưu sản phẩm mới vào cơ sở dữ liệu
    await newProduct.save(); 

    // Tạo chi tiết sản phẩm mới
    const newDetailProduct = new detailProduct({
      idProduct: newProduct._id, // Liên kết với sản phẩm vừa tạo
      description: productData.detailDescription, // Mô tả chi tiết
    });

    // Lưu chi tiết sản phẩm vào cơ sở dữ liệu
    await newDetailProduct.save();

    // Cập nhật lại sản phẩm để liên kết chi tiết
    newProduct.detail = newDetailProduct._id;
    await newProduct.save(); // Lưu lại sản phẩm với thông tin chi tiết

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
    const deleteDetailProduct = await detailProduct.findOneAndDelete({idProduct: id}) //Xóa detail product theo id Product
  
    if (!deletedProduct) {
      return res.status(404).json({
        success: false,
        message: "Product not found.",
      });
    }

    if (!deleteDetailProduct) {
      return res.status(404).json({
        success: false,
        message: "Detail product of product not found.",
      });
    }

    res.status(200).json({
      success: true,
      message: "Product deleted successfully.",
      dataProduct: deletedProduct,
      dataDetail: deleteDetailProduct,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const getAllProducts = async (req, res) => {
  const { nameOfProduct, typeProduct } = req.query;
  let query = {};

  if (nameOfProduct) query.nameOfProduct = { $regex: nameOfProduct, $options: "i" };
  if (typeProduct) query.typeProduct = { $regex: typeProduct, $options: "i" };
  const page = parseInt(req.query.page);
  try {
    const product = await Product
      .find(query)
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
    // Tìm sản phẩm theo id và populate trường detail
    const product = await Product.findById(id).populate('detail');

    if (!product) {
      res.status(404).json({ success: false, message: "Product not found." });
    } else {
      res.status(200).json({
        success: true,
        message: "Successfully get product information.",
        data: product,
      });
    }
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};