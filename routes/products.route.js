import express from "express";

import { getAllProducts, createProduct, updateProductByID, deleteProductByID, getProduct, listProductSearch } from '../controllers/product.class.js';
import upload from '../middlewares/upload.js';
import { isLoggedin } from "../middlewares/checkLogin.js";
import isAdmin from "../middlewares/checkAdmin.js";


const router = express.Router();

router.get('/', getAllProducts);

router.post('/', upload.single('image'),isLoggedin, isAdmin, createProduct); 

router.put('/:id', upload.single('image'),isLoggedin, isAdmin, updateProductByID);

router.delete('/:id', isLoggedin, isAdmin, deleteProductByID);

router.post('/search', listProductSearch);

export default router;

