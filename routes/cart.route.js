import express from "express";
import {
  addToCart,
  deleteFromCart,
  getAllCart,
  getCartById,
} from "../controllers/cart.class.js";
import { isLoggedin } from "../middlewares/checkLogin.js";

const router = express.Router();

router.get("/", getAllCart);
router.post("/", isLoggedin, addToCart);
router.get("/:id", isLoggedin, getCartById);
router.delete("/:id", isLoggedin, deleteFromCart);

export default router;