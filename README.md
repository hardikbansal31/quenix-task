# Task Manager App (Full-Stack)

## Quick Start (Docker Compose)

The most efficient way to run this project is via Docker:

1. Ensure Docker Desktop is running.
2. In the root directory, run:
   ```bash
   docker-compose up --build
   ```
3. Access the app at `http://localhost:3000`.

## Local Development (Manual) 

### Backend

1. `cd backend && npm install`
2. Configure `.env` with `MONGODB_URI` and `JWT_SECRET`.
3. `npm run start:dev` (Starts on port 3001).

### Frontend

1. `cd frontend && npm install`
2. Configure `.env.local` with `NEXT_PUBLIC_API_URL=http://localhost:3001`.
3. `npm run dev` (Starts on port 3000).

## Seeding & Test Credentials

The database auto-seeds on first launch with:

- **Admin:** `admin@test.com` / `Password123!`
- **Members:** `member1@test.com`, `member2@test.com` / `Password123!`
