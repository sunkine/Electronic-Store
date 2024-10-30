import mongoose from "../config/mongoose.js"

const orderModel = new mongoose.Schema({
    nameCustomer: {
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
        enum: ["Momo","Cash", "COD"],
        default: "Cash",
    },
    isPayment: {
        type: Boolean,
        default: false,
    },
    idCart: {
        type: mongoose.SchemaTypes.ObjectId,
        ref: "Cart",
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