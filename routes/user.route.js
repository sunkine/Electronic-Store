import express from 'express'
import { deleteUser, getAllUser, getOneUser, updateUser, forgotPasswordCtrl, resetPasswordCtrl } from "../controllers/user.class.js";
import { isLoggedin } from '../middlewares/checkLogin.js';
import isAdmin from '../middlewares/checkAdmin.js';
const router = express.Router()

//get all user
router.get('/', isLoggedin, isAdmin, getAllUser)
//get one user
router.get('/information', isLoggedin, getOneUser)
//update a user
router.put('/:id', isLoggedin, updateUser)
//delete a user
router.delete('/:id', isLoggedin, isAdmin, deleteUser)
//forgot password
router.post('/forgot-password', forgotPasswordCtrl)
router.get('/reset-password/:token', resetPasswordCtrl);

export default router;