import mongoose from "../config/mongoose.js";

const importModel = new mongoose.Schema({
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
  priceImport: {
    type: Number,
    required: false,
    min: 0,
  },
  dateImport: {
    type: Date,
    default: Date.now,
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

const Import = mongoose.model("Import", importModel);
export default Import;
