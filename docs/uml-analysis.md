# SafeProtect Cameroon — UML Analysis Pack

## 1. System scope

SafeProtect is a child-protection and gender-based-violence case-management platform with three deployable applications:

- **Mobile application:** used primarily by victims and social workers.
- **Web dashboard:** used by administrators to monitor, assign, and update cases.
- **REST API:** Express/TypeScript service that applies authentication, authorization, business rules, and persistence through Prisma.

The diagrams below describe the codebase as implemented in August 2026. They are suitable for project analysis, reports, or presentation material.

---

## 2. Use-case diagram

```mermaid
flowchart LR
    victim["Victim / Citizen"]
    worker["Social Worker"]
    admin["Administrator"]
    org["Organization"]

    subgraph safeprotect["SafeProtect Platform"]
        register(["Register and sign in"])
        report(["Report an incident"])
        viewOwn(["View own cases"])
        sos(["Use SOS / find services"])
        viewAssigned(["View assigned cases"])
        updateCase(["Update case status and notes"])
        appointments(["Manage appointments"])
        assign(["Assign a social worker"])
        manageCases(["Monitor all cases"])
        manageUsers(["Manage users, victims, workers, and organizations"])
        analytics(["View analytics and reports"])
        manageServices(["Manage support services"])
    end

    victim --> register
    victim --> report
    victim --> viewOwn
    victim --> sos
    victim --> appointments

    worker --> register
    worker --> viewAssigned
    worker --> updateCase
    worker --> appointments
    worker --> analytics

    admin --> register
    admin --> manageCases
    admin --> assign
    admin --> updateCase
    admin --> manageUsers
    admin --> analytics
    admin --> manageServices

    org --> register
    org --> appointments
    org --> manageServices
```

### Main business rule

A victim creates an incident report. The API automatically creates a related case in the `NEW` state. An administrator assigns the case to a social worker. The assigned worker progresses the case through its permitted lifecycle.

---

## 3. Component diagram

```mermaid
flowchart TB
    subgraph clients["Client Applications"]
        mobile["Mobile App\nReact Native + Expo"]
        dashboard["Admin Dashboard\nNext.js + React"]
    end

    subgraph api["Backend API — Node.js / Express"]
        routes["Routes"]
        middleware["Middleware\nJWT authentication\nRBAC\nRate limit\nUploads"]
        controllers["Controllers\nAuth, incidents, cases, users,\nappointments, messages, analytics"]
        services["Utilities\nJWT, password hashing,\ncase-number generation"]
        prisma["Prisma ORM"]
    end

    database[("MySQL 8 Database")]
    storage["Local uploads directory"]

    mobile -->|"HTTPS / JSON\nAxios + JWT"| routes
    dashboard -->|"HTTPS / JSON\nAxios + JWT"| routes
    routes --> middleware
    middleware --> controllers
    controllers --> services
    controllers --> prisma
    prisma --> database
    middleware --> storage
```

### Layer responsibilities

| Layer | Responsibility |
|---|---|
| Mobile app | Victim reporting, personal case tracking, social-worker case updates, SOS and service screens. |
| Dashboard | Administrative case assignment, case-status updates, management views, analytics. |
| Routes | Maps `/api/*` HTTP endpoints to controller operations. |
| Middleware | Validates JWTs, applies role checks, rate limits requests, and receives evidence uploads. |
| Controllers | Implement the application use cases and ownership checks. |
| Prisma / MySQL | Stores users, role profiles, incidents, cases, appointments, communications, and audit data. |

---

## 4. Domain class diagram

```mermaid
classDiagram
    class User {
        +String id
        +String name
        +String email
        +String phone
        +String password
        +Role role
        +Boolean isActive
        +DateTime createdAt
    }

    class Victim {
        +String id
        +String userId
        +Int age
        +String gender
        +String location
        +String emergencyContact
    }

    class SocialWorker {
        +String id
        +String userId
        +String department
        +String specialization
        +String availability
    }

    class Organization {
        +String id
        +String userId
        +String name
        +String type
        +Boolean isVerified
    }

    class Incident {
        +String id
        +IncidentCategory category
        +String description
        +String location
        +DateTime date
        +RiskLevel riskLevel
        +Boolean isAnonymous
        +String evidence
    }

    class Case {
        +String id
        +String caseNumber
        +CaseStatus status
        +RiskLevel priority
        +String notes
        +DateTime createdAt
        +DateTime updatedAt
    }

    class Appointment {
        +String id
        +String title
        +DateTime date
        +String time
        +String type
        +AppointmentStatus status
        +String notes
    }

    class Service {
        +String id
        +String name
        +String category
        +String description
        +Boolean isActive
    }

    class Message {
        +String id
        +String senderId
        +String receiverId
        +String content
        +Boolean isRead
        +DateTime createdAt
    }

    class Notification {
        +String id
        +String title
        +String message
        +String type
        +Boolean isRead
    }

    class AuditLog {
        +String id
        +String action
        +String entity
        +String entityId
        +String details
        +DateTime createdAt
    }

    class RefreshToken {
        +String id
        +String token
        +DateTime expiresAt
    }

    User "1" --> "0..1" Victim : has profile
    User "1" --> "0..1" SocialWorker : has profile
    User "1" --> "0..1" Organization : has profile
    Victim "1" --> "0..*" Incident : reports
    Incident "1" --> "1..*" Case : generates
    SocialWorker "0..1" <-- "0..*" Case : assigned to
    Victim "1" --> "0..*" Appointment : books
    SocialWorker "0..1" <-- "0..*" Appointment : handles
    Organization "0..1" <-- "0..*" Appointment : hosts
    Organization "1" --> "0..*" Service : offers
    User "1" --> "0..*" Message : sends
    User "1" --> "0..*" Message : receives
    User "1" --> "0..*" Notification : receives
    User "1" --> "0..*" AuditLog : creates
    User "1" --> "0..*" RefreshToken : owns
```

