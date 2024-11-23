import mongoose from "../config/mongoose.js";

const staffSchema = new mongoose.Schema(
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
    idCompany: {
      type: String,
    },
  },
  { timestamps: true }
);
const Staff = mongoose.model("Staff", staffSchema);
export default Staff;
