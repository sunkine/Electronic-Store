import mongoose from "../config/mongoose.js"

const detailProductsModel = new mongoose.Schema({
    idProduct: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Product",
    },
    detailDescription: {
        type: String,
        default: "Sản phẩm này không có thông tin chi tiết.",
    },
})

const detailProduct = mongoose.model('detailProduct', detailProductsModel)
export default detailProduct;
