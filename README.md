# BookFlow 📅

BookFlow is a modern **Booking & Scheduling SaaS** backend built with NestJS, Prisma, and PostgreSQL. It is designed specifically for service-based businesses (barbershops, salons, gyms, tutors, etc.) to manage their availability and allow customers to book time slots dynamically.

---

## 🚀 Features

- **Pessimistic Double-Booking Prevention**: Uses database-level row-locking (`FOR UPDATE`) to ensure it's mathematically impossible to double-book a slot.
- **Dynamic Slot Generation**: Computes bookable slots on the fly based on business weekly schedules, service duration, timezone calculations (`Africa/Cairo`), and overlapping existing bookings.
- **Role-Based Access Control**: Strict access separation between `ADMIN`, `BUSINESS_OWNER`, and `CUSTOMER`.
- **Media Uploads**: Built-in support for Cloudinary for avatars, business logos, and service cover images.
- **Event-Driven Architecture**: Uses `@nestjs/event-emitter` to decouple side effects (like sending emails and SMS reminders) from core transaction flows.
- **Caching**: Leverages Redis for high-performance retrieval of public listings and business profiles.

---

## 🛠 Tech Stack

- **Framework**: NestJS (v11)
- **Database**: PostgreSQL (Neon)
- **ORM**: Prisma
- **Caching**: Redis (Upstash)
- **Validation**: `class-validator`, `class-transformer`
- **Authentication**: JWT Strategy via `@nestjs/passport`
- **File Storage**: Cloudinary

---

## 📦 Setup & Installation

### 1. Environment Variables
Create a `.env` file in the root directory:
```env
# Database
DATABASE_URL="postgres://..."

# Auth
JWT_SECRET="super-secret"
JWT_REFRESH_SECRET="super-refresh-secret"

# Redis Cache
REDIS_URL="redis://..."

# Cloudinary
CLOUDINARY_CLOUD_NAME="..."
CLOUDINARY_API_KEY="..."
CLOUDINARY_API_SECRET="..."
```

### 2. Install Dependencies
```bash
npm install
```

### 3. Setup Database (Prisma)
```bash
npx prisma generate
npx prisma db push
```

### 4. Start the Application
```bash
# development
npm run start:dev

# production
npm run build && npm run start:prod
```

---

## 📚 General API Documentation

Below is a quick overview of the domain endpoints. For exact payloads, please see the Postman guide (`postman_test.md`).

### Auth
- `POST /auth/register` - Register a new user (Customer or Owner).
- `POST /auth/login` - Authenticate and receive `accessToken`.

### Businesses
- `POST /businesses` - Create a business profile.
- `GET /businesses` - Browse public businesses (paginated, filterable).
- `GET /businesses/slug/:slug` - Public business landing page details.
- `PUT /businesses/:id/availability` - Upsert a business's generic weekly schedule.
- `GET /businesses/:id/dashboard` - Get business dashboard metrics (Today's count, popular services, etc).

### Services
- `POST /businesses/:businessId/services` - Add a service to a business.
- `GET /businesses/:businessId/services` - List services for a specific business.

### Slots
- `GET /businesses/:businessId/slots?date=YYYY-MM-DD&serviceId=uuid` - **(Core)** Dynamically computes active slots for the target date and limits.

### Bookings
- `POST /bookings` - Atomically lock and create a booking.
- `GET /bookings/mine` - View authenticated customer's upcoming bookings.
- `GET /businesses/:id/bookings` - View business schedule by date.
- `PATCH /bookings/:id/cancel` - Cancel a booking.
- `PATCH /bookings/:id/complete` - Mark a booking as completed.

---

## 🔒 Security

All destructive actions and business modifications require `BUSINESS_OWNER` or `ADMIN` roles. Role matching is strictly enforced via `@Roles` and `RolesGuard` on a global and controller basis.
