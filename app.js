import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import bodyParser from "body-parser";
import { queryParser } from "express-query-parser";
import apiRoute  from './routes/api.route.js'
import cookieParser from "cookie-parser";

dotenv.config();
const app = express();

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(cookieParser());
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

app.use('/', apiRoute)

export default app;
