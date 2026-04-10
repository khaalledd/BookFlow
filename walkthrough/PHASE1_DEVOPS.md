# Phase 1 DevOps: Containerization for BookFlow

This document explains **everything added in Phase 1** (without restructuring/refactoring the project layout) to support a complete local containerized lifecycle.

---

## Goals of Phase 1

Implement containerization and local orchestration for the current repository structure:

- Backend at repository root
- Frontend under `frontend/`

We added:

- Backend multi-stage Docker image
- Frontend multi-stage Docker image
- Local orchestration with Docker Compose
- Production override Compose file
- Docker-specific environment example
- Build context hygiene via `.dockerignore`
- Healthchecks and dependency gating

---

## What was added

### 1) `Dockerfile.backend`

Path: `Dockerfile.backend`

Purpose:

- Build NestJS backend in a builder stage
- Produce a runtime image that starts the app and runs database migrations

How it works:

1. **Builder stage**
   - Uses `node:20-alpine`
   - Installs backend dependencies from root `package*.json`
   - Copies Prisma schema folder
   - Runs `npx prisma generate`
   - Runs `npm run build` (outputs to `dist3` in this project)

2. **Production stage**
   - Copies only needed runtime artifacts (`dist3`, `node_modules`, `prisma`, package files)
   - Exposes port `3000`
   - Startup command:

```bash
if [ -d prisma/migrations ] && [ "$(ls -A prisma/migrations 2>/dev/null)" ]; then
  npx prisma migrate deploy
else
  npx prisma db push
fi
node dist3/src/main.js
```

Why this is good:

- Keeps image reasonably small by separating build/runtime concerns
- Ensures Prisma client and schema are ready at container startup
- Handles both migration strategies:
  - if migrations exist: `migrate deploy`
  - if migrations do not exist yet: `db push`

---

### 2) `frontend/Dockerfile`

Path: `frontend/Dockerfile`

Purpose:

- Build Next.js frontend in a builder stage
- Run Next production server on port `3001`

How it works:

1. **deps stage**
   - Installs frontend dependencies (`npm ci`)

2. **builder stage**
   - Accepts `NEXT_PUBLIC_API_URL` as build arg
   - Builds app with `npm run build`

3. **production stage**
   - Copies `.next`, `public`, `node_modules`, package files, and `next.config.mjs`
   - Exposes port `3001`
   - Starts via `npm run start`

Why this is good:

- Builds production assets once
- Keeps runtime image focused on serving compiled Next app

---

### 3) `docker-compose.yml`

Path: `docker-compose.yml`

Services included:

- `postgres` (PostgreSQL 16)
- `redis` (Redis 7)
- `backend` (NestJS)
- `frontend` (Next.js)

Key features:

1. **Profiles**
   - `backend`: runs backend + db + redis
   - `full`: runs everything

2. **Container networking**
   - Backend uses service names inside network:
     - DB host: `postgres` via `DOCKER_DATABASE_URL`
     - Redis host: `redis` via `DOCKER_REDIS_URL`

3. **Dependency gating with health checks**
   - Backend waits for healthy Postgres + Redis
   - Frontend waits for healthy backend

4. **Environment injection at runtime**
   - No secrets baked into images
   - Values loaded from shell or `.env` file

5. **Health checks**
   - `postgres`: `pg_isready`
   - `redis`: `redis-cli ping`
   - `backend`: Node-based HTTP check against `/`
   - `frontend`: Node-based HTTP check against `/`

6. **Persistent DB volume**
   - `postgres_data` stores PostgreSQL data

---

### 4) `docker-compose.prod.yml`

Path: `docker-compose.prod.yml`

Purpose:

- Production-style overrides layered on top of base compose

What it changes:

- Sets `restart: always`
- Hides direct host ports for infra services (`postgres`, `redis`)
- Forces production runtime env behavior for app services

Use with:

```bash
docker compose -f docker-compose.yml -f docker-compose.prod.yml --profile full up -d
```

---

### 5) `.dockerignore`

