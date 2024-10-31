import express from 'express';
import { addToCart, deleteFromCart, getAllCart } from '../controllers/cart.class.js';
import { isLoggedin } from '../middlewares/checkLogin.js';

const router = express.Router();

router.post('/', isLoggedin, addToCart);
router.delete('/', isLoggedin, deleteFromCart);
router.get('/', getAllCart)

export default router;
