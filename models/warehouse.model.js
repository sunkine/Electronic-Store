import mongoose from "../config/mongoose";

const wareouseModel = new mongoose.Schema({
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
    required: true,
    min: 0,
  },
  price: {
    type: Number,
    required: true,
  },
  idProvider: {
    type: String,
    required: true,
    unique: true,
  },
  nameOfProvider: {
    type: String,
    required: true,
  },
});

const Warehouse = mongoose.model("Warehouse", wareouseModel);
export default Warehouse;
