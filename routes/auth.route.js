import express from "express";
import { SignIn, verifyEmail } from "../controllers/auth.class.js";
const router = express.Router();

//user sign in
router.post("/", SignIn);
router.get("/verify-email/:token", verifyEmail);

export default router;
