import express from "express";
import { isLoggedin } from "../middlewares/checkLogin.js";
import isAdmin from "../middlewares/checkAdmin.js";
import {
  createDetailProduct,
  deleteDetailProductByID,
  getAllDetailProducts,
  getDetailProduct,
  updateDetailProduct,
} from "../controllers/detailProduct.class.js";

const router = express.Router();

router.get("/", getAllDetailProducts);
router.get("/:id", getDetailProduct);
router.post("/", isLoggedin, isAdmin, createDetailProduct);
router.delete("/:id", isLoggedin, isAdmin, deleteDetailProductByID);
router.put("/:id", isLoggedin, isAdmin, updateDetailProduct);

export default router;
