import mongoose from '../config/mongoose.js'

const cartModel = new mongoose.Schema({
    idProduct: {
        type: String,
        required: true,
    },
    name: {
        type: String,
        required: true,
    },
    quantity: {
        type: Number,
        default: 1,
    },
    price: {
        type: Number,
        required: true,
    }
}, {timestamps: true})

const Cart = mongoose.model('Cart', cartModel)
export default Cart;