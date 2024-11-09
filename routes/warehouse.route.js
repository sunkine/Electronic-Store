import express from "express";
import { 
  getAllWarehouseItems, 
  createWarehouseItem, 
  updateWarehouseItemByID, 
  deleteWarehouseItemByID, 
  getWarehouseItem, 
  listWarehouseItemSearch 
} from '../controllers/warehouse.class.js';
import { isLoggedin } from "../middlewares/checkLogin.js";
import isAdmin from "../middlewares/checkAdmin.js";
import upload from '../middlewares/upload.js';

const router = express.Router();

// Route to get a specific warehouse item by ID
router.get('/:id', getWarehouseItem);

// Route to get all warehouse items
router.get('/', getAllWarehouseItems);

// Route to create a new warehouse item
router.post('/', upload.single('image'), isLoggedin, isAdmin, createWarehouseItem);

// Route to update an existing warehouse item by ID
router.put('/:id', upload.single('image'), isLoggedin, isAdmin, updateWarehouseItemByID);

// Route to delete a warehouse item by ID
router.delete('/:id', isLoggedin, isAdmin, deleteWarehouseItemByID);

// Route to search for warehouse items based on query parameters
router.post('/search', listWarehouseItemSearch);

export default router;
