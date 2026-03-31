# Phase 2A Walkthrough — Auth + RBAC + Rate Limiting + Filters + Redis Caching

## Summary

Implemented the full Phase 2A scope across **15 new files** and **8 modified files**. Build passes cleanly.

---

## New Files Created

| File | Purpose |
|---|---|
| [user.entity.ts](file:///e:/Khaled/Nest%20JS/seatly/src/users/entities/user.entity.ts) | [User](file:///e:/Khaled/Nest%20JS/seatly/src/users/entities/user.entity.ts#15-42) entity with [Role](file:///e:/Khaled/Nest%20JS/seatly/src/common/decorators/roles.decorator.ts#5-6) enum (`ADMIN`, `ORGANIZER`, `ATTENDEE`) |
| [users.service.ts](file:///e:/Khaled/Nest%20JS/seatly/src/users/users.service.ts) | User CRUD — [findByEmail](file:///e:/Khaled/Nest%20JS/seatly/src/users/users.service.ts#15-18), [findById](file:///e:/Khaled/Nest%20JS/seatly/src/users/users.service.ts#19-26), [findAll](file:///e:/Khaled/Nest%20JS/seatly/src/users/users.controller.ts#24-27) (paginated), [remove](file:///e:/Khaled/Nest%20JS/seatly/src/events/events.service.ts#103-109), [create](file:///e:/Khaled/Nest%20JS/seatly/src/ticket-tiers/ticket-tiers.controller.ts#14-20) |
| [users.controller.ts](file:///e:/Khaled/Nest%20JS/seatly/src/users/users.controller.ts) | Admin-only endpoints: `GET /users`, `GET /users/:id`, `DELETE /users/:id` |
| [users.module.ts](file:///e:/Khaled/Nest%20JS/seatly/src/users/users.module.ts) | Module wiring |
| [register.dto.ts](file:///e:/Khaled/Nest%20JS/seatly/src/auth/dto/register.dto.ts) | Validates `email`, `name`, `password` (min 6) |
| [login.dto.ts](file:///e:/Khaled/Nest%20JS/seatly/src/auth/dto/login.dto.ts) | Validates `email`, `password` |
| [auth.service.ts](file:///e:/Khaled/Nest%20JS/seatly/src/auth/auth.service.ts) | Register, login, refresh — bcrypt hashing, dual JWT tokens |
| [jwt.strategy.ts](file:///e:/Khaled/Nest%20JS/seatly/src/auth/strategies/jwt.strategy.ts) | Passport JWT strategy — validates tokens, fetches user from DB |
| [auth.controller.ts](file:///e:/Khaled/Nest%20JS/seatly/src/auth/auth.controller.ts) | `POST /auth/register`, `POST /auth/login`, `GET /auth/me`, `POST /auth/refresh` |
| [auth.module.ts](file:///e:/Khaled/Nest%20JS/seatly/src/auth/auth.module.ts) | Imports UsersModule + Passport + JWT |
| [jwt-auth.guard.ts](file:///e:/Khaled/Nest%20JS/seatly/src/common/guards/jwt-auth.guard.ts) | Activates JWT Passport strategy |
| [roles.decorator.ts](file:///e:/Khaled/Nest%20JS/seatly/src/common/decorators/roles.decorator.ts) | `@Roles(Role.ADMIN)` metadata decorator |
| [roles.guard.ts](file:///e:/Khaled/Nest%20JS/seatly/src/common/guards/roles.guard.ts) | Reads role metadata, compares against `request.user.role` |
| [current-user.decorator.ts](file:///e:/Khaled/Nest%20JS/seatly/src/common/decorators/current-user.decorator.ts) | `@CurrentUser()` — extracts user from request |
| [login-throttler.guard.ts](file:///e:/Khaled/Nest%20JS/seatly/src/common/guards/login-throttler.guard.ts) | 5 login attempts per email per minute |

## Modified Files

| File | Changes |
|---|---|
| [.env](file:///e:/Khaled/Nest%20JS/seatly/.env) | Added JWT secrets, expiry, Redis URL |
| [app.config.ts](file:///e:/Khaled/Nest%20JS/seatly/src/config/app.config.ts) | Added `jwt` and `redis` config sections |
| [app.module.ts](file:///e:/Khaled/Nest%20JS/seatly/src/app.module.ts) | Added [AuthModule](file:///e:/Khaled/Nest%20JS/seatly/src/auth/auth.module.ts#9-20), [UsersModule](file:///e:/Khaled/Nest%20JS/seatly/src/users/users.module.ts#7-14), `ThrottlerModule`, `CacheModule` (Redis) |
| [pagination.dto.ts](file:///e:/Khaled/Nest%20JS/seatly/src/common/dto/pagination.dto.ts) | Added optional `category` and `city` filter fields |
| [events.service.ts](file:///e:/Khaled/Nest%20JS/seatly/src/events/events.service.ts) | Redis caching (5min list, 10min single), QueryBuilder filtering, cache invalidation |
| [events.controller.ts](file:///e:/Khaled/Nest%20JS/seatly/src/events/events.controller.ts) | `@UseGuards(JwtAuthGuard)` on POST, PATCH, DELETE |
| [venues.service.ts](file:///e:/Khaled/Nest%20JS/seatly/src/venues/venues.service.ts) | Redis caching (10min), cache invalidation |
| [venues.controller.ts](file:///e:/Khaled/Nest%20JS/seatly/src/venues/venues.controller.ts) | `@UseGuards(JwtAuthGuard)` on POST, PATCH, DELETE |
| [ticket-tiers.controller.ts](file:///e:/Khaled/Nest%20JS/seatly/src/ticket-tiers/ticket-tiers.controller.ts) | `@UseGuards(JwtAuthGuard)` on POST, PATCH, DELETE |

## Verification

- ✅ `npm run build` — compiles with zero errors

## Pre-requisites to Run

> [!IMPORTANT]
> You need a **Redis server** running locally on port 6379 before starting the app. Install Redis or use Docker:
> ```bash
> docker run -d -p 6379:6379 redis
> ```
