import mongoose from "../config/mongoose.js"

const productsModel = new mongoose.Schema({
    ID_Product: {
        type: String,
        required: true,
        unique: true,
    },
    Name: {
        type: String,
        required: true,
    },
    Quantity: {
        type: Number,
        default: 1,
    },
    Price: {
        type: Number,
        required: true,
    },
    ID_TypeProduct: {
        type: String,
        required: true,
    }, 
    Image: {
        type: String,
        required: true,
    },
    Status: {
        type: String,
        emum: ["Available", "Not availale"],
    },
})

const products = mongoose.model('products', productsModel)
export default products;
