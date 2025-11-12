"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.logActivity = void 0;
const Activity_1 = require("../models/Activity");
const logger_1 = require("../utils/logger");
const logActivity = async (req, res) => {
    try {
        const { type, name, description, duration } = req.body;
        const userId = req.user?._id;
        if (!userId) {
            return res.status(401).json({ status: "error", message: "User not authenticated" });
        }
        if (!type || !name) {
            return res.status(400).json({ status: "error", message: "Type and name are required" });
        }
        const activity = new Activity_1.Activity({
            userId,
            type,
            name,
            description,
            duration,
            timestamp: new Date(),
        });
        await activity.save();
        logger_1.logger.info(`✅ Activity logged for user: ${userId}`);
        res.status(201).json({
            status: "success",
            message: "Activity logged successfully.",
            data: activity,
        });
    }
    catch (error) {
        logger_1.logger.error("❌ Error logging activity:", error);
        res.status(500).json({
            status: "error",
            message: "Server error while logging activity",
            error: error.message,
        });
    }
};
exports.logActivity = logActivity;
