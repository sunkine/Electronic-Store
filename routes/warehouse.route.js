import express from "express";
import { getAllWarehouseItems, createWarehouseItem, updateWarehouseItemByID, deleteWarehouseItemByID, getWarehouseItem, listWarehouseItemSearch } from '../controllers/warehouse.class.js';

const router = express.Router();

// Lấy thông tin một sản phẩm theo ID
router.get('/:id', getWarehouseItem);

// Lấy tất cả sản phẩm
router.get('/', getAllWarehouseItems);

// Tạo sản phẩm mới
router.post('/', createWarehouseItem);

// Cập nhật sản phẩm theo ID
router.put('/:id', updateWarehouseItemByID);

// Xóa sản phẩm theo ID
router.delete('/:id', deleteWarehouseItemByID);

// Tìm kiếm sản phẩm
router.post('/search', listWarehouseItemSearch);

export default router;