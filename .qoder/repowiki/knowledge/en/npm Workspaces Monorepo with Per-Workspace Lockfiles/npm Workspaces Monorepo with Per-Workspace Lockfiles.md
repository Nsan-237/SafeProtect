---
kind: dependency_management
name: npm Workspaces Monorepo with Per-Workspace Lockfiles
category: dependency_management
scope:
    - '**'
source_files:
    - package.json
    - package-lock.json
    - backend-api/package.json
    - web-dashboard/package.json
    - mobile-app/package.json
    - mobile-app/package-lock.json
---

## Dependency Management Approach

SafeProtect Cameroon uses an **npm workspaces monorepo** to manage dependencies across three independent Node.js/TypeScript projects: a backend API (`backend-api`), a Next.js admin dashboard (`web-dashboard`), and an Expo mobile app (`mobile-app`). The root `package.json` declares the workspace members and provides convenience scripts, while each subproject maintains its own `package.json`, `node_modules`, and lockfile.

### System and Tools
- **Package manager**: npm (lockfile version 3).
- **Monorepo orchestration**: npm workspaces declared in the root `package.json` under the `workspaces` field. Only `backend-api` and `web-dashboard` are registered as workspace members; `mobile-app` is intentionally excluded from the workspace list and is installed separately via the `install:all` script (`npm install && cd mobile-app && npm install`).
- **Lockfiles**: A single root `package-lock.json` covers the root package plus the two workspace members (`backend-api` and `web-dashboard`). The `mobile-app` directory has its own separate `package-lock.json`, keeping its dependency tree isolated.
- **No vendoring or private registry**: Dependencies are resolved directly from the public npm registry (`registry.npmjs.org`); no `.npmrc`, `yarn.lock`, `pnpm-lock.yaml`, `go.mod`, or vendor directories are present.

### Key Files
- `package.json` (root): Declares workspaces `["backend-api", "web-dashboard"]`, defines cross-project scripts (`backend`, `web`, `mobile`, `install:all`), and pins one shared runtime dependency (`react-native-web ^0.21.2`) used by the web dashboard for React Native Web rendering.
- `backend-api/package.json`: Express + Prisma + TypeScript server. Dependencies include `express`, `@prisma/client`, `jsonwebtoken`, `bcryptjs`, `helmet`, `cors`, `zod`, `multer`, `uuid`; dev deps include `typescript`, `ts-node`, `nodemon`, `prisma`, and `@types/*` packages.
- `web-dashboard/package.json`: Next.js 14 dashboard using Radix UI primitives, Tailwind CSS, Recharts, and Axios. Dev deps include PostCSS, Autoprefixer, and Tailwind plugins.
- `mobile-app/package.json`: Standalone Expo (~54) / React Native (0.81) app with navigation, camera/location/image-picker, NativeWind/Tailwind, and map support. Has its own `package-lock.json`.
- Root `package-lock.json`: Locks versions for the root package and both workspace members, ensuring deterministic installs across those two projects.

### Architecture and Conventions
- **Per-workspace isolation**: Each project owns its own dependency graph. There is no shared `common` package referenced between them; they communicate only over HTTP via the backend API contract (Axios calls from both frontend clients). This avoids cross-workspace coupling through npm hoisting.
- **Version ranges use caret (`^`)**: All third-party dependencies declare semver-compatible ranges (e.g., `^4.18.2`, `^5.0.0`, `^1.7.2`), allowing minor/patch updates but pinning major versions at install time via lockfiles.
- **Separate dev vs runtime deps**: Backend and web dashboard clearly split runtime `dependencies` from `devDependencies` (build tooling, types, linters). The mobile app mixes everything into `dependencies` (including `tailwindcss` and `babel-preset-expo`), reflecting typical Expo CLI usage.
- **Mobile app exclusion from workspaces**: The `mobile-app` is not part of the npm workspace graph — it is installed independently. This likely reflects Expo's preference for a self-contained dependency tree and avoids potential conflicts between Expo's native build toolchain and the workspace resolver.
- **Shared ecosystem alignment**: Both the backend and web dashboard use TypeScript 5.x and share similar utility libraries (`date-fns`, `axios`), but there is no enforced version pinning across workspaces beyond what each `package.json` specifies.

### Constraints and Enforcement
- **Deterministic installs per scope**: The root `package-lock.json` enforces exact resolved versions for the root and workspace members; the mobile app's own lockfile does the same for that project. CI or deployment should run `npm ci` against the appropriate directory to reproduce builds.
- **Workspace boundary is structural**: Only `backend-api` and `web-dashboard` participate in workspace resolution. Adding a new workspace requires editing the root `package.json` `workspaces` array — there is no automatic discovery.
- **No global/private registry configuration**: No `.npmrc` file exists at the repository root or within any workspace, so all packages must be publicly available on npm.
- **No dependency update automation**: There is no Dependabot, Renovate, or similar bot configuration visible in the repository; updates are expected to be performed manually by editing `package.json` files and committing the resulting lockfile changes.