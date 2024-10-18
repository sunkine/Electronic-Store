import mongoose from "../config/mongoose.js"

const orderModel = new mongoose.Schema({
    idOrder: {
        type: String,
        required: true,
        unique: true,
    },
    idStaff: {
        type: String,
        required: true,
    },
    idCustomer: {
        type: String,
        required: true,
    },
    dateOrder: {
        type: Date,
        required: true,
    },
    totalPrice: {
        type: Number,
        required: true,
    },
    status: {
        type: String,
        required: true,
        enum: ["Chờ xác nhận", "Chờ lấy hàng", "Đang vận chuyển", "Đang giao hàng", "Đã giao"],
        default: "Chờ xác nhận",
    },
})

const Order = mongoose.model("Order", orderModel)
export default Order;