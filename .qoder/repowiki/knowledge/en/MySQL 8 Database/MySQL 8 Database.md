---
kind: external_dependency
name: MySQL 8 Database
slug: mysql
category: external_dependency
category_hints:
    - vendor_identity
scope:
    - '**'
source_files:
    - backend-api/prisma/schema.prisma
    - backend-api/docker-compose.yml
    - backend-api/.env.example
---

Relational database used by the SafeProtect backend. Prisma datasource is configured to connect to a MySQL 8 instance via the DATABASE_URL environment variable. A Docker Compose service provisions a MySQL 8 container with root password `password` and database name `safeprotect`; the app's .env.example expects the same credentials at localhost:3306.