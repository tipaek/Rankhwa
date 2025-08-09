# Rankhwa Frontend

This repository contains a frontend for **Rankhwa**, a site to discover, rate and curate manhwa and webtoons.  It is built with React, TypeScript, Vite, TailwindCSS and TanStack Query.

## Getting started

1. **Install dependencies**

   ```bash
   npm install
   ```

   You can also use `pnpm install` if you prefer.  The project was scaffolded with Vite and uses modern ES modules, so Node ≥ 16 is required.

2. **Configure the API base**

   Copy the provided `.env.example` to `.env` and adjust `VITE_API_BASE` to point at your deployed backend.  The default value points to the public sample deployment.

   ```bash
   cp .env.example .env
   # then edit .env if necessary
   ```

3. **Run the development server**

   ```bash
   npm run dev
   ```

   This starts Vite’s dev server on http://localhost:5173/ by default.  Changes in the `src/` directory will automatically trigger hot module reloads.

4. **Build for production**

   To produce an optimized build in `dist/` run:

   ```bash
   npm run build
   ```

   You can preview the build locally via `npm run preview`.

## Project structure

```
rankhwa-frontend/
├── index.html          # Entry point with root container and theme bootstrap
├── public/             # Static assets served as-is
│   ├── favicon.svg
│   └── logo.svg
├── src/
│   ├── main.tsx        # Hooks up React with React Query and React Router
│   ├── app.tsx         # Defines the routing structure and layout shell
│   ├── routes/         # Page-level components for each route (Home, Search, Manhwa, Auth, Profile, Submit, NotFound)
│   ├── components/     # Small UI primitives (Button, Input, Card, Badge, Dialog, Dropdown, Tabs, Toast)
│   ├── features/       # Domain specific modules grouped by feature
│   │   ├── auth/       # Authentication logic (AuthForm, store, hooks, protected route)
│   │   ├── search/     # Search bar, filters, types and helper hooks
│   │   ├── manhwa/     # Manhwa card/grid, rating stars, add‑to‑list
│   │   └── lists/      # List tabs, card lists and actions
│   ├── lib/            # Generic helpers (API client, query client, fetch wrapper, className helper)
│   └── styles/         # Global and theme styles (Tailwind CSS variables)
├── tailwind.config.ts  # Tailwind config using CSS variables for colours
├── tsconfig.json       # TypeScript compiler options
├── vite.config.ts      # Vite configuration with React plugin
└── README.md           # This file
```

## Notes

* **Authentication:** JWTs are stored in both memory and `localStorage` to allow session persistence.  On 401/403 responses the token is cleared and the user is redirected to the login page with a toast message.  After login the user is returned to their previous page.
* **Dark/light theme:** The theme toggle writes to `localStorage`.  CSS variables in `styles/theme.css` drive the colours for both modes; Tailwind uses those variables.
* **API wiring:** All network requests originate from `lib/api.ts` which prepends `import.meta.env.VITE_API_BASE` to every path and handles auth headers.  React Query provides caching, deduplication and optimistic updates for rating and list operations.
* **URL‑driven filters:** The search page stores all filter state in the URL’s querystring.  Navigating back/forward preserves results and the `useSearchParams` hook centralises the parsing and updating logic.

This codebase provides a solid foundation for building a polished manhwa discovery experience.  It is designed to be extended – for example, you could add analytics, offline support or a submission workflow by following the established patterns.