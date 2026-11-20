import mongoose, { Schema, Document, Model } from "mongoose";
import { z } from "zod";

export const journeyTypes = [
  "Experience",
  "Education",
  "Certificate",
] as const;

export const journeyZodSchema = z.object({
  type: z.enum(journeyTypes),
  yearLabel: z.string().min(1, "Year label is required"),
  title: z.string().min(1, "Title is required"),
  organisation: z.string().min(1, "Organisation is required"),
  description: z.string().default(""),
  order: z.number().int().default(0),
  visible: z.boolean().default(true),
});

export type IJourney = z.infer<typeof journeyZodSchema>;

export interface IJourneyDocument extends IJourney, Document {
  createdAt: Date;
  updatedAt: Date;
}

const journeySchema = new Schema<IJourneyDocument>(
  {
    type: {
      type: String,
      required: true,
      enum: journeyTypes,
      trim: true,
    },
    yearLabel: {
      type: String,
      required: true,
      trim: true,
    },
    title: {
      type: String,
      required: true,
      trim: true,
    },
    organisation: {
      type: String,
      required: true,
      trim: true,
    },
    description: {
      type: String,
      default: "",
      trim: true,
    },
    order: {
      type: Number,
      default: 0,
    },
    visible: {
      type: Boolean,
      default: true,
    },
  },
  {
    timestamps: true,
  }
);

export const Journey: Model<IJourneyDocument> =
  mongoose.models.Journey ||
  mongoose.model<IJourneyDocument>("Journey", journeySchema);

export default Journey;
