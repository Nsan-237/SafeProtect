---
kind: error_handling
name: Express Error Handling with Centralized Middleware and Client-Side Token Refresh
category: error_handling
scope:
    - '**'
source_files:
    - backend-api/src/middleware/errorHandler.ts
    - backend-api/src/middleware/auth.ts
    - backend-api/src/middleware/rbac.ts
    - backend-api/src/middleware/validate.ts
    - backend-api/src/index.ts
    - backend-api/src/controllers/auth.controller.ts
    - backend-api/src/controllers/users.controller.ts
    - backend-api/src/utils/token.ts
    - mobile-app/src/services/api.ts
    - web-dashboard/src/lib/api.ts
---

## Overview

The SafeProtect platform implements error handling across three layers: a centralized Express error-handling middleware on the backend, per-controller local try/catch blocks that return typed JSON errors, and client-side Axios interceptors in both the mobile (Expo) and web (Next.js) apps that handle 401 responses via token refresh.

## Backend API (Express)

### Global error handler
- `backend-api/src/middleware/errorHandler.ts` is a single Express error-handling middleware registered last in `src/index.ts`. It reads `err.status` (defaulting to 500) and `err.message` (defaulting to `'Internal server error'`) and responds with `{ error: message }`. This is the catch-all for unhandled exceptions that bubble up through the middleware chain.

### Controller-level error patterns
Controllers do not throw custom error objects; instead they use `try/catch` blocks around async Prisma calls and respond directly with `res.status(...).json({ error: '...' })`. Examples:
- Validation/business errors: `400` with messages like `'Name, email, and password are required'`, `'Email already in use'`, `'Invalid credentials'`, `'User not found'`.
- Auth failures: `401` from `authenticate` middleware (`'Unauthorized'`, `'Invalid token'`) and `refreshToken` controller (`'Invalid or expired refresh token'`).
- Authorization failures: `403` from `authorize` RBAC middleware (`'Forbidden'`).
- Server errors: generic `500` with `{ error: 'Server error' }` in every controller's catch block.

There is no shared `AppError` class, no error code enumeration, and no structured error payloads beyond `{ error: string }`.

### Input validation errors
`backend-api/src/middleware/validate.ts` wraps Zod schemas. On parse failure it returns `400` with `{ error: error.errors }`, where `error.errors` is the Zod `ZodError` array of field-level issues.

### Authentication & authorization errors
- `authenticate` middleware (`auth.ts`): rejects missing/invalid Bearer tokens with `401 { error: 'Unauthorized' }` or `401 { error: 'Invalid token' }`.
- `authorize` middleware (`rbac.ts`): rejects insufficient roles with `403 { error: 'Forbidden' }`.

### Token utilities
`backend-api/src/utils/token.ts` uses `jsonwebtoken` without wrapping errors — `jwt.verify` throws synchronously, which is caught by the calling middleware/controller and converted into a `401` response.

## Mobile App (Expo / React Native)

Client-side error handling lives in `mobile-app/src/services/api.ts` using two Axios instances:
- `api`: attaches `Authorization: Bearer <token>` from `AsyncStorage` to every request.
- `refreshApi`: dedicated instance used only for refresh calls so it never triggers the interceptor again.

On any `401` response, the interceptor attempts a one-time token refresh via `/auth/refresh-token`. If refresh succeeds, it stores new tokens and retries the original request. If refresh fails (or no refresh token exists), it clears `@user`, `@token`, `@refreshToken` from storage and invokes an optional `onAuthFailure` callback (set via `setOnAuthFailure`) so screens can navigate to login. Non-401 errors are rejected as-is.

## Web Dashboard (Next.js)

Client-side error handling in `web-dashboard/src/lib/api.ts` mirrors the mobile pattern with two Axios instances and a response interceptor:
- Attaches `Authorization` header from `localStorage`.
- On `401`, attempts refresh via `/auth/refresh-token` once (deduplicated with a `refreshRequest` promise).
- On success: updates `@token` and `@refreshToken` in localStorage and retries the original request.
- On failure: clears all auth items and redirects to `/login` via `window.location.assign('/login')`.
- Non-401 errors are rejected without side effects.

## Conventions Observed

1. **Backend errors are plain JSON**: Every error response follows `{ error: string }` (or `{ error: ZodError[] }` for validation). There is no unified error envelope with codes or details.
2. **HTTP status codes are chosen ad hoc** in controllers and middleware rather than derived from a shared error type system.
3. **No custom error classes or sentinel errors** exist in the codebase; errors are represented as strings.
4. **Global error handling is minimal**: only the final `errorHandler` middleware handles thrown exceptions; most errors are returned explicitly from controllers/middlewares.
5. **Client apps centralize 401 handling** in Axios interceptors with automatic token refresh and logout-on-failure behavior.
6. **Panic/recover is not used** (Node.js/TypeScript does not use `panic`; there is no `try/catch` at the process level either).
7. **Validation errors are delegated to Zod** and surfaced as arrays of field errors rather than domain-specific messages.