import express from "express";
import { getAllProducts, createProduct, updateProductByID, deleteProductByID, getProduct, listProductSearch } from '../controllers/product.class.js';
import isAdmin from "../middlewares/checkAdmin.js";
import { isLoggedin } from "../middlewares/checkLogin.js";

const router = express.Router();

router.get('/:id', getProduct);

router.get('/', getAllProducts);

router.post('/', isLoggedin, isAdmin, createProduct);

router.put('/:id', isLoggedin,isAdmin, updateProductByID);

router.delete('/:id', isLoggedin, isAdmin, deleteProductByID);

router.post('/search', listProductSearch)

export default router;