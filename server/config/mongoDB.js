// config/mongoDB.js (ESM version)
import mongoose from "mongoose";

const connectMongoDB = async () => {
  mongoose.connection.on("connected", () => {
    console.log("✅ MongoDB connected");
  });

  try {
    await mongoose.connect(process.env.MONGO_URI);
  } catch (error) {
    console.error("❌ MongoDB connection error:", error.message);
    process.exit(1);
  }
};

export default connectMongoDB;
