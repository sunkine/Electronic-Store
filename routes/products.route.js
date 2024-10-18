import express from "express";
import { getAllProducts, createProduct, updateProductByID, deleteProductByID, getProduct } from '../controllers/product.class.js';

const router = express.Router();

router.get('/:ID_Product', getProduct);

router.get('/', getAllProducts);

router.post('/', createProduct);

router.put('/:ID_Product', updateProductByID);

router.delete('/:ID_Product', deleteProductByID);

export default router;