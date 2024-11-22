import express from "express";
import {
  deleteUser,
  getAllUser,
  getOneUser,
  updateUser,
} from "../controllers/user.class.js";
import { isLoggedin } from "../middlewares/checkLogin.js";
import isAdmin from "../middlewares/checkAdmin.js";

const router = express.Router();

router.get("/", getAllUser);
router.get("/:id", isLoggedin, getOneUser);
router.put("/:id", isLoggedin, updateUser);
router.delete("/:id", isLoggedin, isAdmin, deleteUser);

export default router;
