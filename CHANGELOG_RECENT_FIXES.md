# Recent Fixes and Change Breakdown

This document explains the recent commits, what changed in each file, and why.

## 1) `fix(bookings): allow authenticated booking access and enrich booking ownership data`

### Files
- `src/bookings/bookings.controller.ts`
- `src/bookings/bookings.service.ts`

### What changed
- Removed `@Roles(Role.CUSTOMER)` restriction from:
  - `POST /bookings`
  - `GET /bookings/mine`
- Kept `JwtAuthGuard` so routes remain authenticated.
- Updated `getMine()` query to include:
  - bookings tied to `customerId`
  - bookings made as guest with matching `guestEmail`
- Updated business bookings payload to include `customer.email`.

### Why
- Business owners were seeing `Insufficient permissions` in some authenticated booking scenarios.
- Customers who booked through guest/public flow could miss bookings in profile.
- Dashboard booking row needed customer email when available.


## 2) `fix(frontend-booking): stabilize auth-aware booking submission and improve error handling`

### File
- `frontend/src/app/book/[slug]/page.tsx`

### What changed
- Added hydration guard before submit to avoid auth-state race.
- Prefilled guest phone from authenticated user profile.
- Routed authenticated customer bookings through `/bookings`.
- Kept guest/owner-safe path through `/bookings/public`.
- Normalized API error messages to support array/string responses.
- Fixed total due display to show selected service price.

### Why
- Prevent flaky behavior while auth state is still hydrating.
- Ensure profile-linked bookings for customer accounts.
- Improve error clarity in booking wizard.


## 3) `fix(profile): correctly parse paginated bookings response`

### File
- `frontend/src/app/profile/page.tsx`

### What changed
- Updated bookings fetch parsing to support paginated response shape:
  - reads `payload.data` when API returns paginated object
  - falls back to raw array if returned directly

### Why
- Profile page was showing "Your calendar is clear" even after booking because it parsed the wrong response shape.


## 4) `feat(profile): add avatar upload controls and profile edit access`

### File
- `frontend/src/app/profile/page.tsx`

### What changed
- Added avatar upload state and hidden file input with overlay action button.
- Added upload handler to call `POST /uploads/avatar`.
- On success, updates local auth user state with new `avatarUrl`.
- Added owner-focused profile actions (dashboard + edit profile access).

### Why
- Avatar changes were not manageable directly from profile UX.
- Improves profile maintenance flow and immediate visual feedback.


## 5) `fix(cache): use versioned invalidation for businesses list cache`

### File
- `src/businesses/businesses.service.ts`

### What changed
- Replaced key-scan invalidation (`store.keys('businesses:list:*')`) with versioned cache keys.
- Added list version key: `businesses:list:version`.
- `findAll()` now caches by versioned key:
  - `businesses:list:v{version}:{page}:{limit}:{category}:{city}`
- Mutation paths bump list cache version:
  - `create`
  - `update`
  - `remove`
  - `updateLogoUrl`

### Why
- Explore list stayed stale after business edits because Redis key scanning is unreliable with some cache adapters.
- Versioning guarantees fresh list reads immediately after mutations.


## 6) `chore(types): align dashboard bookings customer fields with guest-safe payload`

### File
- `frontend/src/app/dashboard/bookings/page.tsx`

### What changed
- Made `customer` optional in booking type.
- Made `customer.email` optional.

### Why
- Guest bookings can legitimately have no `customer` object.
- Prevents type mismatch and keeps UI fallback (`guestEmail`) valid.
