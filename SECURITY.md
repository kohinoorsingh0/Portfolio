# Security Specification & Audit Report

This document records the comprehensive security review, encryption standards, rate-limiting policies, headers, and dependency audits for the Kohinoor Singh Portfolio system.

---

## 1. Authentication & Encryption Architecture
- **Password Storage**: Passwords are never stored in plain text. All admin passwords are encrypted using `bcryptjs` with a cost factor of **12 salt rounds**.
- **Password Concealment**: The Mongoose `Admin` schema sets `passwordHash` with `select: false` by default, ensuring credentials are never accidentally serialized or included in query results.
- **Timing Attack Mitigation**: When an invalid email is provided to `/api/admin/login`, bcrypt performs a dummy comparison against an internal placeholder hash to enforce constant-time response execution.
- **Single-User Admin Constraint**: There is no public registration or user creation API. The system enforces a single admin entity.
- **Session Tokens**: Administrative sessions use JSON Web Tokens (JWT) signed with `HS256` and an environment-isolated `JWT_SECRET`, expiring in 7 days.
- **Cookie Security**:
  - `httpOnly: true` (prevents JavaScript/XSS cookie exfiltration)
  - `secure: true` in production (enforces HTTPS-only transmission)
  - `sameSite: "lax"` (mitigates Cross-Site Request Forgery while allowing standard top-level navigations)
  - `path: "/"`

---

## 2. Rate Limiting & Abuse Prevention
The backend implements multi-tiered rate limiting via `express-rate-limit` and `rate-limiter-flexible`:

| Target Endpoint | Rate Limit Threshold | Window | Response on Breach |
| :--- | :--- | :--- | :--- |
| **Admin Login** (`POST /api/admin/login`) | 5 attempts | 15 minutes | HTTP 429 + `Retry-After: 900` |
| **Contact Form** (`POST /api/contact`) | 5 submissions | 1 hour | HTTP 429 + `Retry-After: 3600` |
| **All Admin APIs** (`/api/admin/*`) | 120 requests | 15 minutes | HTTP 429 + `Retry-After: 900` |
| **Asset Uploads** (`POST /api/admin/upload`) | 50 uploads | 15 minutes | HTTP 429 + `Retry-After: 900` |
| **Public GET Routes** (`/api/*`) | 100 requests | 1 minute | HTTP 429 + `Retry-After: 60` |

All rate-limit responses return standardized JSON error objects and standard RFC 6585 `Retry-After` headers.

---

## 3. Strict Input Validation (Zod)
Every mutating endpoint (`POST`, `PUT`, `PATCH`) enforces strict Zod schema validation prior to database interaction:
- **`POST /api/contact`**: Validates `name` (min 2, max 100), `email` (valid email format), `message` (min 10, max 2000), and rejects submissions containing honeypot content (`_gotcha`).
- **`POST /api/admin/login`**: Validates email format and password presence.
- **`PUT /api/admin/settings`**: Validates bio length, contact details, social URLs, and status strings.
- **`POST / PUT /api/admin/skills`**: Validates category, name, icon, order, and visibility toggles.
- **`POST / PUT /api/admin/projects`**: Validates title, slug, stack array, URLs, and case study sections.
- **`POST / PUT /api/admin/journey`**: Validates type, year label, organization, and order.
- **`PATCH /api/admin/messages/:id`**: Validates boolean `read` status.

Invalid payloads immediately return HTTP 400 Bad Request with field-level validation errors, protecting the database layer from malformed data or injection attacks.

---

## 4. Secret Isolation & Zero Client Leakage
- **Static Analysis Verification**: Comprehensive recursive grep across `frontend/` confirms **zero** occurrences of sensitive credentials:
  - `JWT_SECRET`: 0 hits in `frontend/`
  - `SMTP_PASS`: 0 hits in `frontend/`
  - `CLOUDINARY_API_SECRET`: 0 hits in `frontend/`
  - `MONGODB_URI`: 0 hits in `frontend/`
- **Environment Isolation**: The frontend only exposes variables prefixed with `NEXT_PUBLIC_` (`NEXT_PUBLIC_API_URL` and `NEXT_PUBLIC_SITE_URL`).
- **Production Server Safety**: Production resumes are served directly through authenticated Cloudinary URLs rather than runtime file system writes.

---

## 5. Security Headers
Both the backend Express service and the Next.js frontend serve comprehensive security headers:
- **`Content-Security-Policy`**: Restricts resource execution to trusted origins, disallows object plugins (`object-src 'none'`), and requires upgraded HTTPS requests.
- **`Strict-Transport-Security`**: `max-age=31536000; includeSubDomains; preload`
- **`X-Frame-Options`**: `DENY` (frontend) / `SAMEORIGIN` (backend) to prevent clickjacking.
- **`X-Content-Type-Options`**: `nosniff` (prevents MIME sniffing).
- **`Referrer-Policy`**: `strict-origin-when-cross-origin` / `no-referrer`
- **`Permissions-Policy`**: `camera=(), microphone=(), geolocation=()`
- **Information Concealment**: `poweredByHeader: false` configured in Next.js to eliminate `X-Powered-By: Next.js`.

---

## 6. File Upload Verification
All file uploads (`POST /api/admin/upload`) require active admin authentication and enforce:
- **MIME Whitelist**: `image/jpeg`, `image/png`, `image/webp`, `application/pdf`
- **Extension Whitelist**: `.jpg`, `.jpeg`, `.png`, `.webp`, `.pdf`
- **Payload Size Restriction**: Strict 5MB limit enforced via Multer memory storage.
- **Buffer Stream**: Files are streamed directly into Cloudinary memory-to-cloud without persisting temporary files to the local file system.

---

## 7. Error Handling & Sanitization
All server-side `catch` blocks intercept runtime errors:
- Technical errors (stack traces, database driver exceptions, internal paths) are logged exclusively to stdout/stderr on the server.
- The client receives only generic, sanitized error messages (e.g., `"Internal server error"`, `"Database connection failed"`, `"Invalid email or password"`).
- Zero stack traces or sensitive internal paths are exposed over HTTP.

---

## 8. Dependency Vulnerability Audit

### Frontend (`frontend`)
- **Status**: 1 High severity advisory identified (`postcss <= 8.5.22` via Next.js 15.5.x internal bundle).
- **Evaluation & Mitigation**:
  - Next.js 15.5.x is the locked project stack framework.
  - Resolving via `npm audit fix --force` would install Next.js 16 (major breaking change).
  - PostCSS runs strictly at build/compile time on trusted local developer source stylesheets; it does not process untrusted runtime CSS input.
  - Safe to retain under locked Next.js 15.5.x framework guidelines.

### Backend (`backend`)
- **Status**: Zero critical vulnerabilities. Cleaned `minimatch` dev-dependency via `npm audit fix`.
- **Remaining Advisories**:
  1. `nodemailer <= 10.1.3`: Nodemailer is used exclusively as a notification pipeline to send form submissions to the server's own `CONTACT_EMAIL`. It does not parse attacker-controlled recipient headers, external DKIM lists, or untrusted transports.
  2. `zod < 4.6.6`: Advisory pertains to regex denial-of-service on unbounded collection constraints. All API validation schemas enforce bounded, simple scalar fields.
- **Mitigation Decision**: Retained stable pinned packages without introducing breaking major version upgrades (`--force`), as exposure vectors are completely mitigated by architecture.
