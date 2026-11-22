import { Router, Request, Response } from "express";
import { z } from "zod";
import mongoose from "mongoose";
import rateLimit from "express-rate-limit";
import { connectDB } from "../config/db";
import ContactMessage from "../models/ContactMessage";
import { requireAdmin } from "../middleware/auth";

const router = Router();

// 1. Rate limiter for admin messages endpoints (300 requests / 15 minutes)
const adminMessagesLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 300,
  standardHeaders: true,
  legacyHeaders: false,
  handler: (_req: Request, res: Response) => {
    res.status(429).json({ error: "Too many admin requests. Please slow down." });
  },
});

router.use(adminMessagesLimiter);

// 2. Enforce admin authentication on all routes
router.use(requireAdmin);

// Zod schema for updating message status (mark read/unread)
export const updateMessageSchema = z.object({
  read: z.boolean({ required_error: "read status boolean is required" }),
});

/**
 * GET /api/admin/messages
 * Retrieves all contact messages, sorted newest first
 * Strictly omits ipHash / raw IP for privacy & security compliance
 */
router.get("/messages", async (_req: Request, res: Response) => {
  try {
    if (mongoose.connection.readyState !== 1) {
      await connectDB();
    }

    // Explicitly exclude ipHash and __v so no IP details are ever exposed
    const messages = await ContactMessage.find()
      .select("-ipHash -__v")
      .sort({ createdAt: -1 })
      .lean();

    const unreadCount = messages.filter((m) => !m.read).length;

    return res.status(200).json({
      ok: true,
      messages,
      totalCount: messages.length,
      unreadCount,
    });
  } catch (error: unknown) {
    console.error("GET /api/admin/messages error:", (error as Error).message);
    return res.status(500).json({ error: "Failed to fetch messages" });
  }
});

/**
 * PATCH /api/admin/messages/:id
 * Updates read / unread status of a message
 */
router.patch("/messages/:id", async (req: Request, res: Response) => {
  try {
    const rawId = req.params.id;
    const id = Array.isArray(rawId) ? rawId[0] : rawId;
    if (!id || !mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ error: "Invalid message ID format" });
    }

    const parseResult = updateMessageSchema.safeParse(req.body);
    if (!parseResult.success) {
      return res.status(400).json({
        error: "Validation failed",
        details: parseResult.error.errors.map((e) => e.message),
      });
    }

    if (mongoose.connection.readyState !== 1) {
      await connectDB();
    }

    const updated = await ContactMessage.findByIdAndUpdate(
      id,
      { $set: { read: parseResult.data.read } },
      { new: true }
    )
      .select("-ipHash -__v")
      .lean();

    if (!updated) {
      return res.status(404).json({ error: "Message not found" });
    }

    return res.status(200).json({
      ok: true,
      message: updated,
    });
  } catch (error: unknown) {
    console.error("PATCH /api/admin/messages/:id error:", (error as Error).message);
    return res.status(500).json({ error: "Failed to update message status" });
  }
});

/**
 * DELETE /api/admin/messages/:id
 * Permanently deletes a contact message by ID
 */
router.delete("/messages/:id", async (req: Request, res: Response) => {
  try {
    const rawId = req.params.id;
    const id = Array.isArray(rawId) ? rawId[0] : rawId;
    if (!id || !mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ error: "Invalid message ID format" });
    }

    if (mongoose.connection.readyState !== 1) {
      await connectDB();
    }

    const deleted = await ContactMessage.findByIdAndDelete(id);
    if (!deleted) {
      return res.status(404).json({ error: "Message not found" });
    }

    return res.status(200).json({
      ok: true,
      message: "Message deleted successfully",
    });
  } catch (error: unknown) {
    console.error("DELETE /api/admin/messages/:id error:", (error as Error).message);
    return res.status(500).json({ error: "Failed to delete message" });
  }
});

export default router;
