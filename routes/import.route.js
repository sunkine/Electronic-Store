import express from "express";
import { 
  getAllImportItems, 
  createImportItem, 
  updateImportItemByID, 
  deleteImportItemByID, 
  getImportItem, 
  listImportItemSearch 
} from '../controllers/import.class.js';
import { isLoggedin } from "../middlewares/checkLogin.js";
import isAdmin from "../middlewares/checkAdmin.js";

const router = express.Router();

// Route to get a specific import item by ID
router.get('/:id', getImportItem);

// Route to get all import items
router.get('/', getAllImportItems);

// Route to create a new import item
router.post('/', isLoggedin, isAdmin, createImportItem);

// Route to update an existing import item by ID
router.put('/:id', isLoggedin, isAdmin, updateImportItemByID);

// Route to delete an import item by ID
router.delete('/:id', isLoggedin, isAdmin, deleteImportItemByID);

// Route to search for import items based on query parameters
router.post('/search', listImportItemSearch);

export default router;
