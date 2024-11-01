import express from "express";

import { getAllProducts, createProduct, updateProductByID, deleteProductByID, getProduct, listProductSearch } from '../controllers/product.class.js';
import upload from '../middlewares/upload.js';


const router = express.Router();

router.get('/', getAllProducts);

router.post('/', upload.single('image'), createProduct); 

router.put('/:id', upload.single('image'), updateProductByID);

router.delete('/:id', deleteProductByID);

router.post('/search', listProductSearch);

export default router;

