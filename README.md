# DevCore Solutions — Web Platform & Enterprise Admin Console

The official frontend application for **DevCore Solutions**, built with **Next.js 16 (App Router)**, **React 19**, **TypeScript**, and **Tailwind CSS v4**.

It powers both the public engineering studio experience (services, launches, case studies, careers, blog, and project inquiry workflows) and the unified, role-based **Admin Dashboard** (`SUPER_ADMIN` / `EDITOR`).

---

## Key Capabilities

### Public Engineering Platform
- **Studio Showcase & Launches** (`/`, `/launches`, `/projects/[slug]`): Interactive case studies, architecture breakdowns, and live product metrics (e.g., DineDesk).
- **Services & Capabilities** (`/services`): Dynamic service catalog managed directly from the Admin Console.
- **Technical Blog** (`/blog`, `/blog/[slug]`): Editorial technical articles with table of contents, code blocks with one-click copy, and newsletter subscription.
- **Careers & Applications** (`/careers`): Live job openings with detail modals and resume upload.
- **Contact & Project Inquiry** (`/contact`, `ContactHub`): Multi-channel inquiry flow with after-hours awareness and callback requests.
- **Authentication & Account Portal** (`/auth/*`, `/account/settings`): Email/password, Google & GitHub OAuth, OTP email verification, invite-token onboarding, active session management, and security activity logs.

### Enterprise Admin Console (`/admin/*`)
- **Unified `AdminShell`**: Collapsible left sidebar, tab-aware breadcrumbs, `Ctrl+K` Command Palette, light/dark theme toggle (`next-themes`), and profile dropdown.
- **Executive Overview & CMS** (`/admin/dashboard`, `/admin/content`): Manage Blog Articles, Job Postings, Candidate Applications, Services, About Page (Team Members, Engineering Principles, Vision/Mission, Headquarters, CTA), and Testimonials.
- **Media Library** (`/admin/media`): Direct-to-Cloudinary signed uploads, metadata/alt-text editing, asset replacement, usage tracking, and manifest export.
- **Growth & Social Syndication** (`/admin/leads`, `/admin/social`, `/admin/social/broadcast`, `/admin/social/manage`): Leads pipeline, OAuth social channel connectors, multi-platform broadcast composer with scheduling/retries, and delivery diagnostics.
- **Team & Security** (`/admin/users`, `/admin/audit-log`, `/admin/settings`): User directory, bulk actions, SMTP invitations, RBAC role matrix (`SUPER_ADMIN`, `EDITOR`, `USER`), immutable audit logs, and platform settings.

---

## Tech Stack

| Layer | Technology |
| --- | --- |
| **Framework** | Next.js `16.4.6` (App Router, Turbopack), React `19.3.0`, TypeScript `5` |
| **Styling & UI** | Tailwind CSS `4.3.3` (`@tailwindcss/node`), `next-themes`, `lucide-react`, `sonner` |
| **Typography** | Self-hosted `next/font/google` (`Inter`, `Geist`, `JetBrains Mono`) |
| **Forms & Data** | `react-hook-form`, `zod`, `@tanstack/react-query`, `@tanstack/react-table` |
| **Rich Text & Charts** | TipTap (`@tiptap/react`), Recharts |
| **Media & Backend** | Express + Prisma + Neon PostgreSQL API (`DevCore-Backend`), Cloudinary CDN |

---

## Project Structure

```text
app/
├── (public)/              # Public pages (Home, Services, Launches, Projects, Careers, Blog, About, Contact, Account)
├── (admin)/               # Protected Admin Console (/admin/dashboard, /content, /media, /leads, /social/*, /users, /audit-log, /settings)
├── (auth)/                # Sign In, Sign Up (supports ?invite=), Email Verification, Password Reset
└── api/auth/              # OAuth callback handlers (Google, GitHub)
components/
├── admin/                 # AdminShell, AboutCmsManager, BlogCmsManager, MediaLibraryManager, UsersManager, Social*, shared modals
├── account/               # Profile, Security, Connected Accounts, Active Sessions, Security Activity
├── careers/               # JobList, JobDetailsModal, JobApplicationForm
├── contact/               # ContactHub & inquiry components
├── glass/                 # GlassNav, GlassCard, theme surface primitives
├── landing/               # Hero, FlagshipSpotlight, BentoProof, ProcessTimeline, TechMatrix
└── shared/                # BrandLogo, GlobalLoader, Footer, ThemeToggle, UserAvatar, Toaster
lib/
├── api.ts                 # Typed API client with global 401/403 admin session handling
└── mock/data.ts           # Fallback data when backend is offline during static build
styles/
└── globals.src.css        # Tailwind v4 theme tokens (compiled to app/globals.css via scripts/build-css.js)
```

---

## Getting Started

### Prerequisites
- **Node.js** `20+`
- Running instance of **DevCore-Backend** (default `http://localhost:5000`)

### 1. Install Dependencies
```bash
npm install
```

### 2. Configure Environment Variables
Copy `.env.example` to `.env.local` and configure the values:

```env
NEXT_PUBLIC_API_URL=http://localhost:5000
NEXT_PUBLIC_APP_URL=http://localhost:3000
```

### 3. Run Development Server
```bash
npm run dev
```
Open [http://localhost:3000](http://localhost:3000) in your browser.

---

## Available Scripts

| Command | Description |
| --- | --- |
| `npm run dev` | Compiles CSS tokens (`scripts/build-css.js`) and starts Next.js dev server |
| `npm run build` | Compiles CSS tokens and builds the production bundle |
| `npm run start` | Starts the production Next.js server |
| `npm run lint` | Runs ESLint across the project |
| `npm run build:css` | Rebuilds `app/globals.css` from `styles/globals.src.css` |

---

## Team

- **Kazi Mahedi Hasan** — Co-Founder & Full Stack Developer ([GitHub](https://github.com/kazi-Samin) · [LinkedIn](https://www.linkedin.com/in/kazi-mahedi-hasan))
- **Fourkan Bin Ilias** — Co-Founder & Full Stack Developer ([GitHub](https://github.com/Pinon1345) · [LinkedIn](https://www.linkedin.com/in/fourkan-bin-ilias/))
