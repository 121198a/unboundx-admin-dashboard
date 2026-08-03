<div align="center">

# ⚡ UnboundX Admin Dashboard

**A fast, modern React 19 admin panel — sidebar navigation, authenticated routes,
paginated data tables for every backend module, and a dedicated Level Activity
builder.**

[![React](https://img.shields.io/badge/React-19-61DAFB?logo=react&logoColor=white)](https://react.dev)
[![Vite](https://img.shields.io/badge/Vite-8-646CFF?logo=vite&logoColor=white)](https://vitejs.dev)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind-4-38BDF8?logo=tailwindcss&logoColor=white)](https://tailwindcss.com)
[![React Router](https://img.shields.io/badge/React_Router-7-CA4245?logo=reactrouter&logoColor=white)](https://reactrouter.com)
[![License](https://img.shields.io/badge/license-Private-lightgrey)](#)

</div>

---

## ✨ Overview

UnboundX is a single-page admin dashboard built with React 19 and Vite. It ships
with a clean authentication flow, a reusable data-table + pagination system wired
to 20+ backend modules, and a purpose-built Level Activity editor (levels made up
of tasks — title, description, required count, XP, module).

## 🧭 Table of contents

- [Features](#-features)
- [Tech stack](#-tech-stack)
- [Getting started](#-getting-started)
- [Environment variables](#-environment-variables)
- [Project structure](#-project-structure)
- [Authentication](#-authentication)
- [API response compatibility](#-api-response--pagination-compatibility)
- [Adding a new module](#-adding-a-brand-new-module-eg-achievements)
- [Deploying to Vercel](#-deploying-to-vercel)
- [Pushing to GitHub from VS Code](#-pushing-to-github-from-vs-code)

## 🚀 Features

- 🔐 **Authentication** — token-based login, protected routes, automatic logout on `401`
- 📊 **20+ admin modules** — Users, Activity, Competitions, Missions, Widgets, Portfolios,
  Notifications, Reports, and more — all sharing one paginated, searchable table component
- 🏆 **Level Activity builder** — create/edit levels with a dynamic list of tasks
- 🎨 **Custom branding** — upload your own login/sidebar logo, applied instantly across tabs
- 🧩 **Flexible API layer** — one Axios client that adapts to `bearer` / `apiKey` / `cookie` / `basic`
  auth strategies via a single env var
- 🛡️ **Resilient by design** — every request funnels through one error-handling layer with
  human-readable messages for network, timeout, and server errors

## 🛠 Tech stack

| Layer       | Choice                          |
|-------------|----------------------------------|
| UI          | React 19 (functional components + hooks only) |
| Build tool  | Vite 8                          |
| Routing     | React Router DOM v7             |
| HTTP client | Axios                           |
| Styling     | Tailwind CSS v4                 |
| Icons       | lucide-react                    |
| Linting     | oxlint                          |

## 📦 Getting started

```bash
# 1. Install dependencies
npm install

# 2. Set up environment variables
cp .env.example .env
# then edit .env and fill in your backend URL (see below)

# 3. Run the dev server
npm run dev
```

The app will be available at **https://unboundx-admin-dashboard.vercel.app/login**.

Build for production:

```bash
npm run build
npm run preview   # preview the production build locally
```

Lint the source code:

```bash
npm run lint
```

## 🔑 Environment variables

This project reads all backend configuration from Vite env vars — **no backend
URL or credentials are hard-coded in the source**. Copy `.env.example` to `.env`
and fill in your own values:

```bash
VITE_API_BASE_URL=https://your-backend.example.com
VITE_AUTH_STRATEGY=bearer     # bearer | apiKey | cookie | basic
VITE_API_KEY=                 # only needed if VITE_AUTH_STRATEGY=apiKey
VITE_API_TIMEOUT=15000
```

> `.env` is git-ignored, so your real backend URL and any keys never get
> committed to the repository. When deploying, set these same variables in
> your hosting provider's dashboard (see [Deploying to Vercel](#-deploying-to-vercel)).

There are **no login credentials stored anywhere in this codebase** — the
Login page is a plain form that authenticates against your backend's
`admin-login` endpoint at runtime.

## 🗂 Project structure

```
src/
  api/            # api.js: every network call, grouped by module
                   # apiClient.js: the one Axios instance + auth headers + error handling
  components.jsx  # shared UI building blocks (Button, Input, Modal, DataTable, etc.)
  config/         # appConfig.js: base URL, auth strategy, and every backend endpoint path
  constants.js    # sidebar nav items, localStorage keys, app-wide constants
  context.jsx     # AuthProvider (login state) + ToastProvider (notifications)
  hooks.js        # usePaginatedList, useDebouncedValue, useLoginLogo
  layouts/        # DashboardLayout.jsx: sidebar + navbar + page outlet
  pages/          # one folder per feature area (auth, users, settings, profile,
                   # levelActivity) plus ListPages.jsx for the simple CRUD modules
  routes/         # AppRoutes.jsx — every URL in the app, in one place
  styles/         # index.css — Tailwind import + design tokens (colors, radii, spacing)
  utils/          # apiShape.js — normalizes whatever list/pagination shape a backend sends
```

## 🔐 Authentication

- `POST /api/user-service/user/admin-login` → stores `access_token` (and
  `refresh_token`/user if present) in `localStorage`, then redirects to `/dashboard`.
- `ProtectedRoute` (in `components.jsx`) redirects to `/login` whenever a token is missing.
- Every request automatically attaches `Authorization: Bearer <token>` (or `x-api-key` /
  Basic / cookie, depending on `VITE_AUTH_STRATEGY` — see `apiClient.js`).
- A `401` response triggers an automatic logout + redirect to `/login`.

## 🔄 API response & pagination compatibility

`src/utils/apiShape.js` transparently supports multiple response envelopes without any
page-level code changes — bare arrays, `{ data: [...] }`, `{ rows: [...] }`,
`{ results: [...] }`, `{ items: [...] }` — and normalizes whichever pagination fields
the backend sends (`page`/`limit`, `per_page`, `offset`, `count`, `meta.total_pages`,
etc.) into one shape every page consumes: `{ page, pageSize, total, totalPages }`.

## 🎨 Login branding (Settings page)

Admins can upload/replace/remove the logo shown on the Login page and sidebar. It's
stored as a base64 string in `localStorage` and applied instantly across tabs via a
custom `ux:logo-changed` event — see `useLoginLogo()` in `hooks.js`.

## ➕ Adding a brand-new module (e.g. "Achievements")

1. **Backend path** — add the endpoint to `ENDPOINTS` in `src/config/appConfig.js`.
2. **API calls** — for a standard CRUD backend, one line in `src/api/api.js`:
   ```js
   export const achievementsApi = createResourceApi(ENDPOINTS.achievements);
   ```
   (If the backend is non-standard, like Level Activity, write a small hand-built object instead.)
3. **Page** — add a page component (reuse `ListPageShell` in `ListPages.jsx` for a
   simple table, or build a dedicated page like `levelActivity/LevelActivity.jsx` for
   anything with a custom form).
4. **Route** — register the URL in `src/routes/AppRoutes.jsx`.
5. **Sidebar link** — add one entry to `NAV_ITEMS` in `src/constants.js`. It appears
   in the sidebar automatically, fully wired up.

## ▲ Deploying to Vercel

This repo includes a `vercel.json` with a SPA rewrite rule so client-side routes
(e.g. `/dashboard/users`) work correctly on direct load/refresh — you don't need
to configure anything extra for routing.

**Option A — Vercel dashboard (recommended for first deploy)**

1. Push this project to GitHub (see [next section](#-pushing-to-github-from-vs-code)).
2. Go to [vercel.com/new](https://vercel.com/new) and import the GitHub repository.
3. Vercel auto-detects Vite. Confirm these build settings:
   - **Framework preset:** Vite
   - **Build command:** `npm run build`
   - **Output directory:** `dist`
4. Under **Environment Variables**, add:
   - `VITE_API_BASE_URL` → your backend URL
   - `VITE_AUTH_STRATEGY` → `bearer` (or your strategy)
   - `VITE_API_KEY` → only if using `apiKey` strategy
   - `VITE_API_TIMEOUT` → e.g. `15000`
5. Click **Deploy**. Vercel gives you a live URL once the build finishes.

**Option B — Vercel CLI**

```bash
npm install -g vercel
vercel login
vercel            # first run: links/creates the project, deploys a preview
vercel --prod     # deploys to your production URL
```

The CLI will prompt you to add environment variables on first deploy, or you can
set them anytime with:

```bash
vercel env add VITE_API_BASE_URL
```

After adding/changing env vars, redeploy with `vercel --prod` for them to take effect.

## 💻 Pushing to GitHub from VS Code

1. **Open the project folder** in VS Code (`File → Open Folder…`).
2. **Initialize Git** (skip if already a repo): open the built-in terminal
   (`` Ctrl+` ``) and run:
   ```bash
   git init
   git add .
   git commit -m "Initial commit"
   ```
3. **Create the GitHub repo** — either:
   - In VS Code's **Source Control** panel (`Ctrl+Shift+G`), click **Publish Branch**
     and follow the prompts to create a new GitHub repository directly, **or**
   - Create an empty repo manually on [github.com/new](https://github.com/new)
     (don't initialize it with a README), then connect it:
     ```bash
     git remote add origin https://github.com/<your-username>/<your-repo>.git
     git branch -M main
     git push -u origin main
     ```
4. **Future changes** — after editing files, use the Source Control panel (or
   `git add . && git commit -m "your message" && git push`) to push updates.

> ✅ Because `.gitignore` excludes `node_modules/`, `dist/`, and `.env`, your
> repository stays small and no local secrets or generated files are ever pushed.

## 📝 Known gaps / next steps

- `userApi` and a few of the newer resource modules (Widgets, Portfolios, Manage
  Interaction Points, Manage Algorithm, Stock Poll, Report Management, etc.) currently
  only have confirmed `list` endpoints — their create/update/delete paths follow the
  conventional REST guess in `createResourceApi` and should be confirmed against
  Swagger/Postman before relying on them in production.
- `levelActivityApi.remove` (delete a whole level) points at a best-guess URL —
  confirm the real path with the backend team; see the comment above it in `api.js`.
- Add role-based menu filtering once the login response includes user roles/permissions.

---

<div align="center">
Built with React, Vite, and Tailwind CSS.
</div>
