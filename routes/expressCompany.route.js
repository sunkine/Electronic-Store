import express from "express";
import {
  createExpressCompany,
  deleteExpressCompany,
  getAllexpressCompany,
  getOneExpressCompany,
  updateExpressCompany,
} from "../controllers/expressCompany.class.js";

const router = express.Router();

router.get("/:id", getOneExpressCompany);
router.get("/", getAllexpressCompany);
router.post("/", createExpressCompany);
router.put("/:id", updateExpressCompany);
router.delete("/:id", deleteExpressCompany);

export default router;
