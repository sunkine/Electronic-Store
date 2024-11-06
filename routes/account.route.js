import express from "express";
import {
  deleteAccount,
  updateAccount,
  getAllAccount,
  getAccount,
  SignUp,
  forgotPasswordCtrl,
  resetPasswordCtrl,
  disableAccount
} from "../controllers/account.class.js";
import { isLoggedin } from "../middlewares/checkLogin.js";
import isAdmin from "../middlewares/checkAdmin.js";

const router = express.Router();

router.post("/sign-up", SignUp);
router.get("/information", isLoggedin, getAccount);
router.get("/", isLoggedin, isAdmin, getAllAccount);
router.delete("/:id", isLoggedin, isAdmin, deleteAccount);
router.put("/:id", isLoggedin, updateAccount);
router.put("/disable/:id", isLoggedin, isAdmin, disableAccount)
router.post("/forgot-password", forgotPasswordCtrl);
router.get("/reset-password/:token", resetPasswordCtrl);

export default router;
