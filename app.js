import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import bodyParser from "body-parser";
import { queryParser } from "express-query-parser";

import ProductRouter from './routes/products.route.js'
import AuthRouter from './routes/auth.route.js'
import AccountRouter from './routes/account.route.js'
import UserRouter from './routes/user.route.js'

const productRoute = '/product'
const authRoute = '/auth'
const accountRoute = '/account'
const userRoute = '/user'

dotenv.config();
const app = express();

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
// Enable CORS
app.use(cors({
  origin: 'http://localhost:3001', // Hoặc dùng '*' nếu muốn cho phép mọi nguồn
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'], // Các phương thức được phép
  credentials: true, // Nếu bạn cần gửi cookie hoặc authentication headers
}));

app.use(
  queryParser({
    parseNull: true,
    parseUndefined: true,
    parseBoolean: true,
    parseNumber: true,
  })
);

app.use(productRoute, ProductRouter)
app.use(accountRoute, AccountRouter)
app.use(userRoute, UserRouter)
app.use(authRoute, AuthRouter)

export default app;
