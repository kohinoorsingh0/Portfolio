import { Request, Response, NextFunction } from "express";
import rateLimit from "express-rate-limit";
import { RateLimiterMemory } from "rate-limiter-flexible";

/**
 * In-memory rate limiters using rate-limiter-flexible
 */
export const loginRateLimiterFlexible = new RateLimiterMemory({
  points: 5,
  duration: 15 * 60, // 15 minutes
});

export const contactRateLimiterFlexible = new RateLimiterMemory({
  points: 5,
  duration: 60 * 60, // 1 hour
});

export const publicGetRateLimiterFlexible = new RateLimiterMemory({
  points: 100,
  duration: 60, // 1 minute
});

/**
 * Express middleware implementations with express-rate-limit
 * Returns 429 and Retry-After header
 */

// 1. Login limiter: 5 attempts / 15 min per IP
export const loginRateLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 5,
  standardHeaders: true,
  legacyHeaders: false,
  handler: (_req: Request, res: Response, _next: NextFunction, options) => {
    const retryAfter = Math.ceil(options.windowMs / 1000);
    res.setHeader("Retry-After", retryAfter.toString());
    res.status(429).json({
      error: "Too many login attempts. Please try again after 15 minutes.",
      retryAfter,
    });
  },
});

// 2. Contact form limiter: 5 / hour per IP
export const contactRateLimiter = rateLimit({
  windowMs: 60 * 60 * 1000,
  max: 5,
  standardHeaders: true,
  legacyHeaders: false,
  handler: (_req: Request, res: Response, _next: NextFunction, options) => {
    const retryAfter = Math.ceil(options.windowMs / 1000);
    res.setHeader("Retry-After", retryAfter.toString());
    res.status(429).json({
      error: "Too many contact submissions. Please try again after 1 hour.",
      retryAfter,
    });
  },
});

// 3. Public GET limiter: 100 / min per IP
export const publicGetRateLimiter = rateLimit({
  windowMs: 60 * 1000,
  max: 100,
  standardHeaders: true,
  legacyHeaders: false,
  handler: (_req: Request, res: Response, _next: NextFunction, options) => {
    const retryAfter = Math.ceil(options.windowMs / 1000);
    res.setHeader("Retry-After", retryAfter.toString());
    res.status(429).json({
      error: "Too many requests. Please slow down.",
      retryAfter,
    });
  },
});

// 4. Admin APIs limiter: 120 requests / 15 min per IP
export const adminRateLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 120,
  standardHeaders: true,
  legacyHeaders: false,
  handler: (_req: Request, res: Response, _next: NextFunction, options) => {
    const retryAfter = Math.ceil(options.windowMs / 1000);
    res.setHeader("Retry-After", retryAfter.toString());
    res.status(429).json({
      error: "Too many admin requests. Please wait and try again later.",
      retryAfter,
    });
  },
});
