import mongoose from "../config/mongoose.js";

const productsModel = new mongoose.Schema({
  idProduct: {
    type: String,
    required: true,
    unique: true,
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
  typeProduct: {
    type: String,
    required: true,
  },
  image: {
    type: String,
  },
  status: {
    type: String,
    enum: ["Available", "Not available"],
  },
  description: {
    type: String,
  },
  detail: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "detailProduct", // Tham chiếu đến model DetailProduct
  },
});

const Product = mongoose.model("Product", productsModel);
export default Product;
