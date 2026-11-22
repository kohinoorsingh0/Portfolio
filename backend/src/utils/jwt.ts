import jwt, { SignOptions, Secret } from "jsonwebtoken";

export const ADMIN_COOKIE_NAME = "admin_token";

export interface AdminTokenPayload {
  adminId: string;
  email: string;
}

const getJwtSecret = (): Secret => {
  const secret = process.env.JWT_SECRET;
  if (!secret) {
    throw new Error("JWT_SECRET environment variable is missing");
  }
  return secret;
};

/**
 * Sign JWT token for single-admin authentication with HS256 and 7-day expiry
 */
export const signToken = (
  payload: AdminTokenPayload,
  expiresIn: string | number = "7d"
): string => {
  const secret = getJwtSecret();
  const options: SignOptions = {
    algorithm: "HS256",
    expiresIn: expiresIn as SignOptions["expiresIn"],
  };
  return jwt.sign(payload, secret, options);
};

/**
 * Verify JWT token with HS256
 */
export const verifyToken = (token: string): AdminTokenPayload => {
  const secret = getJwtSecret();
  return jwt.verify(token, secret, {
    algorithms: ["HS256"],
  }) as AdminTokenPayload;
};

/**
 * Standard httpOnly cookie configuration for admin authentication
 */
export const getAdminCookieOptions = () => {
  const isProd = process.env.NODE_ENV === "production";
  return {
    httpOnly: true,
    secure: isProd,
    sameSite: "lax" as const,
    maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days in ms
    path: "/",
  };
};
