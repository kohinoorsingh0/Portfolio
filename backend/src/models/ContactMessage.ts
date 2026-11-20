import mongoose, { Schema, Document, Model } from "mongoose";
import { z } from "zod";

export const contactMessageZodSchema = z.object({
  name: z.string().min(1, "Name is required"),
  email: z.string().email("Invalid email address"),
  message: z.string().min(1, "Message is required"),
  read: z.boolean().default(false),
  ipHash: z.string().optional().nullable(),
});

export type IContactMessage = z.infer<typeof contactMessageZodSchema>;

export interface IContactMessageDocument extends IContactMessage, Document {
  createdAt: Date;
  updatedAt: Date;
}

const contactMessageSchema = new Schema<IContactMessageDocument>(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },
    email: {
      type: String,
      required: true,
      trim: true,
      lowercase: true,
    },
    message: {
      type: String,
      required: true,
      trim: true,
    },
    read: {
      type: Boolean,
      default: false,
    },
    ipHash: {
      type: String,
      default: null,
      trim: true,
    },
  },
  {
    timestamps: true,
  }
);

export const ContactMessage: Model<IContactMessageDocument> =
  mongoose.models.ContactMessage ||
  mongoose.model<IContactMessageDocument>(
    "ContactMessage",
    contactMessageSchema
  );

export default ContactMessage;
