import express from "express";
import { getAllProviders, createProvider, updateProviderByID, deleteProviderByID, getProvider, listProviderSearch } from '../controllers/provider.class.js';

const router = express.Router();

// Lấy thông tin một nhà cung cấp theo ID
router.get('/:id', getProvider);

// Lấy tất cả nhà cung cấp
router.get('/', getAllProviders);

// Tạo nhà cung cấp mới
router.post('/', createProvider); 

// Cập nhật nhà cung cấp theo ID
router.put('/:id', updateProviderByID);

// Xóa nhà cung cấp theo ID
router.delete('/:id', deleteProviderByID);

// Tìm kiếm nhà cung cấp
router.post('/search', listProviderSearch);

export default router;
