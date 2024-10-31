import express from 'express'
import { deleteUser, getAllUser, getOneUser, updateUser} from "../controllers/user.class.js";
import { isLoggedin } from '../middlewares/checkLogin.js';
import isAdmin from '../middlewares/checkAdmin.js';

const router = express.Router()

//get all user
router.get('/', isLoggedin, isAdmin, getAllUser)
//get one user
router.get('/information', isLoggedin, getOneUser)
//update a user
router.put('/', isLoggedin, updateUser)
//delete a user
router.delete('/:id', isLoggedin, isAdmin, deleteUser)

export default router;