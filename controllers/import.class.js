import Import from "../models/import.model.js"; 
import Counter from "../models/counter.model.js"; 
import Warehouse from "../models/warehouse.model.js"; 

// Create new import item and add it to the warehouse
export const createImportItem = async (req, res) => {
  try {
    // Increment the counter for unique idImport
    const counter = await Counter.findOneAndUpdate(
      { _id: 'importId' },
      { $inc: { seq: 1 } },
      { new: true, upsert: true }
    );

    const idImport = `IP${counter.seq.toString().padStart(3, '0')}`;

    // Create the new import item with idImport and current date
    const newImportItem = new Import({
      ...req.body,
      idImport,
      dateImport: new Date() // Explicitly set current date if needed
    });

    await newImportItem.save(); // Save the import item

    // Extract fields for the warehouse entry
    const { idProduct, nameOfProduct, quantity, idProvider, nameOfProvider } = req.body;

    // Check if the product already exists in the warehouse
    const existingProduct = await Warehouse.findOne({ idProduct });
    if (!existingProduct) {
      // If product doesn't exist, add it to the warehouse
      const newWarehouseItem = new Warehouse({
        idProduct,
        nameOfProduct,
        quantity,
        idProvider,
        nameOfProvider
      });
      await newWarehouseItem.save();
    } else {
      // If product exists, just update the quantity
      await Warehouse.findOneAndUpdate(
        { idProduct },
        { $inc: { quantity: quantity } },
        { new: true }
      );
    }

    res.status(201).json({
      success: true,
      message: "Tạo sản phẩm nhập khẩu thành công và đã cập nhật kho.",
      data: newImportItem,
    });
  } catch (error) {
    if (error.name === 'MongoError' && error.code === 11000) {
      return res.status(400).json({ success: false, message: "Sản phẩm nhập khẩu đã tồn tại." });
    }
    res.status(500).json({ success: false, message: error.message });
  }
};

// Cập nhật sản phẩm nhập khẩu theo ID
export const updateImportItemByID = async (req, res) => {
  try {
    const idImport = req.params.id;
    const updatedData = { ...req.body };

    const updatedImportItem = await Import.findOneAndUpdate(
      { idImport },
      updatedData,
      { new: true }
    );

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

// Xóa sản phẩm nhập khẩu theo ID
export const deleteImportItemByID = async (req, res) => {
    try {
      const { id } = req.params;
      const deletedImportItem = await Import.findOneAndDelete({ idImport: id });
  
      if (!deletedImportItem) {
        return res.status(404).json({
          success: false,
          message: "Sản phẩm nhập khẩu không tìm thấy.",
        });
      }
  
      // Kiểm tra xem có phải đã xóa hết các sản phẩm nhập khẩu không
      const remainingImports = await Import.countDocuments({});
      
      if (remainingImports === 0) {
        // Nếu không còn sản phẩm nhập khẩu, reset counter về 1
        await Counter.findOneAndUpdate(
          { _id: 'importId' },  // Tìm bộ đếm với id 'importId'
          { $set: { seq: 1 } },  // Reset seq về 1
          { new: true, upsert: true }  // Tạo mới nếu không tồn tại
        );
      }
  
      res.status(200).json({
        success: true,
        message: "Sản phẩm nhập khẩu đã được xóa thành công.",
        data: deletedImportItem,
      });
    } catch (error) {
      res.status(500).json({ success: false, message: error.message });
    }
  };
  

// Lấy tất cả sản phẩm nhập khẩu
export const getAllImportItems = async (req, res) => {
  const page = parseInt(req.query.page) || 0;
  try {
    const importItems = await Import
      .find({})
      .limit(10)
      .skip(page * 10);

    res.status(200).json({
      success: true,
      message: "Lấy tất cả sản phẩm nhập khẩu thành công.",
      total: importItems.length,
      data: importItems,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// Lấy thông tin một sản phẩm nhập khẩu theo ID
export const getImportItem = async (req, res) => {
  try {
    const id = req.params.id;
    const importItem = await Import.findOne({ idImport: id });

    if (!importItem) {
      return res.status(404).json({ success: false, message: "Sản phẩm nhập khẩu không tìm thấy." });
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
  const { name, idImport } = req.query;
  let filters = {};

  if (name) filters.nameOfImport = { $regex: name, $options: "i" };
  if (idImport) filters.idImport = { $regex: idImport, $options: "i" };

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
