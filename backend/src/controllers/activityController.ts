import { Request, Response } from "express";
import { Activity } from "../models/Activity";
import { logger } from "../utils/logger";

export const logActivity = async (req: Request, res: Response) => {
  try {
    const { type, name, description, duration } = req.body;
    const userId = req.user?._id;

    if (!userId) {
      return res.status(401).json({ status: "error", message: "User not authenticated" });
    }

    if (!type || !name) {
      return res.status(400).json({ status: "error", message: "Type and name are required" });
    }

    const activity = new Activity({
      userId,
      type,
      name,
      description,
      duration,
      timestamp: new Date(),
    });

    await activity.save();
    logger.info(`✅ Activity logged for user: ${userId}`);

    res.status(201).json({
      status: "success",
      message: "Activity logged successfully.",
      data: activity,
    });
  } catch (error: any) {
    logger.error("❌ Error logging activity:", error);
    res.status(500).json({
      status: "error",
      message: "Server error while logging activity",
      error: error.message,
    });
  }
};
