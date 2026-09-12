const mongoose = require("mongoose");

const MONGODB_URI = process.env.MONGODB_URI;

const connectDB = async () => {
  try {
    await mongoose.connect(MONGODB_URI);
    console.log("Mongodb connected successfully");
  } catch (err) {
    console.error("Mongodb connection error:", err.message);
    process.exit(1);
  }
};

module.exports = connectDB;
