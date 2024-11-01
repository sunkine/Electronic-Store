import express from "express";
import { SignIn, verifyEmail, refreshAccessToken } from "../controllers/auth.class.js";

const router = express.Router();

//user sign in
router.post("/", SignIn);
router.get("/verify-email/:token", verifyEmail);
router.post('/refresh-token', refreshAccessToken);

export default router;
