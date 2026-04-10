# 📜 BookFlow — Project Constitution (`gemini.md`)

> **This file is LAW.** Only update when a schema changes, a rule is added, or architecture is modified.

---

## 1. Project Identity

| Key | Value |
|---|---|
| Name | **BookFlow** |
| Type | Booking & Scheduling SaaS for Service Businesses |
| Stack | NestJS 11, TypeORM, PostgreSQL (Neon), Redis, Cloudinary, Passport JWT |
| Repo | `khaalledd/Seatly` → being repurposed as BookFlow |
| Market | Egyptian service businesses (barbershops, gyms, salons, football pitches, tutors, yoga studios) |
| Revenue Model | Monthly SaaS subscription per business |

---

## 2. Domain Mapping (Seatly → BookFlow)

| Seatly Concept | BookFlow Concept | Notes |
|---|---|---|
| Venue | **Business** | Barbershop, gym, pitch, salon |
| Event | **Service** | Haircut, training session, court hour |
| TicketTier | **PricingPlan** (future) / embedded in Service for now | Peak/off-peak pricing |
| ATTENDEE role | **CUSTOMER** role | Books appointments |
| ORGANIZER role | **BUSINESS_OWNER** role | Manages their business |
| ADMIN role | **ADMIN** role | Platform admin |
| *(none)* | **Availability** | Business working hours per day |
| *(none)* | **Booking** | A customer reserving a slot |

---

## 3. Data Schemas

### 3.1 User
```jsonc
{
  "id": "uuid (PK, auto)",
  "name": "string",
  "email": "string (unique)",
  "password": "string (bcrypt hashed)",
  "phone": "string | null",
  "role": "enum: ADMIN | BUSINESS_OWNER | CUSTOMER (default: CUSTOMER)",
  "avatarUrl": "string | null",
  "createdAt": "timestamp (auto)",
  "updatedAt": "timestamp (auto)"
}
```

### 3.2 Business *(replaces Venue)*
```jsonc
{
  "id": "uuid (PK, auto)",
  "name": "string",
  "slug": "string (unique, URL-safe, auto-generated from name)",
  "description": "text | null",
  "category": "enum: BARBERSHOP | SALON | GYM | FOOTBALL_PITCH | TUTORING | YOGA_STUDIO | OTHER",
  "city": "string",
  "address": "string",
  "phone": "string",
  "logoUrl": "string | null",
  "ownerId": "uuid (FK → User, required)",
  "owner": "User (ManyToOne)",
  "services": "Service[] (OneToMany)",
  "availabilities": "Availability[] (OneToMany)",
  "createdAt": "timestamp (auto)",
  "updatedAt": "timestamp (auto)"
}
```
> Public booking page: `bookflow.com/{slug}`

### 3.3 Service *(replaces Event)*
```jsonc
{
  "id": "uuid (PK, auto)",
  "name": "string",
  "description": "text | null",
  "durationMinutes": "int (e.g. 30, 45, 60)",
  "price": "decimal(10,2)",
  "currency": "string (default: 'EGP')",
  "isActive": "boolean (default: true)",
  "coverUrl": "string | null",
  "businessId": "uuid (FK → Business, CASCADE delete)",
  "business": "Business (ManyToOne)",
  "bookings": "Booking[] (OneToMany)",
  "createdAt": "timestamp (auto)",
  "updatedAt": "timestamp (auto)"
}
```

### 3.4 Availability *(NEW)*
```jsonc
{
  "id": "uuid (PK, auto)",
  "businessId": "uuid (FK → Business, CASCADE delete)",
  "business": "Business (ManyToOne)",
  "dayOfWeek": "int (0=Sunday, 1=Monday, ..., 6=Saturday)",
  "startTime": "time (HH:mm, e.g. '09:00')",
  "endTime": "time (HH:mm, e.g. '21:00')",
  "createdAt": "timestamp (auto)",
  "updatedAt": "timestamp (auto)"
}
// UNIQUE constraint: (businessId, dayOfWeek) — one entry per day per business
```

### 3.5 Booking *(NEW)*
```jsonc
{
  "id": "uuid (PK, auto)",
  "serviceId": "uuid (FK → Service)",
  "service": "Service (ManyToOne)",
  "businessId": "uuid (FK → Business)",
  "business": "Business (ManyToOne)",
  "customerId": "uuid (FK → User)",
  "customer": "User (ManyToOne)",
  "date": "date (YYYY-MM-DD)",
  "startTime": "time (HH:mm)",
  "endTime": "time (HH:mm, auto-calculated: startTime + service.durationMinutes)",
  "status": "enum: PENDING | CONFIRMED | CANCELLED | COMPLETED (default: CONFIRMED)",
  "notes": "text | null (customer special requests)",
  "createdAt": "timestamp (auto)",
  "updatedAt": "timestamp (auto)"
}
```

