import mongoose from "../config/mongoose.js";

const userSchema = new mongoose.Schema(
  {
    Name: {
      type: String,
      required: true,
    },
    Gender: {
      type: String,
      enum: ["Male", "Female"],
    },
    Phone: {
      type: String,
      required: true,
      unique: true,
    },
    Email: {
      type: String,
      required: true,
      unique: true,
    },
    Address: {
      type: String,
      required: true,
    },
    Photo: {
      type: String,
    },
  },
  { timestamps: true }
);

const User = mongoose.model("User", userSchema);
export default User;
