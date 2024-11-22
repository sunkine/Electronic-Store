// In statistics.route.js
import express from 'express';
import { getBestSellingProducts } from '../controllers/statistics.class.js';

const router = express.Router();

// Endpoint to get best-selling products
router.get('/best-selling', getBestSellingProducts);

export default router;
