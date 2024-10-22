import mongoose from "../config/mongoose.js"

const productsModel = new mongoose.Schema({
    idProduct: {
        type: String,
        required: true,
        unique: true,
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
    },
    idTypeProduct: {
        type: String,
        required: true,
    }, 
    image: {
        type: String,
    },
    status: {
        type: String,
        emum: ["Available", "Not availale"],
    },
})

const Product = mongoose.model('products', productsModel)
export default Product;
