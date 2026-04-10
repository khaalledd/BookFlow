# 📋 BookFlow — Task Plan

> Phases, goals, and checklists. Updated after each phase.

---

## Project Vision
**Booking & Scheduling SaaS** for Egyptian service businesses. Monthly recurring revenue.
Business owners register → set up profile → add services → define hours → get a public link → customers book instantly.

---

## Phase Overview

| Phase | Name | Scope | Status |
|---|---|---|---|
| 0 | **Inherited Foundation** | Auth, JWT, RBAC, Redis, Cloudinary, Interceptors, Middleware | ✅ From Seatly |
| 1 | **Schema Migration** | Rename entities, update roles, create new modules | ⏳ Next |
| 2 | **Business & Service CRUD** | Full CRUD for businesses and services with ownership | 🔲 Queued |
| 3 | **Availability & Slot Generation** | Weekly schedule + dynamic slot computation | 🔲 Queued |
| 4 | **Booking System** | Create/cancel/complete bookings + double-booking prevention | 🔲 Queued |
| 5 | **Notifications & Polish** | Event-driven booking notifications, dashboard endpoints | 🔲 Queued |

---

## Phase 1: Schema Migration

**Goal:** Transform Seatly's domain models into BookFlow's domain. After this phase, the app compiles cleanly with the new entity structure.

### Checklist
- [x] **1.1** Update `User` entity — rename roles: `ORGANIZER` → `BUSINESS_OWNER`, `ATTENDEE` → `CUSTOMER`. Add `phone` column.
- [x] **1.2** Rename `Venue` → `Business` entity — add `slug`, `description`, `phone`, `logoUrl`, `category` enum (BARBERSHOP, SALON, GYM, FOOTBALL_PITCH, TUTORING, YOGA_STUDIO, OTHER), `ownerId` FK to User.
- [x] **1.3** Rename `Event` → `Service` entity — replace with `name`, `description`, `durationMinutes`, `price`, `currency`, `isActive`, `coverUrl`, `businessId` FK.
- [x] **1.4** Delete `TicketTier` entity and module entirely (replaced by pricing within Service for v1).
- [x] **1.5** Create `Availability` entity — `businessId`, `dayOfWeek`, `startTime`, `endTime`, unique constraint on `(businessId, dayOfWeek)`.
- [x] **1.6** Create `Booking` entity — `serviceId`, `businessId`, `customerId`, `date`, `startTime`, `endTime`, `status` enum, `notes`.
- [x] **1.7** Update `auth` DTOs and service — reflect new role names in register DTO.
- [x] **1.8** Update `app.module.ts` — remove old modules, wire new ones.
- [x] **1.9** Update all event listeners — rename from Seatly events to BookFlow events.
- [x] **1.10** Verify `npm run build` passes cleanly.

---

## Phase 2: Business & Service CRUD

**Goal:** Business owners can create/manage their business profile and services. Public users can browse.

### Checklist
- [x] **2.1** `BusinessesController` — `POST /businesses`, `GET /businesses`, `GET /businesses/:id`, `GET /businesses/slug/:slug`, `PATCH /businesses/:id`, `DELETE /businesses/:id`.
- [x] **2.2** `BusinessesService` — ownership enforcement (only owner can update/delete their business), auto-generate slug from name, Redis caching on list/detail.
- [x] **2.3** Business DTOs — `CreateBusinessDto`, `UpdateBusinessDto` with full validation.
- [x] **2.4** `ServicesController` — nested under businesses: `POST /businesses/:businessId/services`, `GET /businesses/:businessId/services`, `GET /services/:id`, `PATCH /services/:id`, `DELETE /services/:id`.
- [x] **2.5** `ServicesService` — ownership check (only business owner can manage), active/inactive toggle.
- [x] **2.6** Service DTOs — `CreateServiceDto`, `UpdateServiceDto`.
- [x] **2.7** Upload endpoints — update for business logo + service cover photos.
- [x] **2.8** Verify all endpoints with `npm run build`.

---

## Phase 3: Availability & Slot Generation

**Goal:** Business owners define their weekly working hours. The system dynamically generates bookable time slots.

### Checklist
- [x] **3.1** `AvailabilityController` — `PUT /businesses/:businessId/availability` (bulk set weekly schedule), `GET /businesses/:businessId/availability`.
- [x] **3.2** `AvailabilityService` — upsert logic for weekly schedule.
- [x] **3.3** `SlotsController` — `GET /businesses/:businessId/slots?date=YYYY-MM-DD&serviceId=xxx`.
- [x] **3.4** `SlotsService` — **THE CORE ALGORITHM:**
  1. Get the `dayOfWeek` from the requested date.
  2. Look up the business's `Availability` for that day.
  3. Get the service's `durationMinutes`.
  4. Generate all possible start times from `availability.startTime` to `availability.endTime - durationMinutes` in `durationMinutes`-sized steps.
  5. Fetch all existing `Booking` records for that business on that date.
  6. Subtract occupied slots.
  7. If date is today, also remove past time slots.
  8. Return available slots.
- [x] **3.5** Verify slot generation with edge cases (no availability, fully booked day, today's past slots).

---

## Phase 4: Booking System

**Goal:** Customers can book available slots. Double-booking is impossible.

### Checklist
- [x] **4.1** `BookingsController` — `POST /bookings`, `GET /bookings/mine`, `GET /businesses/:id/bookings`, `PATCH /bookings/:id/cancel`, `PATCH /bookings/:id/complete`.
- [x] **4.2** `BookingsService` — booking creation flow:
  1. Validate the service exists and is active.
  2. Validate the slot is within the business's availability for that day.
  3. **DB Transaction + Row Lock:** Check no overlapping booking exists → insert atomically.
  4. Auto-calculate `endTime` from `startTime + service.durationMinutes`.
  5. Emit `booking.created` event.
- [x] **4.3** Cancellation logic — customer or owner can cancel, emit `booking.cancelled`.
- [x] **4.4** Completion logic — owner marks booking as completed after service is rendered.
- [x] **4.5** `GET /bookings/mine` — paginated list of customer's bookings with service/business details.
- [x] **4.6** `GET /businesses/:id/bookings` — paginated schedule for owner, filterable by date range.
- [x] **4.7** Double-booking stress test scenario documented.

---

## Phase 5: Notifications & Polish

**Goal:** Real-time notifications on booking events. Dashboard-ready endpoints.

### Checklist
- [x] **5.1** Update event listeners: `booking.created` → log (simulate SMS/email to both customer and business owner).
- [x] **5.2** Update event listeners: `booking.cancelled` → log notification.
- [x] **5.3** Dashboard summary endpoint: `GET /businesses/:id/dashboard` — today's bookings, total bookings this week/month, popular services.
- [x] **5.4** Final `npm run build` verification.
- [x] **5.5** Update README.md with BookFlow API documentation.
- [x] **5.6** Write walkthrough for all phases.

---

## Success Criteria
1. A business owner can register, create a business, add services, set weekly hours.
2. A customer can browse businesses, pick a service, see available slots for a date, and book instantly.
3. Two customers cannot book the same slot (DB transaction guarantee).
4. Both parties get notified (event emitter, ready to plug in real SMS/email).
5. `npm run build` passes with zero errors at every phase.
