import mongoose from "mongoose";

export const ConnectDb = async () => {
  const DB_URI = process.env.DB_URI
  console.log("DB_URI",DB_URI)
  try {
    await mongoose.connect(DB_URI as string);
    console.log("Connected to database");
  } catch (error) {
    console.error("Error connecting to database:", error);
  }
};
