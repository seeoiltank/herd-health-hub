# Herd Health Hub

Herd Health Hub is a **Base44**-powered web app for managing farm animals and their health history.

It’s built as a React single-page app (SPA) using **Vite**, **React Router**, **Tailwind CSS**, and **@tanstack/react-query**, with data + authentication provided by **Base44**.

## What the app does

Core features currently implemented in this repository:

- **Dashboard**
  - Quick stats for total animals, healthy animals, vaccinations, and animals needing attention
  - Recent activity + upcoming vaccinations
- **Animals**
  - Add animals
  - Search + filter by species and health status
  - Grid/list viewing
- **Animal detail**
  - View and edit an individual animal
  - Add/view **Health Records** for an animal
  - Add/view **Vaccinations** for an animal
  - Delete an animal (with confirmation)
- **Health Records**
  - Browse health history across animals
  - Filter by record type + search
  - Total medical cost summary
- **Vaccinations**
  - Browse vaccination records across animals
  - Status grouping (overdue / due soon / completed)
  - Filter + search
- **Profile**
  - View current user
  - Logout
  - Request account deletion (or delete, if enabled by Base44 entity permissions)

## Tech stack

- **Frontend:** React 18
- **Build tool:** Vite
- **Routing:** react-router-dom
- **Styling:** Tailwind CSS (+ tailwindcss-animate)
- **Data fetching / caching:** @tanstack/react-query
- **Animations:** framer-motion
- **Backend / Auth / Data:** Base44 via @base44/sdk

## Screenshots

Add screenshots to a folder (recommended: `docs/screenshots/`) and reference them here.

Example placeholders (create these files and update names as needed):

- `docs/screenshots/dashboard.png`
- `docs/screenshots/animals.png`
- `docs/screenshots/animal-detail.png`
- `docs/screenshots/vaccinations.png`
- `docs/screenshots/health-records.png`

Then embed them like:

```md
![Dashboard](docs/screenshots/dashboard.png)
```

## Running locally

### Prerequisites

- Node.js (LTS recommended)
- npm

### Setup

```bash
npm install
```

Create a `.env.local` file in the project root.

#### Required environment variables

This app reads Base44 configuration from Vite env vars:

```bash
VITE_BASE44_APP_ID=your_app_id
VITE_BASE44_APP_BASE_URL=https://your-app.base44.app
```

Optional (only needed in some setups):

```bash
VITE_BASE44_FUNCTIONS_VERSION=prod
```

### Start dev server

```bash
npm run dev
```

### Build

```bash
npm run build
```

### Preview production build

```bash
npm run preview
```

## Deployment

You have two common deployment options depending on how you want to work:

### Option A — Base44 Publish (recommended if you primarily use the Base44 Builder)

1. Connect this GitHub repo to your app in Base44.
2. Make changes either in Base44 Builder or in this repo.
3. In Base44, click **Publish**.

> Base44 notes: Any change pushed to the repo can be reflected in the Base44 Builder, and Base44 handles the backend/auth.

### Option B — Netlify (recommended if you want standard web hosting)

High-level steps:

1. Create a new site in Netlify and connect it to this GitHub repo.
2. Set build settings:
   - **Build command:** `npm run build`
   - **Publish directory:** `dist`
3. Add environment variables in Netlify site settings:
   - `VITE_BASE44_APP_ID`
   - `VITE_BASE44_APP_BASE_URL`
   - (optional) `VITE_BASE44_FUNCTIONS_VERSION`

If you use client-side routing (React Router), ensure Netlify is configured to route all paths to `index.html`.

A common way is to add a `_redirects` file:

```
/*    /index.html   200
```

(We can add this for you if you want.)

## Repo structure (quick map)

- `src/main.jsx` – app entry point
- `src/App.jsx` – providers (auth + react-query) and routing
- `src/pages/` – main pages (Dashboard, Animals, AnimalDetail, Vaccinations, HealthRecords, Profile)
- `src/components/` – UI components (forms, cards, dialogs, etc.)
- `src/lib/` – auth context, navigation tracking, shared utilities

## Notes / tips

- Base44 auth uses a token that can be passed via URL params and stored in localStorage.
- If you run into login loops or auth errors, start by confirming the env vars are correct and that your Base44 app settings allow the users you’re testing with.

## Support / docs

- Base44 GitHub integration docs: https://docs.base44.com/Integrations/Using-GitHub
- Base44 support: https://app.base44.com/support
