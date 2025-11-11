import mongoose, { Document, Schema } from "mongoose";

export interface ISession extends Document {
  userID: mongoose.Types.ObjectId;
  token: string;
  expiresAt: Date; // ✅ fixed spelling
  deviceInfo?: string;
  lastActive: Date;
}

const SessionSchema = new Schema<ISession>(
  {
    userID: { type: Schema.Types.ObjectId, ref: "User", required: true },
    token: { type: String, required: true, unique: true },
    expiresAt: { type: Date, required: true }, // ✅ fixed spelling
    deviceInfo: { type: String },
    lastActive: { type: Date, default: Date.now },
  },
  { timestamps: true }
);

// ✅ fixed spelling in index too
SessionSchema.index({ expiresAt: 1 }, { expireAfterSeconds: 0 });

export const Session =
  mongoose.models.Session || mongoose.model<ISession>("Session", SessionSchema);
