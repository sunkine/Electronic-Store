import express from "express";
import {
  addToCart,
  deleteFromCart,
  getAllCart,
  getCartById,
  updateCart,
} from "../controllers/cart.class.js";
import { isLoggedin } from "../middlewares/checkLogin.js";

const router = express.Router();

router.get("/", getAllCart);
router.get("/:id", isLoggedin, getCartById);
router.post("/", isLoggedin, addToCart);
router.put("/:id", isLoggedin, updateCart);
router.delete("/:id", isLoggedin, deleteFromCart);

export default router;
