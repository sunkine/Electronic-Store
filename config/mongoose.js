import mongoose from "mongoose"
import dotenv from "dotenv"
dotenv.config()

const mongodb = await mongoose.connect(process.env.MONGO_URI, {});

export default mongodb;