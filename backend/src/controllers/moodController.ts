import { Request, Response, NextFunction } from "express";
import { Mood } from "../models/Mood";
import { logger } from "../utils/logger";
// import { sendMoodUpdateEvent } from "../utils/inngestEvents";

export const createMood = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { score, note } = req.body;
    const userId = req.user?._id; // From auth middleware

    if (!userId) {
      return res.status(401).json({ message: "User not authenticated" });
    }

    if (typeof score !== "number" || score < 0 || score > 100) {
      return res.status(400).json({ message: "Mood score must be between 0 and 100" });
    }

    const mood = new Mood({
      userId,
      score,
      note,
      timestamp: new Date(),
    });

    await mood.save();
    logger.info(`✅ Mood entry created for user ${userId}`);

    // Trigger Inngest event (asynchronous analytics/logging)
    // await sendMoodUpdateEvent({
    //   userId,
    //   mood: score,
    //   note,
    //   timestamp: mood.timestamp,
    // });

    res.status(201).json({
      success: true,
      data: mood,
      message: "Mood entry created successfully.",
    });
  } catch (error) {
    logger.error("❌ Error creating mood entry:", error);
    next(error);
  }
};
