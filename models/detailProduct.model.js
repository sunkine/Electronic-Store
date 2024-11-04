import mongoose from "../config/mongoose.js"

const productsModel = new mongoose.Schema({
    idProduct: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Product",
    },
    nameOfProduct: {
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
    status: {
        type: String,
        emum: ["Available", "Not availale"],
    },
})

const Product = mongoose.model('Product', productsModel)
export default Product;
