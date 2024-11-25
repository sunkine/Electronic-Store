import express from "express";
import {
  payment,
  callback,
  checkStatusOrder,
  getOrderDetails,
} from "../controllers/order.class.js";

import {
  forgotPasswordCtrl,
  resetPasswordCtrl,
  updatePassword,
  resendEmailVerification,
  SignUp,
  SignOut
} from "../controllers/account.class.js";

import { clearCart } from "../controllers/cart.class.js";
import { isLoggedin } from "../middlewares/checkLogin.js";
import { getOrderByIdStaff } from "../controllers/staff.class.js";

const router = express.Router();

//payment with zalopay
router.post("/payment", payment);
router.post("/callback", callback);
router.post("/order-status", checkStatusOrder);

//service of account
router.put("/change-password", isLoggedin, updatePassword);
router.post("/forgot-password", forgotPasswordCtrl);
router.put("/reset-password/:token", resetPasswordCtrl);
router.post("/resend-email-vertification", resendEmailVerification);
router.post("/sign-up", SignUp);
router.post("/sign-out", SignOut)

//clear cart of account
router.post("/clear", isLoggedin, clearCart);

//get detail of order
router.get("/order/:id", getOrderDetails);
router.get("/staffOrder/:id", getOrderByIdStaff)

export default router;
