import mongoose, { Schema, Document, Model } from "mongoose";
import { z } from "zod";

// Zod Schema for validation
export const adminZodSchema = z.object({
  email: z.string().email("Invalid email address").toLowerCase(),
  passwordHash: z.string().min(1, "Password hash is required"),
});

export type IAdmin = z.infer<typeof adminZodSchema>;

export interface IAdminDocument extends IAdmin, Document {
  createdAt: Date;
  updatedAt: Date;
}

const adminSchema = new Schema<IAdminDocument>(
  {
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
    },
    passwordHash: {
      type: String,
      required: true,
      select: false,
    },
  },
  {
    timestamps: true,
  }
);

export const Admin: Model<IAdminDocument> =
  mongoose.models.Admin || mongoose.model<IAdminDocument>("Admin", adminSchema);

export default Admin;
