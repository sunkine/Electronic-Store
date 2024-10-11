import express from 'express'
import { deleteUser, getAllUser, getOneUser, updateUser, createUser, forgotPasswordCtrl, resetPasswordCtrl } from "../controllers/user.class.js";
import { isLoggedin } from '../middlewares/checkLogin.js'

const router = express.Router()

//get all user
router.get('/', getAllUser)
//get one user
router.get('/:id', getOneUser)
//create a user
router.post('/create-user', createUser)
//update a user
router.put('/update-user/:id', updateUser)
//delete a user
router.delete('/delete-user/:id', deleteUser)
//forgot password
router.post('/forgot-password', isLoggedin, forgotPasswordCtrl)
router.get('/reset-password/:token', resetPasswordCtrl);

export default router;