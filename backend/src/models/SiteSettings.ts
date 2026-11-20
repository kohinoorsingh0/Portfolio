import mongoose, { Schema, Document, Model } from "mongoose";
import { z } from "zod";

// Zod Schema for validation
export const siteSettingsZodSchema = z.object({
  name: z.string().min(1, "Name is required"),
  role: z.string().min(1, "Role is required"),
  tagline: z.string().default(""),
  bio: z.string().default(""),
  location: z.string().default(""),
  availability: z.string().default(""),
  email: z.string().email("Invalid email address"),
  phone: z.string().default(""),
  whatsapp: z.string().default(""),
  github: z.string().default(""),
  linkedin: z.string().default(""),
  heroTitle: z.string().default(""),
  heroHighlightWord: z.string().default(""),
  profilePhotoUrl: z.string().default(""),
  resumeUrl: z.string().default(""),
});

export type ISiteSettings = z.infer<typeof siteSettingsZodSchema>;

export interface ISiteSettingsDocument extends ISiteSettings, Document {
  createdAt: Date;
  updatedAt: Date;
}

const siteSettingsSchema = new Schema<ISiteSettingsDocument>(
  {
    name: { type: String, required: true, trim: true },
    role: { type: String, required: true, trim: true },
    tagline: { type: String, default: "", trim: true },
    bio: { type: String, default: "", trim: true },
    location: { type: String, default: "", trim: true },
    availability: { type: String, default: "", trim: true },
    email: { type: String, required: true, trim: true, lowercase: true },
    phone: { type: String, default: "", trim: true },
    whatsapp: { type: String, default: "", trim: true },
    github: { type: String, default: "", trim: true },
    linkedin: { type: String, default: "", trim: true },
    heroTitle: { type: String, default: "", trim: true },
    heroHighlightWord: { type: String, default: "", trim: true },
    profilePhotoUrl: { type: String, default: "", trim: true },
    resumeUrl: { type: String, default: "", trim: true },
  },
  {
    timestamps: true,
  }
);

export const SiteSettings: Model<ISiteSettingsDocument> =
  mongoose.models.SiteSettings ||
  mongoose.model<ISiteSettingsDocument>("SiteSettings", siteSettingsSchema);

export default SiteSettings;
