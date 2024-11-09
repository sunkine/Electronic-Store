import mongoose from "../config/mongoose.js"

const orderModel = new mongoose.Schema({
    idCustomer: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Account",
    },
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
        enum: ["Momo","Cash"],
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
        enum: ["Chờ thanh toán", "Đã thanh toán"],
        default: "Chờ thanh toán",
    },
})

const Order = mongoose.model("Order", orderModel)
export default Order;