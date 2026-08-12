---
kind: business_term
name: Business Glossary
category: business_term
scope:
    - '**'
---

### SafeProtect Cameroon
- Definition：The project's product name — a digital child protection and Gender-Based Violence (GBV) management platform serving victims, social workers, organizations, and admins across Cameroon.
- Aliases：SafeProtect、SPC

### Case
- Definition：A protected record created from an incident report that tracks the lifecycle of a GBV/child-protection matter through states NEW → UNDER_INVESTIGATION → SUPPORT_PROVIDED → RESOLVED → CLOSED, assigned to a social worker and linked to a victim.
- Aliases：case record、protection case

### Incident
- Definition：A victim-reported event (physical abuse, sexual abuse, domestic violence, emotional abuse, neglect, or other) with optional evidence attachment, location, date, and risk level; each incident auto-generates a Case.
- Aliases：incident report、report

### Victim
- Definition：A user role representing a person seeking protection or support; owns incidents and appointments and can use SOS and secure messaging features in the mobile app.
- Aliases：victim profile、citizen

### Social Worker
- Definition：A user role responsible for investigating cases, managing appointments, and communicating with victims; viewable and manageable from the web dashboard.
- Aliases：SW、social worker profile

### Organization
- Definition：A verified or unverified entity (NGO, shelter, clinic, etc.) that publishes services and receives referrals/appointments through the platform.
- Aliases：org、service organization

### Appointment
- Definition：A scheduled meeting between a victim and either a social worker or an organization, with fields for title, date, time, type, and status (SCHEDULED, COMPLETED, CANCELLED).
- Aliases：booking、consultation

### Service
- Definition：A support offering published by an Organization (e.g., counseling, legal aid, shelter) that victims can browse and book through the mobile app.
- Aliases：support service、catalog item

### Audit Log
- Definition：An immutable record of sensitive operations performed by users, capturing action, target entity, entity ID, and details for accountability and compliance.
- Aliases：audit trail、auditlog

### Refresh Token
- Definition：A long-lived token (7 days) stored server-side alongside the User model, used to obtain new short-lived JWT access tokens without re-authentication; supports deduplication on clients.
- Aliases：refresh token、RT
