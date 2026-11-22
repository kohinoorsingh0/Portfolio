import mongoose from "mongoose";

let isConnected = false;

export const connectDB = async (): Promise<typeof mongoose> => {
  const uri = process.env.MONGODB_URI;
  if (!uri) {
    throw new Error("MONGODB_URI environment variable is missing");
  }

  if (isConnected) {
    return mongoose;
  }

  const conn = await mongoose.connect(uri, {
    serverSelectionTimeoutMS: 5000,
  });
  isConnected = !!conn.connections[0].readyState;
  console.log("MongoDB connected successfully");
  return conn;
};
