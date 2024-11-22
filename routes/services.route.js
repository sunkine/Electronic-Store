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
  disableAccount
} from "../controllers/account.class.js";

import { clearCart } from "../controllers/cart.class.js";
import { isLoggedin } from "../middlewares/checkLogin.js";
import isAdmin from "../middlewares/checkAdmin.js";

const router = express.Router();

//payment with zalopay
router.post("/payment", payment)
router.post("/callback", callback)
router.post("/order-status", checkStatusOrder)

//service of account
router.put("/disable/:id", isLoggedin, isAdmin, disableAccount)
router.post("/forgot-password", forgotPasswordCtrl);
router.get("/reset-password/:token", resetPasswordCtrl);

//clear cart of account
router.post("/clear", isLoggedin, clearCart);

//get detail of order
router.get("/order/:id", getOrderDetails)

export default router;