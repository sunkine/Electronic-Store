import mongoose from '../config/mongoose.js'

const cartModel = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
    },
    products: [{
        idProduct: {
            type: String,
            required: true,
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
        }
    }]
}, {timestamps: true})

const Cart = mongoose.model('Cart', cartModel)
export default Cart;