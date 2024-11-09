import express from "express";
import {
  createOrder,
  deleteOrder,
  getAllOrder,
  updateOrder,
  getOrderById,
} from "../controllers/order.class.js";
import { isLoggedin } from "../middlewares/checkLogin.js";
import isAdmin from "../middlewares/checkAdmin.js";

const router = express.Router();

router.get("/", isLoggedin, isAdmin, getAllOrder);
router.get("/:id", isLoggedin, getOrderById);
router.post("/", isLoggedin, createOrder);
router.put("/:id", isLoggedin, isAdmin, updateOrder);
router.delete("/:id", isLoggedin, isAdmin, deleteOrder);

export default router;
