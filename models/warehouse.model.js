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

// Middleware để đồng bộ quantity
wareouseModel.post("save", async function (doc) {
  const Product = mongoose.model("Product");

  // Cập nhật quantity trong Product
  await Product.findOneAndUpdate(
    { idProduct: doc.idProduct },
    { quantity: doc.quantity }
  );
});

wareouseModel.post("findOneAndUpdate", async function (result) {
  const Product = mongoose.model("Product");

  if (result) {
    // Cập nhật quantity trong Product
    await Product.findOneAndUpdate(
      { idProduct: result.idProduct },
      { quantity: result.quantity }
    );
  }
});

const Warehouse = mongoose.model("Warehouse", wareouseModel);
export default Warehouse;
