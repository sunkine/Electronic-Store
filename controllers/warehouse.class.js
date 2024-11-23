import Warehouse from "../models/warehouse.model.js";
import Order from "../models/order.model.js";
import mongoose from "mongoose";
// Tạo sản phẩm mới
export const createWarehouseItem = async (req, res) => {
  try {
    const warehouseData = req.body;

    // Tạo đối tượng sản phẩm mới
    const newWarehouseItem = new Warehouse(warehouseData);
    await newWarehouseItem.save();

    res.status(201).json({
      success: true,
      message: "Tạo sản phẩm thành công.",
      data: newWarehouseItem,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// Cập nhật sản phẩm theo ID
export const updateWarehouseItemByID = async (req, res) => {
  try {
    const idProduct = req.params.id;
    const updatedData = { ...req.body };

    // Cập nhật Warehouse
    const updatedWarehouseItem = await Warehouse.findOneAndUpdate(
      { idProduct },
      updatedData,
      { new: true }
    );

    if (!updatedWarehouseItem) {
      return res.status(404).json({
        success: false,
        message: "Sản phẩm không tìm thấy.",
      });
    }

    // Đồng bộ quantity của Product
    const Product = mongoose.model("Product");
    await Product.findOneAndUpdate(
      { idProduct },
      { quantity: updatedWarehouseItem.quantity }, // Cập nhật quantity
      { new: true }
    );

    res.status(200).json({
      success: true,
      message: "Cập nhật sản phẩm và đồng bộ hóa thành công.",
      data: updatedWarehouseItem,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// Xóa sản phẩm theo ID
export const deleteWarehouseItemByID = async (req, res) => {
  try {
    const { id } = req.params;
    const deletedWarehouseItem = await Warehouse.findOneAndDelete({
      idProduct: id,
    });

    if (!deletedWarehouseItem) {
      return res.status(404).json({
        success: false,
        message: "Sản phẩm không tìm thấy.",
      });
    }

    res.status(200).json({
      success: true,
      message: "Sản phẩm đã được xóa thành công.",
      data: deletedWarehouseItem,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// Lấy danh sách tất cả sản phẩm trong kho
export const getAllWarehouseItems = async (req, res) => {
  try {
    const warehouseItems = await Warehouse.find({}); // Fetch all items without pagination

    // Return success message even if the array is empty
    res.status(200).json({
      success: true,
      message: "Lấy tất cả sản phẩm trong kho thành công.",
      total: warehouseItems.length, // Total number of warehouse items
      data: warehouseItems, // Return all warehouse items
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// Lấy thông tin một sản phẩm theo ID
export const getWarehouseItem = async (req, res) => {
  try {
    const id = req.params.id;
    const warehouseItem = await Warehouse.findOne({ idProduct: id });

    if (!warehouseItem) {
      return res
        .status(404)
        .json({ success: false, message: "Sản phẩm không tìm thấy." });
    }

    res.status(200).json({
      success: true,
      message: "Lấy thông tin sản phẩm thành công.",
      data: warehouseItem,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// Tìm kiếm sản phẩm
export const listWarehouseItemSearch = async (req, res) => {
  const { name, idProduct } = req.query;
  let filters = {};

  if (name) filters.nameOfProduct = { $regex: name, $options: "i" };
  if (idProduct) filters.idProduct = { $regex: idProduct, $options: "i" };

  try {
    const warehouseItems = await Warehouse.find(filters);

    res.status(200).json({
      success: true,
      message: "Tìm kiếm sản phẩm thành công.",
      total: warehouseItems.length,
      data: warehouseItems,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const updateWarehouseAfterPayment = async (orderId) => {
  try {
    // Lấy thông tin đơn hàng
    const order = await Order.findById(orderId);
    if (!order) {
      throw new Error("Order not found");
    }

    // Lặp qua danh sách sản phẩm trong đơn hàng
    for (const product of order.products) {
      const { idProduct, quantity } = product;

      // Tìm sản phẩm trong kho
      const warehouseProduct = await Warehouse.findOne({ idProduct });

      if (!warehouseProduct) {
        throw new Error(`Product with ID ${idProduct} not found in warehouse`);
      }

      // Kiểm tra số lượng sản phẩm trong kho
      if (warehouseProduct.quantity < quantity) {
        throw new Error(
          `Insufficient quantity for product ${warehouseProduct.nameOfProduct}`
        );
      }

      // Trừ số lượng sản phẩm trong kho
      warehouseProduct.quantity -= quantity;
      await warehouseProduct.save();
    }
  } catch (error) {
    console.error("Error updating warehouse:", error.message);
    throw error;
  }
};
