import express from 'express'
import { SignIn} from '../controllers/auth.class.js'
const router = express.Router()

//user sign in
router.post('/', SignIn)

export default router;