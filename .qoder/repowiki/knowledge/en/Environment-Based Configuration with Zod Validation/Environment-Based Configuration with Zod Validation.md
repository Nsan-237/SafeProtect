---
kind: configuration_system
name: Environment-Based Configuration with Zod Validation
category: configuration_system
scope:
    - '**'
source_files:
    - backend-api/src/config/env.ts
    - backend-api/src/config/database.ts
    - backend-api/.env.example
    - mobile-app/.env.example
    - mobile-app/src/services/api.ts
    - mobile-app/app.json
    - web-dashboard/.env.example
    - web-dashboard/src/lib/api.ts
    - web-dashboard/next.config.js
---

## Overview

The SafeProtect monorepo uses a simple, environment-variable-driven configuration system. Each sub-project (backend API, mobile app, web dashboard) loads its own `.env` file via `dotenv`, and the backend additionally validates all required variables at startup using Zod schemas. There is no centralized configuration service; each process reads only what it needs from its local environment.

## Backend API (`backend-api/`)

- **Loader**: `src/config/env.ts` calls `dotenv.config()` to load `.env` into `process.env`, then parses it through a Zod schema that defines exactly which variables are required and their types:
  - `PORT` — defaults to `'5000'`
  - `DATABASE_URL` — required string (used by Prisma)
  - `JWT_SECRET` — required string
  - `JWT_REFRESH_SECRET` — required string
- **Validation enforcement**: `envSchema.parse(process.env)` throws on missing or malformed values, so the server will fail fast at startup if any required env var is absent. This is the primary runtime invariant for configuration correctness.
- **Database config**: `src/config/database.ts` instantiates `PrismaClient` directly; connection details come from `DATABASE_URL` in `.env` (Prisma reads it automatically). No additional database host/port/env parsing exists.
- **Template**: `.env.example` documents the four required variables with placeholder values.
- **Usage pattern**: Other modules import the validated `env` object rather than reading `process.env` directly, ensuring type safety throughout the API layer.

## Mobile App (`mobile-app/`)

- **Loader**: Expo/React Native reads `EXPO_PUBLIC_API_URL` from `.env`. The variable name follows Expo's convention of `EXPO_PUBLIC_*` prefixing to make it available at build time.
- **Usage**: `src/services/api.ts` resolves the base URL via `process.env.EXPO_PUBLIC_API_URL ?? "http://10.213.43.37:5000/api"`, providing a hardcoded fallback for development.
- **App metadata**: `app.json` holds Expo build-time configuration (name, slug, scheme, version, splash, platform-specific icons). This is static JSON, not loaded from `.env`.
- **Template**: `.env.example` contains the single `EXPO_PUBLIC_API_URL` entry.

## Web Dashboard (`web-dashboard/`)

- **Loader**: Next.js reads `NEXT_PUBLIC_API_URL` from `.env.local` / `.env`. The variable name follows Next.js conventions for client-accessible env vars (`NEXT_PUBLIC_*`).
- **Usage**: `src/lib/api.ts` sets axios `baseURL` to `process.env.NEXT_PUBLIC_API_URL ?? 'http://localhost:5000/api'`, again with a development fallback.
- **Build config**: `next.config.js` is minimal (only enables `reactStrictMode`); no env-based feature flags or runtime toggles exist here.
- **Template**: `.env.example` documents `NEXT_PUBLIC_API_URL`.

## Conventions Observed

1. **Per-process `.env` files**: Each subproject maintains its own `.env` and `.env.example`; there is no shared root `.env` or config registry.
2. **Public vs private env vars**: Only variables prefixed `EXPO_PUBLIC_` and `NEXT_PUBLIC_` are exposed to client-side code in the mobile and web apps respectively. Secrets like `JWT_SECRET` stay server-only.
3. **Fail-fast validation on the backend**: Required env vars are enforced at import/startup via Zod `parse()`, preventing silent misconfiguration.
4. **Fallback defaults in clients**: Both the mobile and web API clients provide hardcoded fallback URLs when the env var is undefined, allowing development without explicit configuration.
5. **No feature flags or layered config**: There is no support for multiple environments (dev/staging/prod) beyond swapping `.env` files; no YAML/TOML/JSON config files are used for runtime settings.
6. **Database config via Prisma**: Database connectivity is entirely driven by `DATABASE_URL` consumed by Prisma; no custom connection logic exists outside `src/config/database.ts`.

## Constraints Enforced by Code

- The backend will not start unless `DATABASE_URL`, `JWT_SECRET`, and `JWT_REFRESH_SECRET` are present in the environment (enforced by Zod schema parse).
- `PORT` is optional and defaults to `5000` if omitted.
- Client apps will fall back to localhost URLs if their respective `*_PUBLIC_API_URL` env var is missing.