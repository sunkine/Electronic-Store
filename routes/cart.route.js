import express from "express";
import {
  addToCart,
  deleteFromCart,
  getAllCart,
  getCartById,
} from "../controllers/cart.class.js";
import { isLoggedin } from "../middlewares/checkLogin.js";

const router = express.Router();

router.post("/", isLoggedin, addToCart);
router.delete("/", isLoggedin, deleteFromCart);
router.get("/", getAllCart);
router.get("/:id", isLoggedin, getCartById);

export default router;