---

## 4. API Endpoints (Target)

### Auth (existing, rename roles)
```
POST   /auth/register        → register as CUSTOMER or BUSINESS_OWNER
POST   /auth/login            → login
POST   /auth/refresh          → refresh token
GET    /auth/me               → current user profile
```

### Businesses (replaces Venues)
```
POST   /businesses                          → create business (BUSINESS_OWNER only)
GET    /businesses?category=gym&city=Cairo  → browse businesses (public)
GET    /businesses/:id                      → business detail (public)
GET    /businesses/slug/:slug               → business by slug (public booking page)
PATCH  /businesses/:id                      → update business (owner only)
DELETE /businesses/:id                      → delete business (owner/admin only)
```

### Services (replaces Events)
```
POST   /businesses/:businessId/services     → add service (owner only)
GET    /businesses/:businessId/services     → list services (public)
GET    /services/:id                        → service detail (public)
PATCH  /services/:id                        → update service (owner only)
DELETE /services/:id                        → delete service (owner only)
```

### Availability
```
PUT    /businesses/:businessId/availability → set/update weekly schedule (owner only)
GET    /businesses/:businessId/availability → get weekly schedule (public)
```

### Slots (computed, not stored)
```
GET    /businesses/:businessId/slots?date=2026-04-15&serviceId=xxx → available slots for a date
```

### Bookings
```
POST   /bookings                    → make a booking (CUSTOMER only)
GET    /bookings/mine               → customer's bookings (CUSTOMER)
GET    /businesses/:id/bookings     → owner sees their schedule (BUSINESS_OWNER)
PATCH  /bookings/:id/cancel         → cancel a booking (customer or owner)
PATCH  /bookings/:id/complete       → mark completed (owner only)
```

---

## 5. Behavioral Rules

### Roles & Permissions
1. **CUSTOMER** — can browse businesses/services, book slots, view/cancel own bookings.
2. **BUSINESS_OWNER** — can create/manage their own business(es), services, availability. Can view/cancel/complete bookings for their business.
3. **ADMIN** — assigned via DB only. Full platform access.
4. Registration endpoint only allows `CUSTOMER` and `BUSINESS_OWNER`.

### Booking Rules
1. **No double-booking** — Two customers cannot book overlapping slots. Enforced via DB transactions with row-level locking.
2. **Slot generation is dynamic** — computed from Availability + Service.durationMinutes minus existing bookings. Slots are NOT stored in DB.
3. **Cancellation** — Customer or business owner can cancel. No automatic refunds (out of scope for now).
4. **Booking is instant** — status defaults to `CONFIRMED` (no approval flow for v1).
5. **Past slots** — Cannot book slots in the past or for today if time has passed.

### Business Rules
1. A BUSINESS_OWNER can own multiple businesses.
2. Business slug is auto-generated from name, must be unique.
3. Business must have at least one Availability entry to accept bookings.

---

## 6. Technical Architecture (Carried Over)

- **Database:** Neon PostgreSQL via `DATABASE_URL`.
- **ORM:** TypeORM with `synchronize: true` (dev).
- **Cache:** Redis — business listings (5min), individual business (10min).
- **Auth:** JWT access (15m) + refresh (7d), bcrypt passwords.
- **Rate Limiting:** Global 10 req/60s, login 5/min/email.
- **Uploads:** Cloudinary (business logos, service photos, user avatars).
- **Validation:** Global `ValidationPipe` (whitelist, transform, forbidNonWhitelisted).
- **Interceptors:** Logging, Transform (wrap response), Performance (>500ms warn).
- **Middleware:** RequestId (UUID per request).
- **Events:** EventEmitter2 — `booking.created`, `booking.cancelled`, `user.registered`.

---

## 7. Environment Variables

| Variable | Purpose |
|---|---|
| `DATABASE_URL` | Neon PostgreSQL connection |
| `PORT` | Server port (3000) |
| `JWT_SECRET` | Access token signing |
| `JWT_REFRESH_SECRET` | Refresh token signing |
| `JWT_EXPIRY` | Access token TTL (15m) |
| `JWT_REFRESH_EXPIRY` | Refresh token TTL (7d) |
| `REDIS_URL` | Redis connection |
| `CLOUDINARY_CLOUD_NAME` | Cloudinary cloud name |
| `CLOUDINARY_CLOUD_API_KEY` | Cloudinary API key |
| `CLOUDINARY_CLOUD_API_SECRET` | Cloudinary API secret |

---

## 8. Maintenance Log

| Date | Change | Author |
|---|---|---|
| 2026-04-01 | Project pivoted from Seatly (event ticketing) to BookFlow (booking SaaS). Full schema redesign. | System Pilot |
