import express from 'express';
import { addToCart, deleteFromCart, getAllCart } from '../controllers/cart.class.js';
import { isLoggedin } from '../middlewares/checkLogin.js';

const router = express.Router();

router.post('/add-to-cart', isLoggedin, addToCart);
router.delete('/delete-from-cart', isLoggedin, deleteFromCart);
router.get('/', getAllCart)

export default router;
