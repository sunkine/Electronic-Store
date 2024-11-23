import mongoose from "../config/mongoose.js";

const providerModel = new mongoose.Schema({
  idProvider: {
    type: String,
    required: true,
    unique: true,
  },
  nameOfProvider: {
    type: String,
    required: true,
  },
  phone: {
    type: String,
    required: true,
    unique: true,
  },
  address: {
    type: String,
  },
  gmail: {
    type: String,
  },
});

const Provider = mongoose.model("Provider", providerModel);
export default Provider;
