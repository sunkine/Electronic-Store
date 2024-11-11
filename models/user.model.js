import mongoose from "../config/mongoose.js";

const userSchema = new mongoose.Schema(
  {
    idAccount: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: "Account",
    },
    name: {
      type: String,
      required: [true, "User name is required"],
      default: "Nguyen Van A",
    },
    gender: {
      type: String,
      enum: {
        values: ["Male", "Female"],
        message: "{VALUE} is not a valid enum value for path `gender`.",
      },
      default: "Male",
    },
    phone: {
      type: String,
      default: "",
    },
    email: {
      type: String,
      required: [true, "Email is required"],
      unique: true,
    },
    address: {
      type: String,
      required: [true, "Address is required"],
      default: "HCM",
    },
    photo: {
      type: String,
      default: "",
    },
  },
  { timestamps: true }
);
const User = mongoose.model("User", userSchema);
export default User;
