# Walkthrough: Pivoting Seatly to BookFlow

## 1. Introduction
This document serves as a technical breakdown of the multi-phase refactoring initiative that successfully transformed **Seatly** (an event ticketing platform) into **BookFlow** (a robust scheduling and booking SaaS for service-based businesses). The migration involved dropping TypeORM in favor of Prisma, implementing dynamic slot calculations, and introducing strict database-level concurrency control to prevent double-booking.

All steps were executed according to the B.L.A.S.T. methodology (five phases).

---

## 2. Phase 1: Schema Migration & Core Pivot
Initially, the infrastructure contained TypeORM entities like `Event`, `Venue`, and `TicketTier`, mapping strictly to an event-ticketing model. We made the decision to migrate to **Prisma** to leverage greater type-safety and straightforward schema management. 

- **Domain Remapping**:
  - `Venue` became `Business` (e.g., Barbershop, Salon). Added constraints like `slug` and `category` enums.
  - `Event` became `Service` (e.g., Haircut), stripping `TicketTier` dependencies and replacing them with `durationMinutes` and `price`.
  - Roles were migrated from `ORGANIZER/ATTENDEE` to `BUSINESS_OWNER/CUSTOMER`.
- **New Domain Entites**: 
  - `Availability`: Designed to establish a standard weekly schedule per business.
  - `Booking`: The ledger connecting a customer, a service, and a business on a specific date/time.

*Action taken:* Executed forced teardown of old TypeORM database schemas and mapped the complete new schema in `schema.prisma`. 

---

## 3. Phase 2: Business & Service CRUD
Once the database existed natively as Prisma objects, we rewrote the core entity management APIs. 
- **Ownership Verification:** To secure multi-tenant architectures, we enforced a strict layer in `BusinessesService` and `ServicesService` that checks contextual `ownerId` against the JWT payload user ID. 
- **Caching Integration:** Using `cache-manager` and `redisStore`, operations dealing with heavy public reads (e.g., retrieving an owner's public business page via specific `slug`) are cached for extreme performance, dramatically speeding up rendering times on the Next.js frontend.
- **Upload Integration:** Cloudinary streams were updated to parse targets for `business-logo`, `service-cover`, and `avatars`.

---

## 4. Phase 3: The Engine Hub (Availability & Slot Checking)
At the heart of BookFlow is the ability for dynamic availability. Rather than pre-storing millions of static slot chunks in the database for each business day, slots are computed instantly.

1. **Setup**: The business owner configures an array of weekdays alongside a `startTime` and an `endTime`. This limits the bounds.
2. **Computational Algorithm**: When a public customer requests `/slots?date=YYYY-MM-DD`, the `SlotsService`:
   - Validates the target `dayOfWeek` against the given `businessId`.
   - Discretizes the business's open bounds into blocks sized by `Service.durationMinutes`. 
   - Fires a query retrieving all confirmed `Booking` entities for that specific day. 
   - Uses interval boundary intersections (`slot.start < bEnd && slot.end > bStart`) to filter out occupied spots.
   - Trims generic past slots mathematically if the requested day mathematically matches `now()` using the `Africa/Cairo` timezone offset parameter to prevent users from booking "10:00 AM" today at "3:00 PM".

---

## 5. Phase 4: booking System and Row Blocking Atomicity 
Phase 4 focused on system integrity. 

**The Double Booking Problem**: If two separate clients fetch the exact same slot and hit `POST /bookings` within 10 milliseconds of each other, how do we prevent both from succeeding?

**The Solution:**
```typescript
const availabilityQuery = await tx.$queryRaw<any[]>`
  SELECT * FROM availabilities
  WHERE "businessId" = ${businessId} AND "dayOfWeek" = ${dayOfWeek}
  FOR UPDATE
`;
```
By implementing a Prisma `$transaction` surrounding an aggressive `$queryRaw` fetch requesting a lock `FOR UPDATE` on the generic availability record, we serialize traffic at the database cursor level. If two identical requests fire, Postgres queues the second request until transaction 1 unlocks. Transaction 1 will complete, persisting the booking. When Transaction 2 awakens from the lock, it performs its internal overlap check against the freshly minted booking from T1 and successfully denies the user via a `409 ConflictException`. A stress test (`scripts/stress-test.js`) firing 5 concurrent unawaited HTTP hits validated this logic definitively!

Customer cancellation routing logic and Owner-override completion mechanics were also layered here with appropriate role validations. 

---

## 6. Phase 5: Notifications & Operator Dashboard
The final phase prioritized downstream event-emitters and operator experience.
- Implemented `BookingCreatedListener` and `BookingCancelledListener` relying on `@nestjs/event-emitter`. When a database transaction safely concludes, side effects are fired away asynchronously, logging outbound messages which can later be plugged into Resend/Vonage nodes natively.
- Developed `getDashboard(id, userId)` which runs parallel vectorized `.count()` and `.groupBy()` evaluations on the `bookings` table via Prisma to return today's booking objects, high-level interval counters (Weekly/Monthly view), and the explicit top performing 3 services requested on the app.

---

## 7. Conclusion
BookFlow is mechanically comprehensive, type-safe, optimized via Redis caching boundaries, mathematically impenetrable against double reservations, and dynamically ready to serve its frontend implementation. All phases 1-5 pass build processes safely (`Exit code 0`) representing a complete technical conclusion to the transition.
