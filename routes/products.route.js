import express from "express";
import getAllProducts from '../controllers/product.class.js'

const router = express.Router()

router.get('/list-all-product', getAllProducts)

export default router;