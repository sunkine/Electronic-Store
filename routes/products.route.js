import express from "express";
import { getAllProducts, createProduct, updateProductByID, deleteProductByID, getProduct, listProductSearch } from '../controllers/product.class.js';
import isAdmin from "../middlewares/checkAdmin.js";

const router = express.Router();

router.get('/:id', getProduct);

router.get('/', getAllProducts);

router.post('/', isAdmin, createProduct);

router.put('/:id', isAdmin, updateProductByID);

router.delete('/:id', isAdmin, deleteProductByID);

router.post('/search', listProductSearch)

export default router;