/*import mongoose from "mongoose";

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
*/


import mongoose from "mongoose";

let isConnected = false;

const connectToDatabase = async () => {
  if (!process.env.MONGODB_URL) {
    console.error("MONGODB_URL is missing!");
    throw new Error("MONGODB_URL is not defined");
  }

  if (isConnected) {
    console.log("Re-using existing MongoDB connection");
    return;
  }

  console.log("Connecting to MongoDB…");
  try {
    await mongoose.connect(process.env.MONGODB_URL, {
      // these options silence deprecation warnings
      // (optional but recommended)
    });
    isConnected = true;
    console.log("MongoDB CONNECTED");
  } catch (error: any) {
    console.error("MongoDB CONNECTION FAILED:", error.message);
    throw error;
  }
};

export default connectToDatabase;