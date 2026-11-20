import mongoose, { Schema, Document, Model } from "mongoose";
import { z } from "zod";

export const skillCategories = [
  "Frontend",
  "Backend",
  "Database",
  "Tools & DevOps",
] as const;

export const skillLevels = ["Beginner", "Working", "Strong"] as const;

export const skillZodSchema = z.object({
  category: z.enum(skillCategories),
  name: z.string().min(1, "Skill name is required"),
  level: z.enum(skillLevels),
  order: z.number().int().default(0),
  visible: z.boolean().default(true),
});

export type ISkill = z.infer<typeof skillZodSchema>;

export interface ISkillDocument extends ISkill, Document {
  createdAt: Date;
  updatedAt: Date;
}

const skillSchema = new Schema<ISkillDocument>(
  {
    category: {
      type: String,
      required: true,
      enum: skillCategories,
      trim: true,
    },
    name: {
      type: String,
      required: true,
      trim: true,
    },
    level: {
      type: String,
      required: true,
      enum: skillLevels,
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

// Unique compound index on category + name
skillSchema.index({ category: 1, name: 1 }, { unique: true });

export const Skill: Model<ISkillDocument> =
  mongoose.models.Skill || mongoose.model<ISkillDocument>("Skill", skillSchema);

export default Skill;
