import express from "express";
import {
  SignIn,
  verifyEmail,
  refreshAccessToken,
  verifyPayment,
} from "../controllers/auth.class.js";

const router = express.Router();

//user sign in
router.post("/", SignIn);
router.get("/verify-email/:token", verifyEmail);
router.post("/refresh-token", refreshAccessToken);
router.get("/verify-payment/:token", verifyPayment);

export default router;
