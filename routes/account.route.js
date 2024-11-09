import express from "express";
import {
  deleteAccount,
  updateAccount,
  getAllAccount,
  getAccount,
  SignUp,
} from "../controllers/account.class.js";
import { isLoggedin } from "../middlewares/checkLogin.js";
import isAdmin from "../middlewares/checkAdmin.js";

const router = express.Router();

router.get("/", isLoggedin, isAdmin, getAllAccount);
router.get("/:id", isLoggedin, getAccount);
router.post("/", SignUp)
router.delete("/:id", isLoggedin, isAdmin, deleteAccount);
router.put("/:id", isLoggedin, updateAccount)

export default router;
