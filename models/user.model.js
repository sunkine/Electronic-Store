import mongoose from "../config/mongoose.js";

const userSchema = new mongoose.Schema(
  {
    idAccount: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
    },
    name: {
      type: String,
      required: true,
    },
    gender: {
      type: String,
      enum: ["Male", "Female"],
      default: "Male"
    },
    phone: {
      type: String,
    },
    email: {
      type: String,
      required: true,
      unique: true,
    },
    address: {
      type: String,
      required: true,
      default: "",
    },
    photo: {
      type: String,
    },
  },
  { timestamps: true }
);

const User = mongoose.model("User", userSchema);
export default User;
