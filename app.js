import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import bodyParser from "body-parser";
import { queryParser } from "express-query-parser";
import path from 'path';
import cookieParser from "cookie-parser";
import apiRoute from './routes/api.route.js';

dotenv.config();
const app = express();

// Middleware để phục vụ các tệp tin tĩnh từ thư mục 'uploads'
app.use('/uploads', express.static(path.join(process.cwd(), 'uploads')));
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(cookieParser())
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

app.use('/', apiRoute);

export default app;
