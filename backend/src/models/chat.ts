import mongoose, { Schema, Document } from "mongoose";

export interface IChatMessage {
  role: "user" | "assistant";
  content: string;
  timestamp: Date;
  metadata?: {
    technique?: string;
    goal?: string;
    progress?: any[];
  };
}

export interface IChatSession extends Document {
  sessionId: string;
  messages: IChatMessage[];
  createdAt: Date;
  updatedAt: Date;
}

const chatMessageSchema = new Schema<IChatMessage>(
  {
    role: {
      type: String,
      enum: ["user", "assistant"],
      required: true,
    },
    content: {
      type: String,
      required: true,
      trim: true, // ✅ avoids whitespace issues
    },
    timestamp: {
      type: Date,
      default: Date.now,
    },
    metadata: {
      technique: { type: String, trim: true },
      goal: { type: String, trim: true },
      progress: { type: [Schema.Types.Mixed], default: [] },
    },
  },
  { _id: false } // ✅ prevents auto _id for subdocuments
);

const chatSessionSchema = new Schema<IChatSession>(
  {
    sessionId: {
      type: String,
      required: true,
      unique: true,
      index: true, // ✅ improves performance for lookups
    },
    messages: [chatMessageSchema],
  },
  { timestamps: true }
);

export const ChatSession = mongoose.model<IChatSession>(
  "ChatSession",
  chatSessionSchema
);
