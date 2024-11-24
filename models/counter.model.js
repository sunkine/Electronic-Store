// models/counter.model.js
import mongoose from "mongoose";

const counterSchema = new mongoose.Schema({
  _id: String, // Đây sẽ là tên của bộ đếm, ví dụ: "importId"
  seq: { type: Number, default: 0 }, // Khởi tạo mặc định seq = 1
});

const Counter = mongoose.model("Counter", counterSchema);

export default Counter;
