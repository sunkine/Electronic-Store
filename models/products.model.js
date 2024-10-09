import mongodb from "../config/mongoose.js"

const productsModel = new mongodb.Schema({
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

const products = mongodb.model('products', productsModel)
export default products;
