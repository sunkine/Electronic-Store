import express from "express";
import {
  getAllProviders,
  createProvider,
  updateProviderByID,
  deleteProviderByID,
  getProvider,
} from "../controllers/provider.class.js";

const router = express.Router();

router.get("/:id", getProvider);
router.get("/", getAllProviders);
router.post("/", createProvider);
router.put("/:id", updateProviderByID);
router.delete("/:id", deleteProviderByID);

export default router;
