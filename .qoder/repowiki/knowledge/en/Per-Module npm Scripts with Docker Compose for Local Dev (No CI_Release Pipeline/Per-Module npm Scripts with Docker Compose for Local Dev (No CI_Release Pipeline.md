---
kind: build_system
name: Per-Module npm Scripts with Docker Compose for Local Dev (No CI/Release Pipeline)
category: build_system
scope:
    - '**'
source_files:
    - package.json
    - backend-api/package.json
    - web-dashboard/package.json
    - mobile-app/package.json
    - backend-api/docker-compose.yml
    - backend-api/tsconfig.json
    - web-dashboard/next.config.js
    - mobile-app/metro.config.js
    - mobile-app/app.json
---

## Build System Overview

SafeProtect Cameroon is a monorepo composed of three independently built modules — a TypeScript Express backend API, a Next.js admin dashboard, and an Expo mobile app — each with its own `package.json` and build toolchain. There is no top-level Makefile, no shared CI pipeline, and no containerized application image; the only orchestration artifact is a local-development MySQL service via `docker-compose.yml`.

### Top-level workspace scripts

The root `package.json` declares a small set of convenience scripts that `cd` into each subproject:
- `npm run backend` → runs `backend-api`'s `dev` script (`nodemon src/index.ts`).
- `npm run web` → runs `web-dashboard`'s `next dev`.
- `npm run mobile` → runs `mobile-app`'s `expo start`.
- `npm run install:all` → installs root dependencies then runs `npm install` inside `mobile-app` (the only module not included in the declared workspaces).

The root also declares `workspaces: ["backend-api", "web-dashboard"]`, so `npm install` at the repo root will hoist and link those two packages. The mobile app is intentionally excluded from workspaces and must be installed separately.

### Backend API (`backend-api/`)

- **Compiler**: TypeScript (`tsc`) configured by `tsconfig.json`; output goes to `dist/`.
- **Scripts**:
  - `dev`: `nodemon src/index.ts` (hot-reload during development).
  - `build`: `tsc` (produces `dist/index.js`, which is the value of `main`).
  - `start`: `node dist/index.js` (production entry point).
  - `prisma:generate`, `prisma:migrate`, `prisma:seed`: Prisma CLI commands for schema generation, migration, and seeding.
- **Runtime**: Node.js process serving Express on port 3000 (default); no custom Dockerfile or systemd unit.
- **Database**: MySQL 8 is provided locally through `docker-compose.yml` exposing port 3306 with database `safeprotect` and root password `password`. The README instructs running `docker-compose up -d` before starting the API.

### Web Dashboard (`web-dashboard/`)

- **Framework**: Next.js 14 with the App Router.
- **Scripts**:
  - `dev`: `next dev`.
  - `build`: `next build` (static/bundled production build).
  - `start`: `next start` (runs the compiled server).
  - `lint`: `next lint`.
- **Bundler**: Next.js internal bundler; Tailwind CSS via PostCSS (`postcss.config.js`, `tailwind.config.ts`).
- **TypeScript**: Separate `tsconfig.json` per module.
- No Dockerfile or deployment script exists in this module.

### Mobile App (`mobile-app/`)

- **Framework**: Expo (~54) / React Native (0.81) with TypeScript.
- **Scripts**:
  - `start`: `expo start` (Expo Dev Client).
  - `android`: `expo start --android`.
  - `ios`: `expo start --ios`.
  - `web`: `expo start --web`.
- **Bundler**: Metro (configured via `metro.config.js`, `babel.config.js`, `app.json`).
- **Styling**: NativeWind + Tailwind (`tailwind.config.js`, `nativewind-env.d.ts`).
- No native build artifacts (`.apk`, `.ipa`) are committed; builds are expected to be produced locally via Expo CLI.

### Docker usage

Only one Docker resource exists: `backend-api/docker-compose.yml`, which defines a single `db` service using the official `mysql:8` image with a named volume `mysql_data`. It is intended for local development only (hardcoded credentials, exposed port 3306). There is no Dockerfile for any of the three modules, and no multi-stage or production-oriented containerization.

### Versioning & packaging

Each module carries its own `version` field in its `package.json` (`backend-api`: `1.0.0`, `mobile-app`: `1.0.0`, `web-dashboard`: `0.1.0`). There is no shared version bump script, no changelog automation, and no registry publishing step defined in any `scripts` block.

### What is NOT present

- No `Makefile`, `justfile`, or shell-based build orchestrator at the repository root.
- No GitHub Actions, GitLab CI, Jenkinsfile, or any CI configuration under `.github/` or elsewhere.
- No release/tagging workflow, no automated test runner scripts, no lint-only gate.
- No Docker images for the backend, web, or mobile apps — only the MySQL dependency.
- No cross-compilation or platform-specific build flags beyond Expo's standard `--android` / `--ios` / `--web` invocations.

### Conventions observed

- Each subproject is self-contained: it owns its own `package.json`, `tsconfig.json`, and framework-specific config files (`next.config.js`, `metro.config.js`, `babel.config.js`, `tailwind.config.*`).
- Development vs. production entry points are separated by convention: `dev` scripts use hot-reload tools (`nodemon`, `next dev`, `expo start`), while `build` + `start` produce and serve compiled artifacts.
- Environment configuration is per-module via `.env` / `.env.example` files; there is no centralized secrets store or env injection layer.
- Database migrations are driven by Prisma (`prisma migrate dev`), seeded via `prisma seed` (`prisma/seed.ts`).