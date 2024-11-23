import express from "express";
import { deleteStaff, getAllStaff, getOneStaff, updateStaff } from "../controllers/staff.class.js";
import isAdmin from "../middlewares/checkAdmin.js";
import { isLoggedin } from "../middlewares/checkLogin.js";

const router = express.Router();

router.get("/", getAllStaff);
router.get("/:id", isLoggedin, getOneStaff);
router.put("/:id", isLoggedin, updateStaff);
router.delete("/:id", isLoggedin, isAdmin, deleteStaff);

export default router;
