import express from 'express'
import {deleteAccount, updateAccount, getAllAccount, getAccount} from '../controllers/account.class.js'
import { SignUp } from '../controllers/auth.class.js'

const router = express.Router()

//user sign up
router.post('/sign-up', SignUp)
//get all user
router.get('/', getAllAccount)
router.get('/:id', getAccount)
//delete account
router.delete('/delete-account/:id', deleteAccount)
//update account
router.put('/update-account/:id', updateAccount)

export default router;