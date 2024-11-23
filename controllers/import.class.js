import Import from "../models/import.model.js";
import Warehouse from "../models/warehouse.model.js";
import mongoose from "mongoose";

// Create a new import item and update warehouse stock
// Create a new import item and update warehouse stock
export const createImportItem = async (req, res) => {
  const session = await mongoose.startSession();
  session.startTransaction();

  try {
    const {
      idProduct,
      nameOfProduct,
      quantity,
      priceImport,
      idProvider,
      nameOfProvider,
    } = req.body;

    // Kiểm tra nếu sản phẩm đã tồn tại trong bảng Import
    let existingImportItem = await Import.findOne({ idProduct }).session(
      session
    );

    if (existingImportItem) {
      // Nếu tồn tại, cập nhật số lượng thay vì tạo mới
      existingImportItem.quantity += Number(quantity);
      await existingImportItem.save({ session });
    } else {
      // Nếu chưa tồn tại, tạo mới
      const newImportItem = new Import({
        idProduct,
        nameOfProduct,
        quantity,
        priceImport,
        idProvider,
        nameOfProvider,
        dateImport: new Date(),
      });

      await newImportItem.save({ session });
    }

    // Cập nhật kho hàng
    let warehouseItem = await Warehouse.findOne({ idProduct }).session(session);

    if (warehouseItem) {
      // Nếu sản phẩm tồn tại trong kho, cộng dồn số lượng
      warehouseItem.quantity += Number(quantity);
      await warehouseItem.save({ session });
    } else {
      // Nếu sản phẩm chưa tồn tại, thêm mới vào kho
      const newWarehouseItem = new Warehouse({
        idProduct,
        nameOfProduct,
        quantity,
        idProvider,
        nameOfProvider,
      });
      await newWarehouseItem.save({ session });
    }

    // Cam kết giao dịch
    await session.commitTransaction();
    session.endSession();

    res.status(201).json({
      success: true,
      message: "Cập nhật kho và sản phẩm nhập khẩu thành công.",
    });
  } catch (error) {
    // Rollback giao dịch nếu có lỗi
    await session.abortTransaction();
    session.endSession();

    console.error("Error creating import:", error);
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// Cập nhật sản phẩm nhập khẩu theo _id
export const updateImportItemByID = async (req, res) => {
  try {
    const { id } = req.params;
    const updatedData = { ...req.body };

    const updatedImportItem = await Import.findByIdAndUpdate(id, updatedData, {
      new: true,
    });

    if (!updatedImportItem) {
      return res.status(404).json({
        success: false,
        message: "Sản phẩm nhập khẩu không tìm thấy.",
      });
    }

    res.status(200).json({
      success: true,
      message: "Cập nhật sản phẩm nhập khẩu thành công.",
      data: updatedImportItem,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// Xóa sản phẩm nhập khẩu theo _id
export const deleteImportItemByID = async (req, res) => {
  try {
    const { id } = req.params;
    const deletedImportItem = await Import.findByIdAndDelete(id);

    if (!deletedImportItem) {
      return res.status(404).json({
        success: false,
        message: "Sản phẩm nhập khẩu không tìm thấy.",
      });
    }

    res.status(200).json({
      success: true,
      message: "Xóa sản phẩm nhập khẩu thành công.",
      data: deletedImportItem,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// Lấy danh sách tất cả sản phẩm nhập khẩu
// Lấy danh sách tất cả sản phẩm nhập khẩu
export const getAllImportItems = async (req, res) => {
  try {
    const importItems = await Import.find({}); // No pagination, fetch all items

    res.status(200).json({
      success: true,
      message: "Lấy danh sách sản phẩm nhập khẩu thành công.",
      total: importItems.length, // Total number of import items
      data: importItems, // Return all import items
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// Lấy chi tiết sản phẩm nhập khẩu theo _id
export const getImportItem = async (req, res) => {
  try {
    const { id } = req.params;
    const importItem = await Import.findById(id);

    if (!importItem) {
      return res.status(404).json({
        success: false,
        message: "Sản phẩm nhập khẩu không tìm thấy.",
      });
    }

    res.status(200).json({
      success: true,
      message: "Lấy thông tin sản phẩm nhập khẩu thành công.",
      data: importItem,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// Tìm kiếm sản phẩm nhập khẩu
export const listImportItemSearch = async (req, res) => {
  const { name, idProduct } = req.query;
  let filters = {};

  if (name) filters.nameOfProduct = { $regex: name, $options: "i" };
  if (idProduct) filters.idProduct = { $regex: idProduct, $options: "i" };

  try {
    const importItems = await Import.find(filters);

    res.status(200).json({
      success: true,
      message: "Tìm kiếm sản phẩm nhập khẩu thành công.",
      total: importItems.length,
      data: importItems,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
