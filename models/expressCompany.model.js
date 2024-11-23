import mongoose from "../config/mongoose.js";

const expressCompanyModel = new mongoose.Schema(
  {
    idCompany: {
      type: String,
      unique: true,
      required: true,
    },
    nameOfCompany: {
      type: String,
    },
    phone: {
      type: String,
      default: "",
    },
    email: {
      type: String,
      required: [true, "Email is required"],
    },
    address: {
      type: String,
      required: [true, "Address is required"],
      default: "HCM",
    },
  },
  { timestamps: true }
);
const expressCompany = mongoose.model("expressCompany", expressCompanyModel);
export default expressCompany;
