import mongoose from "mongoose";
import { logger } from "./logger";

const MONGODB_URI =
  process.env.MONGODB_URI ||
  "mongodb+srv://mahakdhanwani4_db_user:6SKvEkOPdLoUnPhQ@ai-therapist-agent.odr6vys.mongodb.net/?appName=ai-therapist-agent";

export const connectDB = async () => {
  try {
    await mongoose.connect(MONGODB_URI);
    logger.info("✅ Connected to MongoDB Atlas");
  } catch (error) {
    logger.error("❌ Failed to connect to MongoDB:", error);
    process.exit(1);
  }
};
