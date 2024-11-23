import express from "express";
import {
  getAllProducts,
  createProduct,
  updateProductByID,
  deleteProductByID,
  getProduct,
} from "../controllers/product.class.js";
import { isLoggedin } from "../middlewares/checkLogin.js";
import isAdmin from "../middlewares/checkAdmin.js";
import upload from "../middlewares/upload.js";

const router = express.Router();

router.get("/", getAllProducts);
router.get("/:id", getProduct);
router.post("/", upload.single("image"), isLoggedin, isAdmin, createProduct);
router.put(
  "/:id",
  upload.single("image"),
  isLoggedin,
  isAdmin,
  updateProductByID
);
router.delete("/:id", isLoggedin, isAdmin, deleteProductByID);

export default router;
