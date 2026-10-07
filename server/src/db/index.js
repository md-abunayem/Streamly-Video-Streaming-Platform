import mongoose from "mongoose";
import { DB_NAME } from "../constants.js";

const connectDB = async () => {
  const uri = process.env.MONGODB_URI;
  if (!uri) {
    throw new Error("MONGODB_URI is not configured");
  }

  const configuredDatabase = decodeURIComponent(new URL(uri).pathname.slice(1));
  const databaseName = configuredDatabase || DB_NAME;
  const connection = await mongoose.connect(uri, { dbName: databaseName });
  console.log(`MongoDB connected: ${connection.connection.host}`);
};

export default connectDB;