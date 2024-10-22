import mongoose from "../config/mongoose.js";

const accountSchema = new mongoose.Schema({
    username: {
        type: String,
        unique: true,
        required: true,
    },
    password: {
        type: String,
        required: true,
    },
    role: {
        type: String,
        default: "user",
        enum: ["user","admin","staff"]
    },
    email: {
        type: String,
        required: true,
        unique: true,
    },
    isActive: {
        type: Boolean,
        default: false,
    }
} ,{timestamps: true})

const Account = mongoose.model("Account", accountSchema)
export default Account;