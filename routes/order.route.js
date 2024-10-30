import express from 'express'
import {createOrder} from "../controllers/order.class.js"

const router = express.Router()

//create order
router.post("/", createOrder)

export default router;