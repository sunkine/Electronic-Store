import Warehouse from "../models/warehouse.model.js";

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
    if (error.name === 'MongoError' && error.code === 11000) {
      return res.status(400).json({ success: false, message: "Sản phẩm đã tồn tại." });
    }
    res.status(500).json({ success: false, message: error.message });
  }
};

// Cập nhật sản phẩm theo ID
export const updateWarehouseItemByID = async (req, res) => {
  try {
    const idProduct = req.params.id;
    const updatedData = { ...req.body };

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

    res.status(200).json({
      success: true,
      message: "Cập nhật sản phẩm thành công.",
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
    const deletedWarehouseItem = await Warehouse.findOneAndDelete({ idProduct: id });

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

// Lấy tất cả sản phẩm
export const getAllWarehouseItems = async (req, res) => {
  const page = parseInt(req.query.page) || 0;
  try {
    const warehouseItems = await Warehouse
      .find({})
      .limit(10)
      .skip(page * 10);

    // Update this part to return success even if the array is empty
    res.status(200).json({
      success: true,
      message: "Lấy tất cả sản phẩm thành công.",
      total: warehouseItems.length,
      data: warehouseItems,
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
      return res.status(404).json({ success: false, message: "Sản phẩm không tìm thấy." });
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
