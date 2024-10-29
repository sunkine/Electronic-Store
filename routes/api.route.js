import express from "express";
import ProductRouter from './products.route.js'
import AuthRouter from './auth.route.js'
import AccountRouter from './account.route.js'
import UserRouter from './user.route.js'
import CartRoute from './cart.route.js'
const app = express()

const productRoute = '/product'
const authRoute = '/auth'
const accountRoute = '/account'
const userRoute = '/user'
const cartRoute = '/cart'

app.use(productRoute, ProductRouter)
app.use(accountRoute, AccountRouter)
app.use(userRoute, UserRouter)
app.use(authRoute, AuthRouter)
app.use(cartRoute, CartRoute)

export default app;