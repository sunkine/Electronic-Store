import express from "express";
import { getAllProducts, createProduct, updateProductByID, deleteProductByID, getProduct, listProductSearch } from '../controllers/product.class.js';

const router = express.Router();

router.get('/:id', getProduct);

router.get('/', getAllProducts);

router.post('/', createProduct);

router.put('/:id', updateProductByID);

router.delete('/:id', deleteProductByID);

router.post('/search', listProductSearch)

export default router;