import mongoose from "../config/mongoose.js";

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
  idProvider: {
    type: String,
    required: true,
  },
  nameOfProvider: {
    type: String,
    required: true,
  },
});

const Warehouse = mongoose.model("Warehouse", wareouseModel);
export default Warehouse;
