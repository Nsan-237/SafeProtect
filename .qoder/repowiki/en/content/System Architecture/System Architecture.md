# System Architecture

<cite>
**Referenced Files in This Document**
- [index.ts](file://backend-api/src/index.ts)
- [schema.prisma](file://backend-api/prisma/schema.prisma)
- [auth.controller.ts](file://backend-api/src/controllers/auth.controller.ts)
- [token.ts](file://backend-api/src/utils/token.ts)
- [auth.ts](file://backend-api/src/middleware/auth.ts)
- [rbac.ts](file://backend-api/src/middleware/rbac.ts)
- [cases.controller.ts](file://backend-api/src/controllers/cases.controller.ts)
- [routes/index.ts](file://backend-api/src/routes/index.ts)
- [routes/auth.routes.ts](file://backend-api/src/routes/auth.routes.ts)
- [App.tsx](file://mobile-app/App.tsx)
- [AuthContext.tsx](file://mobile-app/src/contexts/AuthContext.tsx)
- [api.ts](file://mobile-app/src/services/api.ts)
- [RootNavigator.tsx](file://mobile-app/src/navigation/RootNavigator.tsx)
- [layout.tsx](file://web-dashboard/src/app/layout.tsx)
- [middleware.ts](file://web-dashboard/src/middleware.ts)
</cite>

## Table of Contents
1. [Introduction](#introduction)
2. [Project Structure](#project-structure)
3. [Core Components](#core-components)
4. [Architecture Overview](#architecture-overview)
5. [Detailed Component Analysis](#detailed-component-analysis)
6. [Dependency Analysis](#dependency-analysis)
7. [Performance Considerations](#performance-considerations)
8. [Troubleshooting Guide](#troubleshooting-guide)
9. [Conclusion](#conclusion)

## Introduction
This document describes the system architecture for SafeProtect Cameroon, a three-tier application composed of:
- Backend API (Express.js + TypeScript)
- Mobile App (React Native + Expo)
- Web Dashboard (Next.js 14)

The system supports role-based access control across Victim, Social Worker, Organization, and Admin roles, with secure authentication using JWT tokens. Data is persisted in a MySQL database via Prisma ORM. The architecture emphasizes separation of concerns between victim-facing features, social worker workflows, and administrative dashboards.

## Project Structure
The repository is organized into three primary tiers:
- backend-api: Express server with controllers, middleware, routes, Prisma schema, and utilities
- mobile-app: React Native app with navigation, auth context, and API client
- web-dashboard: Next.js dashboard with middleware-based route protection and UI components

```mermaid
graph TB
subgraph "Mobile App"
M_App["App.tsx"]
M_Auth["AuthContext.tsx"]
M_API["services/api.ts"]
M_Nav["navigation/RootNavigator.tsx"]
end
subgraph "Web Dashboard"
W_Layout["app/layout.tsx"]
W_MW["middleware.ts"]
end
subgraph "Backend API"
B_Index["src/index.ts"]
B_Routes["routes/index.ts"]
B_AuthCtrl["controllers/auth.controller.ts"]
B_Token["utils/token.ts"]
B_AuthMW["middleware/auth.ts"]
B_RBAC["middleware/rbac.ts"]
B_Cases["controllers/cases.controller.ts"]
end
subgraph "Database"
DB["MySQL (Prisma Schema)"]
end
M_App --> M_Auth --> M_API --> B_Routes
W_Layout --> W_MW --> B_Routes
B_Routes --> B_AuthCtrl
B_Routes --> B_Cases
B_AuthCtrl --> B_Token
B_AuthCtrl --> DB
B_Cases --> DB
B_Index --> B_Routes
B_AuthMW --> B_AuthCtrl
B_RBAC --> B_Cases
B_Routes --> DB
```

**Diagram sources**
- [App.tsx:8-16](file://mobile-app/App.tsx#L8-L16)
- [AuthContext.tsx:22-76](file://mobile-app/src/contexts/AuthContext.tsx#L22-L76)
- [api.ts:28-99](file://mobile-app/src/services/api.ts#L28-L99)
- [layout.tsx:9-18](file://web-dashboard/src/app/layout.tsx#L9-L18)
- [middleware.ts:6-24](file://web-dashboard/src/middleware.ts#L6-L24)
- [index.ts:10-33](file://backend-api/src/index.ts#L10-L33)
- [routes/index.ts:15-37](file://backend-api/src/routes/index.ts#L15-L37)
- [auth.controller.ts:13-83](file://backend-api/src/controllers/auth.controller.ts#L13-L83)
- [token.ts:4-16](file://backend-api/src/utils/token.ts#L4-L16)
- [auth.ts:5-19](file://backend-api/src/middleware/auth.ts#L5-L19)
- [rbac.ts:5-12](file://backend-api/src/middleware/rbac.ts#L5-L12)
- [cases.controller.ts:48-78](file://backend-api/src/controllers/cases.controller.ts#L48-L78)
- [schema.prisma:47-207](file://backend-api/prisma/schema.prisma#L47-L207)

**Section sources**
- [index.ts:10-33](file://backend-api/src/index.ts#L10-L33)
- [schema.prisma:47-207](file://backend-api/prisma/schema.prisma#L47-L207)
- [App.tsx:8-16](file://mobile-app/App.tsx#L8-L16)
- [layout.tsx:9-18](file://web-dashboard/src/app/layout.tsx#L9-L18)

## Core Components
- Backend API: Express server with security middleware (helmet, cors, rate limiting), centralized error handling, and modular routes under /api
- Authentication: JWT-based access and refresh tokens; token generation and verification utilities; middleware to authenticate requests and enforce RBAC
- Data Layer: Prisma ORM with MySQL; models for User, Victim, SocialWorker, Organization, Incident, Case, Appointment, Service, Message, Notification, AuditLog, RefreshToken
- Mobile App: React Native app with AuthContext managing session state, Axios interceptors for token injection and refresh flow, and role-based navigation routing
- Web Dashboard: Next.js app with middleware protecting dashboard routes by checking cookies for an access token

Key responsibilities:
- Role-based scoping for data access (e.g., cases filtered by user role)
- Secure token lifecycle management (short-lived access tokens, longer-lived refresh tokens)
- Separation of victim and social worker interfaces through navigation and permissions
- Administrative capabilities via protected dashboard routes

**Section sources**
- [index.ts:10-33](file://backend-api/src/index.ts#L10-L33)
- [auth.controller.ts:13-83](file://backend-api/src/controllers/auth.controller.ts#L13-L83)
- [token.ts:4-16](file://backend-api/src/utils/token.ts#L4-L16)
- [auth.ts:5-19](file://backend-api/src/middleware/auth.ts#L5-L19)
- [rbac.ts:5-12](file://backend-api/src/middleware/rbac.ts#L5-L12)
- [cases.controller.ts:7-23](file://backend-api/src/controllers/cases.controller.ts#L7-L23)
- [AuthContext.tsx:22-76](file://mobile-app/src/contexts/AuthContext.tsx#L22-L76)
- [api.ts:28-99](file://mobile-app/src/services/api.ts#L28-L99)
- [middleware.ts:6-24](file://web-dashboard/src/middleware.ts#L6-L24)

## Architecture Overview
SafeProtect uses a three-tier architecture where clients communicate with the backend over REST APIs, and the backend persists data to MySQL. Authentication and authorization are enforced at both client and server layers.

```mermaid
sequenceDiagram
participant Client as "Client (Mobile/Web)"
participant API as "Express API"
participant AuthMW as "Auth Middleware"
participant Ctrl as "Controller"
participant DB as "MySQL (Prisma)"
Client->>API : POST /api/auth/login {email, password}
API->>Ctrl : login()
Ctrl->>DB : findUserByEmail(email)
DB-->>Ctrl : User record
Ctrl->>Ctrl : verify password
Ctrl->>Ctrl : generateTokens(userId, role)
Ctrl->>DB : create refreshToken
Ctrl-->>Client : {user, accessToken, refreshToken}
Client->>API : GET /api/cases (Authorization : Bearer accessToken)
API->>AuthMW : authenticate()
AuthMW-->>API : req.user set
API->>Ctrl : getAll()
Ctrl->>DB : findMany(cases with role-based scope)
DB-->>Ctrl : Cases
Ctrl-->>Client : Cases list
```

**Diagram sources**
- [auth.controller.ts:54-83](file://backend-api/src/controllers/auth.controller.ts#L54-L83)
- [token.ts:4-16](file://backend-api/src/utils/token.ts#L4-L16)
- [auth.ts:5-19](file://backend-api/src/middleware/auth.ts#L5-L19)
- [cases.controller.ts:48-78](file://backend-api/src/controllers/cases.controller.ts#L48-L78)
- [schema.prisma:47-207](file://backend-api/prisma/schema.prisma#L47-L207)

## Detailed Component Analysis

### Authentication Flow (JWT Access + Refresh Tokens)
- Login registers or authenticates users, generates short-lived access tokens and longer-lived refresh tokens, and stores refresh tokens in the database
- Mobile app attaches access tokens to requests and handles 401 responses by refreshing tokens once before forcing logout if refresh fails
- Web dashboard protects routes by checking for an access token cookie and redirects unauthenticated users to login

```mermaid
sequenceDiagram
participant Mobile as "Mobile App"
participant API as "Express API"
participant TokenUtil as "Token Utils"
participant DB as "MySQL"
Mobile->>API : POST /api/auth/login
API->>DB : Validate credentials
API->>TokenUtil : generateTokens(userId, role)
TokenUtil-->>API : {accessToken, refreshToken}
API->>DB : Store refreshToken
API-->>Mobile : {user, accessToken, refreshToken}
Mobile->>API : GET /api/cases (Bearer accessToken)
API->>API : authenticate() validates accessToken
API-->>Mobile : Cases (if authorized)
Mobile->>API : 401 Unauthorized
Mobile->>API : POST /api/auth/refresh-token (refreshToken)
API->>DB : Verify stored refreshToken
API->>TokenUtil : generateTokens(userId, role)
API-->>Mobile : New tokens
Mobile->>API : Retry original request with new accessToken
```

**Diagram sources**
- [auth.controller.ts:54-110](file://backend-api/src/controllers/auth.controller.ts#L54-L110)
- [token.ts:4-16](file://backend-api/src/utils/token.ts#L4-L16)
- [api.ts:28-99](file://mobile-app/src/services/api.ts#L28-L99)
- [auth.ts:5-19](file://backend-api/src/middleware/auth.ts#L5-L19)

**Section sources**
- [auth.controller.ts:13-110](file://backend-api/src/controllers/auth.controller.ts#L13-L110)
- [token.ts:4-16](file://backend-api/src/utils/token.ts#L4-L16)
- [api.ts:28-99](file://mobile-app/src/services/api.ts#L28-L99)
- [AuthContext.tsx:22-76](file://mobile-app/src/contexts/AuthContext.tsx#L22-L76)
- [middleware.ts:6-24](file://web-dashboard/src/middleware.ts#L6-L24)

### Role-Based Access Control (RBAC)
- Roles defined in the database include VICTIM, SOCIAL_WORKER, ORGANIZATION, ADMIN
- Middleware extracts user from JWT and attaches it to the request
- Controllers implement role-based scoping to restrict data visibility and actions
- Example: case queries filter results based on user role (admin sees all, victims see their own, social workers see assigned cases)

```mermaid
flowchart TD
Start(["Request Received"]) --> Auth["Extract JWT and validate"]
Auth --> SetUser["Attach user to request"]
SetUser --> CheckRole{"Check required roles"}
CheckRole --> |Allowed| Proceed["Proceed to controller logic"]
CheckRole --> |Forbidden| Deny["Return 403 Forbidden"]
Proceed --> End(["Response"])
Deny --> End
```

**Diagram sources**
- [auth.ts:5-19](file://backend-api/src/middleware/auth.ts#L5-L19)
- [rbac.ts:5-12](file://backend-api/src/middleware/rbac.ts#L5-L12)
- [cases.controller.ts:7-23](file://backend-api/src/controllers/cases.controller.ts#L7-L23)

**Section sources**
- [schema.prisma:10-15](file://backend-api/prisma/schema.prisma#L10-L15)
- [auth.ts:5-19](file://backend-api/src/middleware/auth.ts#L5-L19)
- [rbac.ts:5-12](file://backend-api/src/middleware/rbac.ts#L5-L12)
- [cases.controller.ts:7-23](file://backend-api/src/controllers/cases.controller.ts#L7-L23)

### Data Models and Relationships
- User model centralizes identity and links to role-specific profiles (Victim, SocialWorker, Organization)
- Incident and Case models track reported events and their resolution workflow
- Appointment and Service models support scheduling and service offerings
- Message and Notification models enable communication and status updates
- RefreshToken and AuditLog support security and compliance

```mermaid
erDiagram
USER {
string id PK
string name
string email UK
string phone
string password
enum role
boolean isActive
datetime createdAt
datetime updatedAt
}
VICTIM {
string id PK
string userId FK
}
SOCIAL_WORKER {
string id PK
string userId FK
}
ORGANIZATION {
string id PK
string userId FK
}
INCIDENT {
string id PK
string victimId FK
enum category
text description
string location
datetime date
enum riskLevel
string evidence
boolean isAnonymous
datetime createdAt
}
CASE {
string id PK
string caseNumber UK
string incidentId FK
string assignedWorkerId FK
enum status
enum priority
text notes
datetime createdAt
datetime updatedAt
}
APPOINTMENT {
string id PK
string victimId FK
string organizationId FK
string socialWorkerId FK
string title
datetime date
string time
string type
enum status
text notes
datetime createdAt
}
MESSAGE {
string id PK
string senderId FK
string receiverId FK
text content
boolean isRead
datetime createdAt
}
NOTIFICATION {
string id PK
string userId FK
string title
string message
string type
boolean isRead
datetime createdAt
}
REFRESH_TOKEN {
string id PK
string userId FK
string token UK
datetime expiresAt
datetime createdAt
}
USER ||--o{ VICTIM : "has profile"
USER ||--o{ SOCIAL_WORKER : "has profile"
USER ||--o{ ORGANIZATION : "has profile"
VICTIM ||--o{ INCIDENT : "reports"
INCIDENT ||--o{ CASE : "creates"
SOCIAL_WORKER ||--o{ CASE : "assigned"
VICTIM ||--o{ APPOINTMENT : "schedules"
ORGANIZATION ||--o{ APPOINTMENT : "hosts"
SOCIAL_WORKER ||--o{ APPOINTMENT : "attends"
USER ||--o{ MESSAGE : "sends/receives"
USER ||--o{ NOTIFICATION : "receives"
USER ||--o{ REFRESH_TOKEN : "owns"
```

**Diagram sources**
- [schema.prisma:47-207](file://backend-api/prisma/schema.prisma#L47-L207)

**Section sources**
- [schema.prisma:47-207](file://backend-api/prisma/schema.prisma#L47-L207)

### Mobile App Navigation and Role Separation
- Root navigator selects victim or social worker tabs based on authenticated user role
- Auth context manages login, logout, and session persistence, including restrictions for admin/organization accounts on mobile
- API client injects access tokens and handles refresh flows automatically

```mermaid
sequenceDiagram
participant App as "App.tsx"
participant Nav as "RootNavigator.tsx"
participant Auth as "AuthContext.tsx"
participant API as "services/api.ts"
App->>Nav : Render navigation
Nav->>Auth : Read user and loading state
alt No user
Nav-->>App : Show AuthStack
else Victim role
Nav-->>App : Show VictimTabs
else Social worker role
Nav-->>App : Show SocialWorkerTabs
end
Auth->>API : POST /auth/login
API-->>Auth : {user, tokens}
Auth->>Auth : Persist tokens and user
Auth-->>Nav : Update state
```

**Diagram sources**
- [App.tsx:8-16](file://mobile-app/App.tsx#L8-L16)
- [RootNavigator.tsx:36-58](file://mobile-app/src/navigation/RootNavigator.tsx#L36-L58)
- [AuthContext.tsx:22-76](file://mobile-app/src/contexts/AuthContext.tsx#L22-L76)
- [api.ts:28-99](file://mobile-app/src/services/api.ts#L28-L99)

**Section sources**
- [RootNavigator.tsx:36-58](file://mobile-app/src/navigation/RootNavigator.tsx#L36-L58)
- [AuthContext.tsx:22-76](file://mobile-app/src/contexts/AuthContext.tsx#L22-L76)
- [api.ts:28-99](file://mobile-app/src/services/api.ts#L28-L99)

### Web Dashboard Route Protection
- Next.js middleware checks for an access token cookie and redirects to login if missing
- Public paths like login are allowed without authentication

```mermaid
flowchart TD
Request["Incoming Request"] --> CheckPublic{"Path is public?"}
CheckPublic --> |Yes| Allow["Allow request"]
CheckPublic --> |No| CheckCookie{"Has accessToken cookie?"}
CheckCookie --> |No| Redirect["Redirect to /login?from=path"]
CheckCookie --> |Yes| Allow
```

**Diagram sources**
- [middleware.ts:6-24](file://web-dashboard/src/middleware.ts#L6-L24)

**Section sources**
- [middleware.ts:6-24](file://web-dashboard/src/middleware.ts#L6-L24)

## Dependency Analysis
The system exhibits clear layering and separation:
- Clients depend on the backend API via REST endpoints
- Backend depends on Prisma and MySQL for data operations
- Middleware provides cross-cutting concerns (authentication, validation, error handling)
- Controllers encapsulate business logic and coordinate with data models

```mermaid
graph LR
Mobile["Mobile App"] --> API["Express API"]
Web["Web Dashboard"] --> API
API --> Routes["Routes"]
Routes --> Controllers["Controllers"]
Controllers --> Middleware["Middleware (auth, rbac)"]
Controllers --> DB["MySQL (Prisma)"]
```

**Diagram sources**
- [index.ts:10-33](file://backend-api/src/index.ts#L10-L33)
- [routes/index.ts:15-37](file://backend-api/src/routes/index.ts#L15-L37)
- [auth.controller.ts:13-83](file://backend-api/src/controllers/auth.controller.ts#L13-L83)
- [cases.controller.ts:48-78](file://backend-api/src/controllers/cases.controller.ts#L48-L78)
- [schema.prisma:47-207](file://backend-api/prisma/schema.prisma#L47-L207)

**Section sources**
- [routes/index.ts:15-37](file://backend-api/src/routes/index.ts#L15-L37)
- [auth.controller.ts:13-83](file://backend-api/src/controllers/auth.controller.ts#L13-L83)
- [cases.controller.ts:48-78](file://backend-api/src/controllers/cases.controller.ts#L48-L78)

## Performance Considerations
- Rate limiting is applied globally to protect the API from abuse
- Short-lived access tokens reduce exposure window; refresh tokens rotate securely
- Role-based scoping minimizes unnecessary data retrieval by filtering at query time
- Fire-and-forget notifications avoid blocking critical request/response cycles
- Static file serving for uploads reduces overhead on dynamic routes

[No sources needed since this section provides general guidance]

## Troubleshooting Guide
Common issues and resolutions:
- 401 Unauthorized: Ensure access token is present and valid; handle refresh flow if expired
- 403 Forbidden: Verify user role has permission for the requested resource
- Invalid credentials: Check email/password combination and account status
- Session persistence: Confirm tokens and user data are stored correctly in mobile storage
- Web dashboard redirects: Ensure access token cookie is set after login

**Section sources**
- [auth.ts:5-19](file://backend-api/src/middleware/auth.ts#L5-L19)
- [rbac.ts:5-12](file://backend-api/src/middleware/rbac.ts#L5-L12)
- [api.ts:28-99](file://mobile-app/src/services/api.ts#L28-L99)
- [AuthContext.tsx:22-76](file://mobile-app/src/contexts/AuthContext.tsx#L22-L76)
- [middleware.ts:6-24](file://web-dashboard/src/middleware.ts#L6-L24)

## Conclusion
SafeProtect Cameroon’s architecture cleanly separates concerns across three tiers, enforces secure authentication and role-based access control, and provides scalable patterns for future growth. The use of JWT tokens, Prisma-managed MySQL schema, and middleware-driven security ensures robustness and maintainability. Clear boundaries between victim, social worker, and administrative interfaces improve usability and safety for sensitive workflows.

[No sources needed since this section summarizes without analyzing specific files]