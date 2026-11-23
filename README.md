# Kohinoor Singh — Full-Stack Developer Portfolio

A deliberate, high-performance portfolio and content management system built with Next.js 15 App Router, Express 5, MongoDB Atlas, and Tailwind CSS 4. Matches the Figma design with verified real content, single-user administrative controls, and production-grade security.

---

## 🌐 Live Deployments

| Component | Platform | Live URL | Status Check |
| :--- | :--- | :--- | :--- |
| **Frontend** | Vercel | [portfolio-lime-ten-t4qdjdxqb5.vercel.app](https://portfolio-lime-ten-t4qdjdxqb5.vercel.app/) | [Open Site](https://portfolio-lime-ten-t4qdjdxqb5.vercel.app/) |
| **Backend API** | Render | [portfolio-backend-u97y.onrender.com](https://portfolio-backend-u97y.onrender.com) | [`/health` Check](https://portfolio-backend-u97y.onrender.com/health) |

---

## 🛠️ Stack & Architecture

- **Frontend**: Next.js 15.5.x App Router, React 19.1.x, TypeScript 5.9.x, Tailwind CSS 4.1.x
- **Backend**: Node.js & Express 5.0.x, TypeScript, Mongoose 8.18.x
- **Database**: MongoDB Atlas (Free M0 Cluster)
- **Authentication**: Single-admin JWT authentication via secure `httpOnly` cookies with bcryptjs (12 salt rounds)
- **Security**: Helmet, CORS origin restriction, MongoDB sanitization, rate-limiting on sensitive endpoints
- **Media & Assets**: Cloudinary for dynamic asset hosting, Next.js image optimization
- **Email**: Nodemailer for contact form notifications (saved in MongoDB first)
- **Hosting**: Vercel (Frontend SSR/SSG/ISR) + Render Web Service (Backend API)

---

## 🚀 Step 40: Production Deployment Checklist

### 1. MongoDB Atlas Configuration
- [x] Log in to [MongoDB Atlas Console](https://cloud.mongodb.com/).
- [x] Navigate to **Security** → **Network Access**.
- [x] Add IP Address: `0.0.0.0/0` (Allow Access from Anywhere) — required for Render's dynamic IP pool.
- [x] Verified connection from both local machine and Render web service.

### 2. Render Backend Web Service Setup
- [x] Created Web Service on [Render](https://dashboard.render.com/): `portfolio-backend-u97y`
- [x] Connected GitHub repository: `kohinoorsingh0/Portfolio`.
- [x] Configured Build & Runtime settings:
  - **Root Directory**: `backend`
  - **Runtime**: `Node`
  - **Build Command**: `npm install && npm run build`
  - **Start Command**: `npm start`
- [x] Added Production Environment Variables (`NODE_ENV=production`, `MONGODB_URI`, `JWT_SECRET`, `FRONTEND_URL`, `CONTACT_EMAIL`, `SMTP_*`, `CLOUDINARY_*`).
- [x] Live URL verified: `https://portfolio-backend-u97y.onrender.com`.
- [x] Verified health endpoint: `GET https://portfolio-backend-u97y.onrender.com/health` returns HTTP 200 `OK`.

### 3. Vercel Frontend Project Setup
- [x] Imported GitHub repository on [Vercel](https://vercel.com/new).
- [x] Configured Project Settings:
  - **Framework Preset**: `Next.js`
  - **Root Directory**: `frontend`
- [x] Added Environment Variables:
  - `NEXT_PUBLIC_API_URL=https://portfolio-backend-u97y.onrender.com/api`
  - `NEXT_PUBLIC_SITE_URL=https://portfolio-lime-ten-t4qdjdxqb5.vercel.app`
- [x] Live URL verified: `https://portfolio-lime-ten-t4qdjdxqb5.vercel.app/`.

### 4. Production Database Seeding & Admin Setup
- [x] **Seeded Production Database** (`cd backend && npm run seed`):
  - 15 verified skills across 4 categories
  - 2 verified projects (FixFlow & Kohinoor Tunes)
  - 3 journey milestones (BCA, PW Skills AI Certification, FixFlow Full-Stack role)
  - Profile & site settings (verified identity only)
  - 0 fake testimonials, 0 template fakes
- [x] **Created Single Production Admin** (`cd backend && npm run create-admin`):
  - Created single admin account in MongoDB Atlas (`kohinoorsingh040@gmail.com`)
  - Password hashed with 12 bcrypt rounds
  - Temporary credentials purged from disk

### 5. Production Verification Protocol
- [x] **Public Routes (All 200 OK)**:
  - Home: `/` (200 OK)
  - About: `/about` (200 OK)
  - Projects: `/projects` (200 OK)
  - Case Studies: `/projects/fixflow` (200 OK) and `/projects/kohinoor-tunes` (200 OK)
  - Journey: `/journey` (200 OK)
  - Contact: `/contact` (200 OK)
  - SEO Files: `/robots.txt` (200 OK) and `/sitemap.xml` (200 OK)
  - Admin Login: `/admin/login` (200 OK)
- [x] **Backend Health**: `GET /health` returns HTTP 200 `OK`.
- [x] **Cross-Site Admin Auth**:
  - `POST /api/admin/login` returns HTTP 200 `{"ok":true}` and sets secure cookie.
  - `GET /api/admin/me` verifies identity returning `{"email":"kohinoorsingh040@gmail.com"}`.
- [x] **Contact Form Workflow**:
  - `POST /api/contact` validated input, saved message directly to MongoDB Atlas `contactmessages` collection (`6b045ca46fba9b2bb2de5ced`), returned HTTP 200 `{"success":true}`.
- [x] **Theme & Responsiveness**:
  - Auto day/night theme and manual theme toggle works cleanly without FOUC.
  - Mobile layout verified for 390px viewports with no horizontal scroll.
- [x] **No Fake Content**:
  - Verified only FixFlow & Kohinoor Tunes are live.
  - Verified no fake metrics, testimonials, or template placeholders.

---

## 🔒 Security Best Practices
- No secrets or credentials are ever committed to the repository or logged to consoles.
- Single-admin architecture with rate-limited authentication (5 attempts / 15 minutes).
- MongoDB injection prevention via query sanitization and Mongoose typed schemas.
- Strict HTTP security headers enforced across both Vercel and Express layers.
