import express from "express";

import ProductRouter from "./products.route.js";
import AuthRouter from "./auth.route.js";
import AccountRouter from "./account.route.js";
import UserRouter from "./user.route.js";
import CartRoute from "./cart.route.js";
import OrderRoute from "./order.route.js";
import ProviderRouter from "./provider.route.js";
import DetailProduct from "./detailProduct.route.js"

const app = express();

app.use("/product", ProductRouter);
app.use("/account", AccountRouter);
app.use("/user", UserRouter);
app.use("/auth", AuthRouter);
app.use("/cart", CartRoute);
app.use("/order", OrderRoute);
app.use("/provider", ProviderRouter);
app.use("/detail", DetailProduct)

export default app;
