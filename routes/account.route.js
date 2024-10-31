import express from 'express'
import {deleteAccount, updateAccount, getAllAccount, getAccount, SignUp} from '../controllers/account.class.js'
import { isLoggedin } from '../middlewares/checkLogin.js'
import isAdmin from '../middlewares/checkAdmin.js'

const router = express.Router()

//user sign up
router.post('/sign-up', SignUp)
//get all user
router.get('/:id', getAccount)
router.get('/', isLoggedin, isAdmin, getAllAccount)
//delete account
router.delete('/:id', isLoggedin, isAdmin, deleteAccount)
//update account
router.put('/:id', isLoggedin, updateAccount)

export default router;