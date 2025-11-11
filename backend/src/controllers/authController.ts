import { Request, Response } from "express";
import { User } from "../models/user";
import { Session } from "../models/Session";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

// ========================== REGISTER ==========================
export const register = async (req: Request, res: Response) => {
  try {
    const { name, email, password } = req.body;

    if (!name || !email || !password) {
      return res
        .status(400)
        .json({ message: "Name, email, and password are required." });
    }

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(409).json({ message: "Email already in use." });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const user = new User({
      name,
      email,
      password: hashedPassword,
    });

    await user.save();

    // ✅ Use "id" instead of "userId" so it matches auth.js
    const token = jwt.sign(
      { id: user._id, email: user.email },
      process.env.JWT_SECRET || "mahakSuperSecretKey123",
      { expiresIn: "1d" }
    );

    await Session.create({
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
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error", error });
  }
};

// ========================== LOGIN ==========================
export const login = async (req: Request, res: Response) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res
        .status(400)
        .json({ message: "Email and password are required." });
    }

    // ✅ 1. Find user
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(404).json({ message: "User not found." });
    }

    // ✅ 2. Compare password
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(401).json({ message: "Invalid password." });
    }

    // ✅ 3. Create JWT token (use id instead of userId)
    const token = jwt.sign(
      { id: user._id, email: user.email },
      process.env.JWT_SECRET || "mahakSuperSecretKey123",
      { expiresIn: "1d" }
    );

    // ✅ 4. Save session info in DB (optional)
    const session = await Session.create({
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
  } catch (error: any) {
    console.error("Login error:", error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

// ========================== LOGOUT ==========================
export const logout = async (req: Request, res: Response) => {
  try {
    const token = req.header("Authorization")?.replace("Bearer ", "");
    if (token) {
      await Session.deleteOne({ token });
    }
    res.json({ message: "Logged out successfully" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error", error });
  }
};
