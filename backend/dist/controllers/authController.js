"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.logout = exports.login = exports.register = void 0;
const user_1 = require("../models/user");
const Session_1 = require("../models/Session");
const bcryptjs_1 = __importDefault(require("bcryptjs"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
// ========================== REGISTER ==========================
const register = async (req, res) => {
    try {
        const { name, email, password } = req.body;
        if (!name || !email || !password) {
            return res
                .status(400)
                .json({ message: "Name, email, and password are required." });
        }
        const existingUser = await user_1.User.findOne({ email });
        if (existingUser) {
            return res.status(409).json({ message: "Email already in use." });
        }
        const hashedPassword = await bcryptjs_1.default.hash(password, 10);
        const user = new user_1.User({
            name,
            email,
            password: hashedPassword,
        });
        await user.save();
        // ✅ Use "id" instead of "userId" so it matches auth.js
        const token = jsonwebtoken_1.default.sign({ id: user._id, email: user.email }, process.env.JWT_SECRET || "mahakSuperSecretKey123", { expiresIn: "1d" });
        await Session_1.Session.create({
            userID: user._id,
            token: Math.random().toString(36).substring(2),
            expiresAt: new Date(Date.now() + 1000 * 60 * 60 * 24),
            deviceInfo: "Default device",
        });
        res.status(201).json({
            user: {
                _id: user._id,
                name: user.name,
                email: user.email,
            },
            token, // ✅ Return the token to frontend
            message: "User registered successfully.",
        });
    }
    catch (error) {
        console.error(error);
        res.status(500).json({ message: "Server error", error });
    }
};
exports.register = register;
// ========================== LOGIN ==========================
const login = async (req, res) => {
    try {
        const { email, password } = req.body;
        if (!email || !password) {
            return res
                .status(400)
                .json({ message: "Email and password are required." });
        }
        // ✅ 1. Find user
        const user = await user_1.User.findOne({ email });
        if (!user) {
            return res.status(404).json({ message: "User not found." });
        }
        // ✅ 2. Compare password
        const isMatch = await bcryptjs_1.default.compare(password, user.password);
        if (!isMatch) {
            return res.status(401).json({ message: "Invalid password." });
        }
        // ✅ 3. Create JWT token (use id instead of userId)
        const token = jsonwebtoken_1.default.sign({ id: user._id, email: user.email }, process.env.JWT_SECRET || "mahakSuperSecretKey123", { expiresIn: "1d" });
        // ✅ 4. Save session info in DB (optional)
        const session = await Session_1.Session.create({
            userID: user._id,
            token,
            expiresAt: new Date(Date.now() + 24 * 60 * 60 * 1000),
            deviceInfo: req.headers["user-agent"] || "Unknown device",
        });
        // ✅ 5. Send response
        res.status(200).json({
            message: "Login successful",
            user: {
                id: user._id,
                email: user.email,
            },
            token,
            session,
        });
    }
    catch (error) {
        console.error("Login error:", error);
        res.status(500).json({ message: "Server error", error: error.message });
    }
};
exports.login = login;
// ========================== LOGOUT ==========================
const logout = async (req, res) => {
    try {
        const token = req.header("Authorization")?.replace("Bearer ", "");
        if (token) {
            await Session_1.Session.deleteOne({ token });
        }
        res.json({ message: "Logged out successfully" });
    }
    catch (error) {
        console.error(error);
        res.status(500).json({ message: "Server error", error });
    }
};
exports.logout = logout;
