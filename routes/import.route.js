import express from "express";
import {
  getAllImportItems,
  createImportItem,
  updateImportItemByID,
  deleteImportItemByID,
  getImportItem,
} from "../controllers/import.class.js";
import { isLoggedin } from "../middlewares/checkLogin.js";
import isAdmin from "../middlewares/checkAdmin.js";

const router = express.Router();

router.get("/:id", getImportItem);
router.get("/", getAllImportItems);
router.post("/", createImportItem);
router.put("/:id", isLoggedin, isAdmin, updateImportItemByID);
router.delete("/:id", isLoggedin, isAdmin, deleteImportItemByID);

export default router;
