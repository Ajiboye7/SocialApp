import mongoose from "mongoose";

let isConnected = false;
const connectToDatabase = async () => {
  if (!process.env.MONGODB_URL) {
    throw new Error("DB_URI is not defined");
  }

  if (isConnected) {
    console.log("MongoDB connection already established");
    return;
  }

  try {
    await mongoose.connect(process.env.MONGODB_URL);
    isConnected = true;
      console.log("MongoDB connected");
  } catch (error) {
    console.error("Error connecting to database: ", error);

    process.exit(1);
  }
};

export default connectToDatabase;
