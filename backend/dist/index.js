"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const helmet_1 = __importDefault(require("helmet"));
const morgan_1 = __importDefault(require("morgan"));
const dotenv_1 = __importDefault(require("dotenv"));
const express_2 = require("inngest/express");
const logger_1 = require("./utils/logger");
const db_1 = require("./utils/db");
const index_1 = require("./inngest/index"); // your client file
const functions_1 = require("./inngest/functions");
const auth_1 = __importDefault(require("./routes/auth"));
const errorHandler_1 = require("./middleware/errorHandler");
const chat_1 = __importDefault(require("./routes/chat"));
const mood_1 = __importDefault(require("./routes/mood"));
const activity_1 = __importDefault(require("./routes/activity"));
// Load environment variables
dotenv_1.default.config();
// Create Express app
const app = (0, express_1.default)();
// Middleware
app.use((0, helmet_1.default)()); // Add security headers
app.use((0, cors_1.default)()); // Enable CORS
app.use(express_1.default.json()); // Parse JSON requests
app.use((0, morgan_1.default)("dev")); // Log requests
// Inngest endpoint
app.use("/api/inngest", (0, express_2.serve)({ client: index_1.inngest, functions: functions_1.functions }));
// Routes
app.get("/health", (req, res) => {
    res.json({ status: "ok", message: "Server is running" });
});
app.use("/auth", auth_1.default);
app.use("/chat", chat_1.default);
app.use("/api/mood", mood_1.default);
app.use("/api/activity", activity_1.default);
// Global error handler
app.use(errorHandler_1.errorHandler);
// Start server
const startServer = async () => {
    try {
        await (0, db_1.connectDB)(); // Connect to MongoDB
        const PORT = process.env.PORT || 3001;
        app.listen(PORT, () => {
            logger_1.logger.info(`✅ Server is running on port ${PORT}`);
            logger_1.logger.info(`⚙️  Inngest endpoint available at http://localhost:${PORT}/api/inngest`);
        });
    }
    catch (error) {
        logger_1.logger.error("❌ Failed to start server:", error);
        process.exit(1);
    }
};
startServer();
