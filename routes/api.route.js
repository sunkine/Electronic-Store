import express from "express";
import ProductRouter from './products.route.js'
import AuthRouter from './auth.route.js'
import AccountRouter from './account.route.js'
import UserRouter from './user.route.js'

const app = express()

const productRoute = '/product'
const authRoute = '/auth'
const accountRoute = '/account'
const userRoute = '/user'

app.use(productRoute, ProductRouter)
app.use(accountRoute, AccountRouter)
app.use(userRoute, UserRouter)
app.use(authRoute, AuthRouter)

export default app;