import express from 'express'
import {deleteAccount, updateAccount, getAllAccount, getAccount, SignUp, forgotPasswordCtrl, resetPasswordCtrl} from '../controllers/account.class.js'
import { isLoggedin } from '../middlewares/checkLogin.js'
import isAdmin from '../middlewares/checkAdmin.js'

const router = express.Router()

router.post('/sign-up', SignUp)
router.get('/:id', getAccount)
router.get('/', isLoggedin, isAdmin, getAllAccount)
router.delete('/:id', isLoggedin, isAdmin, deleteAccount)
router.put('/', isLoggedin, updateAccount)
router.post('/forgot-password', forgotPasswordCtrl)
router.get('/reset-password/:token', resetPasswordCtrl);

export default router;