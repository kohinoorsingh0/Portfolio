import mongoose, { Schema, Document, Model } from "mongoose";
import { z } from "zod";

export const caseStudyZodSchema = z.object({
  overview: z.string().default(""),
  challenge: z.string().default(""),
  solution: z.string().default(""),
  outcome: z.string().default(""),
});

export const projectZodSchema = z.object({
  title: z.string().min(1, "Title is required"),
  slug: z.string().min(1, "Slug is required").toLowerCase(),
  shortDescription: z.string().min(1, "Short description is required"),
  longDescription: z.string().default(""),
  stack: z.array(z.string()).default([]),
  imageUrl: z.string().default(""),
  githubUrl: z.string().optional().nullable(),
  liveUrl: z.string().optional().nullable(),
  featured: z.boolean().default(false),
  order: z.number().int().default(0),
  visible: z.boolean().default(true),
  caseStudy: caseStudyZodSchema.default({
    overview: "",
    challenge: "",
    solution: "",
    outcome: "",
  }),
  resultText: z.string().optional().nullable(),
});

export type ICaseStudy = z.infer<typeof caseStudyZodSchema>;
export type IProject = z.infer<typeof projectZodSchema>;

export interface IProjectDocument extends IProject, Document {
  createdAt: Date;
  updatedAt: Date;
}

const caseStudySchema = new Schema(
  {
    overview: { type: String, default: "", trim: true },
    challenge: { type: String, default: "", trim: true },
    solution: { type: String, default: "", trim: true },
    outcome: { type: String, default: "", trim: true },
  },
  { _id: false }
);

const projectSchema = new Schema<IProjectDocument>(
  {
    title: { type: String, required: true, trim: true },
    slug: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
      index: true,
    },
    shortDescription: { type: String, required: true, trim: true },
    longDescription: { type: String, default: "", trim: true },
    stack: { type: [String], default: [] },
    imageUrl: { type: String, default: "", trim: true },
    githubUrl: { type: String, default: null, trim: true },
    liveUrl: { type: String, default: null, trim: true },
    featured: { type: Boolean, default: false },
    order: { type: Number, default: 0 },
    visible: { type: Boolean, default: true },
    caseStudy: { type: caseStudySchema, default: () => ({}) },
    resultText: { type: String, default: null, trim: true },
  },
  {
    timestamps: true,
  }
);

export const Project: Model<IProjectDocument> =
  mongoose.models.Project ||
  mongoose.model<IProjectDocument>("Project", projectSchema);

export default Project;
