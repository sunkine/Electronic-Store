import Product from "../models/product.model.js";
import detailProduct from "../models/detailProduct.model.js";

export const createProduct = async (req, res) => {
  try {
    const productData = req.body;
    const imageUrl = productData.image || ""; // Get image URL from body if it's sent from frontend

    // If no image URL is sent, fallback to using local upload (if file upload exists)
    const imagePath = req.file ? req.file.path.replace(/\\/g, "/") : imageUrl;

    // Create a new product object
    const newProduct = new Product({
      ...productData,
      image: imagePath, // Store the image URL or path
    });

    await newProduct.save(); // Save the new product in the database

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
    const idProduct = req.params.id;
    const updatedData = req.body;

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
    const { id } = req.params; // Get the product ID from the params

    // Delete the product by its _id
    const deletedProduct = await Product.findByIdAndDelete(id);

    if (!deletedProduct) {
      return res.status(404).json({
        success: false,
        message: "Product not found.",
      });
    }

    // Attempt to delete the associated product details
    const deleteDetailProduct = await detailProduct.findOneAndDelete({
      idProduct: id,
    });

    // If no associated detail found, don't throw an error but inform the client
    if (!deleteDetailProduct) {
      console.log(`No detail found for product with id ${id}`);
      // You can either return success here or handle differently based on your requirements.
    }

    res.status(200).json({
      success: true,
      message: "Product deleted successfully.",
      dataProduct: deletedProduct,
      dataDetail: deleteDetailProduct || "No associated detail found.",
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const getAllProducts = async (req, res) => {
  try {
    // Build query if filters are provided in the request
    const { nameOfProduct, typeProduct } = req.query;
    let query = {};
    if (nameOfProduct) {
      query.nameOfProduct = { $regex: nameOfProduct, $options: "i" };
    }
    if (typeProduct) {
      query.typeProduct = { $regex: typeProduct, $options: "i" };
    }

    // Fetch all products based on query (no pagination applied)
    const products = await Product.find(query);

    // Check if no products are found
    if (!products || products.length === 0) {
      return res
        .status(404)
        .json({ success: false, message: "No products found." });
    }

    // Respond with all matching products
    res.status(200).json({
      success: true,
      message: "Successfully retrieved all products.",
      total: products.length,
      data: products,
    });
  } catch (error) {
    // Handle errors
    res.status(500).json({ success: false, message: error.message });
  }
};

export const getProduct = async (req, res) => {
  try {
    const id = req.params.id;
    // Tìm sản phẩm theo id và populate trường detail

    const product = await Product.findById(id).populate("detail");

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