### Enumerations

| Enumeration | Values |
|---|---|
| `Role` | `VICTIM`, `SOCIAL_WORKER`, `ORGANIZATION`, `ADMIN` |
| `CaseStatus` | `NEW`, `UNDER_INVESTIGATION`, `SUPPORT_PROVIDED`, `RESOLVED`, `CLOSED` |
| `RiskLevel` | `LOW`, `MEDIUM`, `HIGH`, `CRITICAL` |
| `IncidentCategory` | `PHYSICAL_ABUSE`, `SEXUAL_ABUSE`, `DOMESTIC_VIOLENCE`, `EMOTIONAL_ABUSE`, `NEGLECT`, `OTHER` |
| `AppointmentStatus` | `SCHEDULED`, `COMPLETED`, `CANCELLED` |

---

## 5. Sequence diagram — victim report to social-worker action

```mermaid
sequenceDiagram
    actor Victim
    participant App as Mobile App
    participant API as Express API
    participant Auth as JWT Middleware
    participant DB as MySQL / Prisma
    actor Admin
    participant Dashboard as Web Dashboard
    actor Worker as Social Worker

    Victim->>App: Complete report form
    App->>API: POST /api/incidents (Bearer token)
    API->>Auth: Verify JWT and role
    Auth-->>API: Authenticated victim
    API->>DB: Find/create victim profile
    API->>DB: Create Incident
    API->>DB: Create Case (status NEW)
    API-->>App: 201 Incident + Case Number
    App-->>Victim: Report confirmation

    Admin->>Dashboard: Open case-management page
    Dashboard->>API: GET /api/cases
    API->>Auth: Verify admin JWT
    API->>DB: Retrieve all cases
    DB-->>API: Cases and related profiles
    API-->>Dashboard: Case list
    Admin->>Dashboard: Select social worker
    Dashboard->>API: PUT /api/cases/{id}/assign
    API->>DB: Assign worker to case
    API-->>Dashboard: Updated case

    Worker->>App: Open assigned cases
    App->>API: GET /api/cases
    API->>DB: Retrieve worker-assigned cases only
    API-->>App: Assigned cases
    Worker->>App: Update status or notes
    App->>API: PATCH /api/cases/{id}
    API->>DB: Update only if worker owns case
    API-->>App: Updated case
```

---

## 6. State diagram — case lifecycle

```mermaid
stateDiagram-v2
    [*] --> NEW: Victim submits incident report
    NEW --> UNDER_INVESTIGATION: Admin assigns worker / worker begins work
    UNDER_INVESTIGATION --> SUPPORT_PROVIDED: Support service is delivered
    SUPPORT_PROVIDED --> RESOLVED: Protection objectives achieved
    RESOLVED --> CLOSED: Administrative closure

    NEW --> CLOSED: Invalid or duplicate report
    UNDER_INVESTIGATION --> CLOSED: Case withdrawn or closed
    SUPPORT_PROVIDED --> UNDER_INVESTIGATION: Further assessment required
```

---

## 7. Authorization matrix

| Capability | Victim | Social worker | Admin | Organization |
|---|:---:|:---:|:---:|:---:|
| Register / login | Yes | Seeded/admin-created account | Seeded/admin-created account | Seeded/admin-created account |
| Submit incident report | Yes | Supported by API | Supported by API | Not a primary flow |
| See own cases | Yes | — | All cases | — |
| See assigned cases | — | Yes | All cases | — |
| Update case status / notes | No | Assigned cases only | All cases | No |
| Assign social worker | No | No | Yes | No |
| Manage users / workers / victims | No | No | Yes | No |
| View analytics | No | Yes | Yes | No |
| Manage services | No | No | Yes | Yes |

---

## 8. Key analysis observations

1. **Case ownership is enforced on the API.** Victims are scoped to cases tied to their own victim profile; social workers are scoped to cases assigned to their own profile; administrators can access all cases.
2. **A report creates both an `Incident` and a `Case`.** This avoids a manual creation step after a victim report.
3. **Assignment is an explicit admin responsibility.** A new case remains visible to administrators until it is assigned to a valid social-worker profile.
4. **The dashboard case-management page now consumes the live API.** It retrieves cases and workers, assigns a worker, and changes case status.
5. **Mobile navigation currently treats every non-victim role as the social-worker flow.** For a production system, add dedicated mobile navigation or deny mobile access for `ADMIN` and `ORGANIZATION` roles.
6. **Some appointment, profile, organization, and service controller operations are broader than the case ownership model.** Before production deployment, apply equivalent resource-ownership checks to those modules.

---

## 9. Suggested presentation order

1. Use-case diagram — explain project actors and objectives.
2. Component diagram — explain the architecture and technologies.
3. Class diagram — explain persistent data and relationships.
4. Sequence diagram — demonstrate the central victim-to-worker workflow.
5. State diagram — present the case-management lifecycle.
6. Authorization matrix — defend security and role separation.