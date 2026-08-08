# ðŸ›¡ï¸ SafeProtect Cameroon

**Child Protection & Gender-Based Violence (GBV) Management Platform**

A secure digital ecosystem that helps protect children, support GBV victims, connect victims with assistance services, and allow social workers and organizations to manage protection cases efficiently.

---

## ðŸ—ï¸ Architecture

```
SafeProtect/
â”œâ”€â”€ backend-api/          # Express.js + Prisma + TypeScript API
â”œâ”€â”€ web-dashboard/        # Next.js 14 Admin Dashboard
â”œâ”€â”€ mobile-app/           # React Native + Expo Mobile App
â”œâ”€â”€ package.json          # Root workspace
â””â”€â”€ README.md
```

## ðŸš€ Quick Start

### Prerequisites

- **Node.js** 18+ ([download](https://nodejs.org))
- **MySQL 8** (or Docker)
- **Expo Go** app on your phone (for mobile testing)

---

### 1. Backend API

```bash
# Navigate to backend
cd backend-api

# Install dependencies
npm install

# Copy environment file and edit with your MySQL credentials
cp .env.example .env

# Start MySQL with Docker (or use your own MySQL server)
docker-compose up -d

# Generate Prisma client
npx prisma generate

# Run database migrations
npx prisma db push

# Seed the database with demo data
npx prisma db seed

# Start the development server
npm run dev
```

The API will be running at **http://localhost:5000**

#### Demo Credentials
| Role | Email | Password |
|------|-------|----------|
| Admin | admin@safeprotect.cm | Admin@123 |
| Social Worker | aline.ndey@safeprotect.cm | Worker@123 |
| Social Worker | eric.tchana@safeprotect.cm | Worker@123 |
| Victim | marie.dupont@email.cm | Victim@123 |

---

### 2. Web Dashboard

```bash
# Navigate to web dashboard
cd web-dashboard

# Install dependencies
npm install

# Start the development server
npm run dev
```

The dashboard will be running at **http://localhost:3000**

Login with the admin credentials above.

---

### 3. Mobile App

```bash
# Navigate to mobile app
cd mobile-app

# Install dependencies
npm install

# Start Expo development server
npx expo start
```

Scan the QR code with **Expo Go** on your phone.

---

## API configuration

The mobile and web clients read their API base URL from environment variables instead of a hard-coded address.

- Copy `mobile-app/.env.example` to `mobile-app/.env` and set `EXPO_PUBLIC_API_URL`. Use `http://10.0.2.2:5000/api` for an Android emulator, or your computer's LAN IP (for example `http://192.168.1.10:5000/api`) for a physical phone.
- Copy `web-dashboard/.env.example` to `web-dashboard/.env.local` and set `NEXT_PUBLIC_API_URL`. The local default is `http://localhost:5000/api`.

Restart Expo or Next.js after changing either value.

---
## ðŸ“± User Roles

| Role | Platform | Access |
|------|----------|--------|
| **Victim/Citizen** | Mobile App | Report incidents, track cases, SOS, find services |
| **Social Worker** | Mobile App | Manage assigned cases, appointments, communicate |
| **Admin** | Web Dashboard | Full system management, analytics, user management |
| **Organization** | Web Dashboard | Manage services, receive referrals, appointments |

---

## ðŸ”‘ API Endpoints

| Module | Base Route | Description |
|--------|-----------|-------------|
| Auth | `/api/auth` | Register, Login, Refresh Token, Forgot Password |
| Users | `/api/users` | User management (ADMIN) |
| Victims | `/api/victims` | Victim profiles |
| Social Workers | `/api/social-workers` | Worker management |
| Organizations | `/api/organizations` | Organization directory |
| Incidents | `/api/incidents` | Incident reporting & management |
| Cases | `/api/cases` | Case lifecycle management |
| Appointments | `/api/appointments` | Booking & scheduling |
| Services | `/api/services` | Support service catalog |
| Messages | `/api/messages` | Secure messaging |
| Notifications | `/api/notifications` | Push notifications |
| Analytics | `/api/analytics` | Dashboard statistics |

---

## ðŸŽ¨ Design System

| Token | Value | Usage |
|-------|-------|-------|
| Primary | `#5B3FD3` | Buttons, links, active states |
| Secondary | `#8B6FF7` | Hover, secondary elements |
| Sidebar | `#2D1B69` | Dashboard sidebar background |
| Background | `#F5F6FB` | Page backgrounds |
| Emergency | `#FF4B5C` | SOS button, urgent alerts |
| Success | `#22C55E` | Resolved status, confirmations |
| Warning | `#F59E0B` | Pending status, cautions |
| Font | Inter | All text |

---

## ðŸ”’ Security

- âœ… bcrypt password hashing (12 salt rounds)
- âœ… JWT access tokens (15 min) + refresh tokens (7 days)
- âœ… Role-based access control (RBAC) on all routes
- âœ… Input validation with Zod
- âœ… Helmet security headers
- âœ… CORS configuration
- âœ… Rate limiting (100 req/15 min, 5 req/15 min on auth)
- âœ… Secure file upload validation
- âœ… Audit logging for sensitive operations
- âœ… Victim data privacy protection

---

## ðŸ—„ï¸ Database Schema

```
User â”€â”€â†’ Victim (1:1)
User â”€â”€â†’ SocialWorker (1:1)  
User â”€â”€â†’ Organization (1:1)
Victim â”€â”€â†’ Incident (1:many)
Incident â”€â”€â†’ Case (1:1)
Case â”€â”€â†’ SocialWorker (many:1)
Victim â”€â”€â†’ Appointment (1:many)
Organization â”€â”€â†’ Service (1:many)
User â”€â”€â†’ Message (sender/receiver)
User â”€â”€â†’ Notification (1:many)
User â”€â”€â†’ AuditLog (1:many)
```

---

## ðŸ“Š Case Workflow

```
Report Incident â†’ Case Created (NEW)
    â†’ Assigned to Social Worker (UNDER_INVESTIGATION)
    â†’ Support Services Connected (SUPPORT_PROVIDED)
    â†’ Case Resolved (RESOLVED)
    â†’ Case Archived (CLOSED)
```

**Case ID Format:** `SPC-2026-00001`

---

## ðŸ› ï¸ Tech Stack

| Layer | Technology |
|-------|-----------|
| Mobile | React Native, Expo, TypeScript, NativeWind |
| Web | Next.js 14, TypeScript, Tailwind CSS, Shadcn UI, Recharts |
| Backend | Node.js, Express.js, TypeScript |
| Database | MySQL 8, Prisma ORM |
| Auth | JWT, bcrypt |
| Icons | Lucide React (web), Expo Vector Icons (mobile) |

---

## ðŸ“„ License

This project is built for social impact. All rights reserved.

**SafeProtect Cameroon** â€” *Protecting those who need it most.*
