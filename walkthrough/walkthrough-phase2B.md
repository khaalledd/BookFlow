# Phase 2B Walkthrough — File Uploads + Cloudinary → Event-Driven → Logging + Interceptors + Middleware + Performance

## Summary

Implemented the Phase 2B scope extending the application with image upload functionality, event-driven architecture, and global enhancements to observability and request lifecycle. Build passes cleanly.

---

## New Files Created

| File | Purpose |
|---|---|
| `http-exception.filter.ts` | Global Exception Filter to unify error responses into a consistent JSON payload |
| `request-id.middleware.ts` | Middleware to attach a unique `uuid` ID to each request (`req['id']` and `x-request-id` header) |
| `logging.interceptor.ts` | Global Interceptor logging every HTTP request method, URL, status code, duration, and Request ID |
| `transform.interceptor.ts` | Global Interceptor to wrap all success responses in a `{ data, statusCode, timestamp }` object |
| `performance.interceptor.ts` | Global Interceptor alerting (warn log) if a request duration exceeds 500ms |
| `uploads.module.ts`, `uploads.service.ts`, `uploads.controller.ts` | Handles file uploads using Multer in-memory buffer, delegates upload explicitly to Cloudinary `upload_stream`, then updates specific domain records |
| `notifications.module.ts` | Centralized location for loosely-coupled event listener registration |
| `user-registered.listener.ts` | Receives `user.registered` event and triggers logs simulating welcome emails |
| `event-published.listener.ts` | Receives `event.published` event and triggers logs simulating notifying attendees |
| `upload-completed.listener.ts` | Receives `upload.completed` event and tracks upload completion statuses visually |

## Modified Files

| File | Changes |
|---|---|
| `user.entity.ts` | Appended `avatarUrl` column via TypeORM |
| `event.entity.ts` | Appended `coverUrl` column via TypeORM |
| `.env` / `app.config.ts` | Mapped Cloudinary connection credentials globally for Dependency Injection |
| `app.module.ts` | Injected `EventEmitterModule.forRoot()` enabling decoupled observers. Registered `RequestIdMiddleware` using `NestModule`. Added `APP_FILTER` and 3 `APP_INTERCEPTOR` global providers |
| `auth.service.ts` | Registered `EventEmitter2` via DI and emitted `user.registered` upon a successful register routine completion |
| `events.service.ts` | Merged Cloudinary `updateCoverUrl` persistence logic resetting local Redis caches; added the `event.published` event emitter specifically after persisting EventStatus transitions |
| `users.service.ts` | Hooked the simple `updateAvatarUrl` method allowing immediate database persistence |

## Event Emitter Lifecycle

- **Upload Integration:** Whenever a user executes `POST /uploads/avatar` or `POST /uploads/event-cover`, it pipes smoothly to `Cloudinary`, returning a persistent `secure_url`. Right after TypeORM persistence finishes, it dispatches an asynchronous `upload.completed` event captured globally by `UploadCompletedListener`. 
- **User Activity:** Signups emit `user.registered`.
- **Event Workflow:** Changes in event status into the `PUBLISHED` state sequentially broadcast `event.published`.
 
## Verification

- ✅ Clean compilation lifecycle checking all types. All Nest decorators are properly verified. 
- All Interceptors and Middleware behave as globally provisioned across all routes natively handling the `uuid` assignments appropriately.
