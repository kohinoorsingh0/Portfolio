import { Request, Response, NextFunction } from "express";
import { verifyToken, ADMIN_COOKIE_NAME, AdminTokenPayload } from "../utils/jwt";

/**
 * Utility to parse cookies from header if cookie-parser is not loaded
 */
export const parseCookies = (cookieHeader?: string): Record<string, string> => {
  if (!cookieHeader) return {};
  const cookies: Record<string, string> = {};
  cookieHeader.split(";").forEach((pair) => {
    const [name, ...rest] = pair.trim().split("=");
    if (name) {
      cookies[name] = decodeURIComponent(rest.join("="));
    }
  });
  return cookies;
};

export interface AuthenticatedRequest extends Request {
  admin?: AdminTokenPayload;
}

declare global {
  namespace Express {
    interface Request {
      admin?: AdminTokenPayload;
    }
  }
}

/**
 * Middleware: require valid admin JWT from httpOnly cookie
 * Returns 401 if missing or invalid, attaches admin to req
 * Note: Never logs token or hash
 */
export const requireAdmin = (
  req: Request,
  res: Response,
  next: NextFunction
): void => {
  try {
    const rawCookies = (req as { cookies?: Record<string, string> }).cookies;
    const cookies = rawCookies || parseCookies(req.headers.cookie);
    const token = cookies[ADMIN_COOKIE_NAME];

    if (!token) {
      res.status(401).json({ error: "Unauthorized: authentication required" });
      return;
    }

    const payload = verifyToken(token);
    req.admin = payload;
    next();
  } catch (_error) {
    res.status(401).json({ error: "Unauthorized: invalid or expired token" });
  }
};
