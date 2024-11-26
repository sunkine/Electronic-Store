import mongoose from "../config/mongoose.js";

const orderModel = new mongoose.Schema({
  idCustomer: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Account",
  },
  idStaff: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Staff",
  },
  nameOfCustomer: {
    type: String,
    required: true,
  },
  phone: {
    type: String,
    required: true,
  },
  address: {
    type: String,
    required: true,
  },
  dateOrder: {
    type: Date,
    default: Date.now,
  },
  dateReceived: {
    type: Date,
  },
  totalPrice: {
    type: Number,
  },
  payment_method: {
    type: String,
    enum: ["Bank", "Cash", "Cod"],
    default: "Cash",
  },
  isPayment: {
    type: Boolean,
    default: false,
  },
  products: [
    {
      idProduct: {
        type: String,
      },
      nameOfProduct: {
        type: String,
      },
      quantity: {
        type: Number,
        default: 1,
      },
      price: {
        type: Number,
      },
    },
  ],
  status: {
    type: String,
    enum: [
      "Chờ xác nhận",
      "Chờ lấy hàng",
      "Đang giao",
      "Đã giao",
      "Đã hủy",
    ],
    default: "Chờ xác nhận",
  },
  linkPayment: { type: String },
});

const Order = mongoose.model("Order", orderModel);
export default Order;
