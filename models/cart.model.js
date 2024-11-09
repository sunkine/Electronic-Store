import mongoose from "../config/mongoose.js";

const cartModel = new mongoose.Schema(
  {
    isOrder: {
      type: Boolean,
      default: false,
    },
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Account",
    },
    products: [
      {
        idProduct: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "Product",
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
        },
      },
    ],
  },
  { timestamps: true }
);

const Cart = mongoose.model("Cart", cartModel);
export default Cart;
