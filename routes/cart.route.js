import express from "express";
import {
  addToCart,
  clearCart,
  deleteFromCart,
  getAllCart,
  getCartById,
} from "../controllers/cart.class.js";
import { isLoggedin } from "../middlewares/checkLogin.js";

const router = express.Router();

router.post("/", isLoggedin, addToCart);
router.post("/clear", isLoggedin, clearCart);
router.delete("/", isLoggedin, deleteFromCart);
router.get("/", getAllCart);
router.get("/:id", isLoggedin, getCartById);

export default router;