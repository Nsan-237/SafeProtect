---
kind: external_dependency
name: Prisma ORM (MySQL)
slug: prisma
category: external_dependency
category_hints:
    - vendor_identity
scope:
    - '**'
source_files:
    - backend-api/package.json
    - backend-api/prisma/schema.prisma
    - backend-api/src/config/database.ts
---

TypeScript-first ORM used as the data access layer for the backend API. The schema in prisma/schema.prisma defines all domain models (User, Victim, SocialWorker, Organization, Incident, Case, Appointment, Service, Message, Notification, AuditLog, RefreshToken) against a MySQL datasource. The client is instantiated once in src/config/database.ts and consumed by controllers.