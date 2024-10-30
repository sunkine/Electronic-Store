import express from "express";

import ProductRouter from './products.route.js'
import AuthRouter from './auth.route.js'
import AccountRouter from './account.route.js'
import UserRouter from './user.route.js'
import CartRoute from './cart.route.js'
import OrderRoute from './order.route.js'

const app = express()

app.use('/product', ProductRouter)
app.use('/account', AccountRouter)
app.use('/user', UserRouter)
app.use('/auth', AuthRouter)
app.use('/cart', CartRoute)
app.use('/order', OrderRoute)

export default app;