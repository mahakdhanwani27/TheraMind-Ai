"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.createMood = void 0;
const Mood_1 = require("../models/Mood");
const logger_1 = require("../utils/logger");
// import { sendMoodUpdateEvent } from "../utils/inngestEvents";
const createMood = async (req, res, next) => {
    try {
        const { score, note } = req.body;
        const userId = req.user?._id; // From auth middleware
        if (!userId) {
            return res.status(401).json({ message: "User not authenticated" });
        }
        if (typeof score !== "number" || score < 0 || score > 100) {
            return res.status(400).json({ message: "Mood score must be between 0 and 100" });
        }
        const mood = new Mood_1.Mood({
            userId,
            score,
            note,
            timestamp: new Date(),
        });
        await mood.save();
        logger_1.logger.info(`✅ Mood entry created for user ${userId}`);
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
    }
    catch (error) {
        logger_1.logger.error("❌ Error creating mood entry:", error);
        next(error);
    }
};
exports.createMood = createMood;
