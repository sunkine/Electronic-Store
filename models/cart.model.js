import mongoose from "../config/mongoose.js";

const cartModel = new mongoose.Schema(
  {
    idAccount: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Account",
    },
    products: [
      {
        idProduct: {
          type: String,
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
        image: {
          type: String,
        },
      },
    ],
  },
  { timestamps: true }
);

const Cart = mongoose.model("Cart", cartModel);
export default Cart;