Path: `.dockerignore`

Purpose:

- Keep Docker build context clean and fast
- Exclude local artifacts and sensitive files

Examples excluded:

- `node_modules`, `frontend/node_modules`
- build artifacts (`dist*`, `frontend/.next`)
- editor/OS junk
- local `.env*` files (except examples)

---

### 6) `.env.docker.example`

Path: `.env.docker.example`

Purpose:

- Provide a ready template for all required compose variables
- Document backend/frontend/runtime settings in one place

Includes:

- Postgres credentials
- DB/Redis URLs for container network
- JWT settings
- Cloudinary placeholders
- `NEXT_PUBLIC_API_URL`

---

## Why this setup fits your current project (no restructure)

You explicitly asked for no restructure/refactor.

So we:

- Kept backend Dockerfile at repo root (`Dockerfile.backend`)
- Kept frontend Dockerfile inside existing `frontend/`
- Kept current scripts and outputs (`dist3/src/main.js`)
- Did not move code into `apps/` or change package architecture

---

## How to run

## 1) Prepare environment

Create a Docker env file from the example:

```bash
cp .env.docker.example .env
```

Then edit `.env` values (especially JWT + Cloudinary if using uploads).

Important for this repository:

- existing local `.env` may contain host-based URLs for non-container runs.
- container runs should use the Docker-specific variables:

```env
DOCKER_DATABASE_URL=postgresql://bookflow:bookflow@postgres:5432/bookflow?schema=public
DOCKER_REDIS_URL=redis://redis:6379
```

This ensures backend containers always connect to internal Compose services.

## 2) Run backend stack only

```bash
docker compose --profile backend up --build
```

This starts:

- postgres
- redis
- backend

## 3) Run full stack

```bash
docker compose --profile full up --build
```

This starts:

- postgres
- redis
- backend
- frontend

## 4) Run in detached mode

```bash
docker compose --profile full up -d --build
```

## 5) Stop and cleanup

```bash
docker compose down
```

To remove DB volume too:

```bash
docker compose down -v
```

---

## Health + verification checklist

After startup:

1. Backend health:
   - `http://localhost:3000/`

2. Frontend health:
   - `http://localhost:3001/`

3. Database reachable:
   - backend logs should show Prisma connected

4. Redis reachable:
   - backend cache module initializes without connection errors

5. Public flow check:
   - browse businesses on homepage
   - open `/b/[slug]`
   - attempt booking flow

6. Owner flow check:
   - login
   - dashboard/business/services/availability/bookings pages load

### Healthcheck implementation note

For app containers we used Node one-liner checks instead of `curl/wget` so health checks do not depend on extra OS packages inside minimal alpine images.

---

## Design choices explained

## Why run migrations at backend startup?

Containers run a migration-or-push fallback at startup:

- `prisma migrate deploy` when migration files exist
- `prisma db push` when migrations are not present yet

This prevents startup failures on fresh databases where tables do not exist.

## Why `NEXT_PUBLIC_API_URL` defaults to `http://localhost:3000`?

Your users access frontend from browser on host machine. Browser should call backend host port mapping, not internal container DNS. Hence localhost is correct for local setup.

## Why both compose files?

- `docker-compose.yml`: base local/dev and common settings
- `docker-compose.prod.yml`: production-focused overrides without duplicating everything

## Why profiles?

You can run only what you need:

- backend development/testing only
- full app when needed

---

## Known notes for this repo

1. Backend output currently uses `dist3/src/main.js` (consistent with current scripts).
2. Cloudinary upload endpoints require valid Cloudinary credentials.
3. If local Node processes are already bound to ports 3000/3001/5432/6379, stop them before compose run.
4. If you previously saw Prisma error `P2021` (`public.users` does not exist), this fallback now addresses it automatically on container startup.

---

## Next (Phase 2 preview)

After this phase, the natural next step is CI/CD:

- GitHub Actions for lint/test/build
- Build + push Docker images to registry
- Deploy workflow per environment
- Optional image scanning and SBOM generation
