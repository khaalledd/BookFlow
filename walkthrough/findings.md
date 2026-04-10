# 🔍 BookFlow — Findings Log

> Discoveries, constraints, edge cases, and research notes.

---

## 2026-04-01 — Project Pivot Analysis: Seatly → BookFlow

### What Can Be Reused Directly
| Component | Reuse Level | Notes |
|---|---|---|
| JWT Auth (register/login/refresh/me) | ✅ 95% | Just rename role enum values |
| JWT Strategy + Guards | ✅ 100% | No changes needed |
| RolesGuard + @Roles decorator | ✅ 100% | Just use new role names |
| @CurrentUser decorator | ✅ 100% | No changes |
| Redis Cache setup (app.module) | ✅ 100% | Same config |
| Cloudinary upload logic | ✅ 90% | Change target entities |
| Global interceptors (Logging, Transform, Performance) | ✅ 100% | No changes |
| HttpExceptionFilter | ✅ 100% | No changes |
| RequestIdMiddleware | ✅ 100% | No changes |
| PaginationDto + PaginatedResult | ✅ 90% | Update filter fields |
| ThrottlerModule | ✅ 100% | No changes |
| EventEmitter2 setup | ✅ 100% | Just change event names |
| Database module + config | ✅ 100% | Same Neon connection |

### What Needs Renaming
| Seatly | BookFlow | Change Level |
|---|---|---|
| `Venue` entity | `Business` entity | 🔄 Major rework — different fields |
| `Event` entity | `Service` entity | 🔄 Major rework — completely different shape |
| `TicketTier` entity | *(deleted)* | 🗑️ Remove entirely |
| `Role.ORGANIZER` | `Role.BUSINESS_OWNER` | ✏️ Simple rename |
| `Role.ATTENDEE` | `Role.CUSTOMER` | ✏️ Simple rename |
| `VenuesModule` | `BusinessesModule` | 🔄 New module |
| `EventsModule` | `ServicesModule` | 🔄 New module |
| `TicketTiersModule` | *(deleted)* | 🗑️ Remove |

### What's Brand New
| Component | Complexity | Notes |
|---|---|---|
| `Availability` entity + module | 🟢 Low | Simple CRUD with unique constraint |
| `Booking` entity + module | 🟡 Medium | CRUD + status management |
| Slot generation algorithm | 🔴 High | Dynamic computation from availability - existing bookings |
| Double-booking prevention | 🔴 High | DB transactions with row-level locking |
| Business ownership enforcement | 🟡 Medium | Owner can only manage their own businesses |
| Slug generation | 🟢 Low | Auto-generate URL-safe slug from business name |

### Key Technical Decision: Slot Generation
Slots are **computed, not stored**. This means:
- ✅ No stale data — always reflects current availability and bookings
- ✅ No migration needed when business changes hours
- ✅ Simpler data model
- ⚠️ Requires efficient query to fetch existing bookings for a given date
- ⚠️ Must handle timezone correctly (Egyptian timezone: UTC+2)

### Key Technical Decision: Double-Booking Prevention
Use TypeORM's `QueryRunner` for database transactions:
```typescript
// Pseudocode for atomic booking
const queryRunner = dataSource.createQueryRunner();
await queryRunner.startTransaction();
try {
  // Check for overlapping bookings with FOR UPDATE lock
  const overlap = await queryRunner.manager
    .createQueryBuilder(Booking, 'b')
    .where('b.businessId = :businessId AND b.date = :date')
    .andWhere('b.startTime < :endTime AND b.endTime > :startTime')
    .andWhere('b.status != :cancelled', { cancelled: 'CANCELLED' })
    .setLock('pessimistic_write')
    .getOne();
  
  if (overlap) throw new ConflictException('Slot already booked');
  
  // Insert booking
  await queryRunner.manager.save(booking);
  await queryRunner.commitTransaction();
} catch (err) {
  await queryRunner.rollbackTransaction();
  throw err;
}
```

### Edge Cases to Handle
1. **Booking at day boundary** — Service that would extend past closing time
2. **Same-day booking** — Remove past time slots
3. **Cancelled bookings** — Should free up the slot again
4. **Business with no availability** — Return empty slots, not an error
5. **Concurrent requests** — The pessimistic lock handles this
6. **Slug collision** — Append random suffix if slug already exists
