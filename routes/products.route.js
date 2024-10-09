import express from "express";
import { getAllProducts, createProduct, updateProductByID, deleteProductByID, getProduct } from '../controllers/product.class.js';

const router = express.Router();

router.get('/:ID_Product', getProduct);

router.get('/list-all-product', getAllProducts);

router.post('/create-product', createProduct);

router.put('/update-product/:ID_Product', updateProductByID);

router.delete('/delete-product/:ID_Product', deleteProductByID);

export default router;