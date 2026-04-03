# Finance Data Processing and Access Control Backend

Clean, role-based backend for a finance dashboard system.

## Tech Stack

- Node.js
- TypeScript
- Express.js
- MongoDB + Mongoose
- Zod for validation
- JWT for auth

## Roles and Access

- VIEWER: Read own records and dashboard analytics
- ANALYST: Create, update, and delete own records; access own dashboard analytics
- ADMIN: Full user and record management across all records

## Project Structure

```txt
src/
  app.ts
  server.ts
  seed.ts
  config/
  constants/
  controllers/
  middlewares/
  models/
  routes/
  schemas/
  services/
  types/
  utils/
```

## Scope

- This repository is backend-only for submission.

## Quick Start (Windows)

Run these commands in PowerShell:

```powershell
npm install
Copy-Item .env.example .env
npm run dev
```

Optional seed step (destructive reset):

```powershell
$env:ALLOW_SEED_RESET="true"; npm run seed
```

## Setup

1. Install dependencies

```bash
npm install
```

2. Create `.env` file from `.env.example`

```bash
# Bash
cp .env.example .env

# PowerShell
Copy-Item .env.example .env
```

3. Start MongoDB locally (or use MongoDB Atlas and update `MONGO_URI`)

4. Seed data

```bash
# Bash
ALLOW_SEED_RESET=true npm run seed

# PowerShell
$env:ALLOW_SEED_RESET="true"; npm run seed
```

Seeding is destructive by design and blocked unless `ALLOW_SEED_RESET=true` is provided.
Seeding is disabled in production mode.

5. Run dev server

```bash
npm run dev
```

## Build and Run

```bash
npm run build
npm start
```

## Auth

### Login

- `POST /api/auth/login`

Rate-limit policy: 10 login attempts per 15 minutes per IP.

Request body:

```json
{
  "email": "admin@zorvyn.com",
  "password": "Password@123"
}
```

Use returned token as:

```txt
Authorization: Bearer <token>
```

## API Overview

### User Management (ADMIN)

- `GET /api/users`
- `POST /api/users`
- `PATCH /api/users/:id/role`
- `PATCH /api/users/:id/status`

### Financial Records

- `GET /api/records` (VIEWER, ANALYST, ADMIN)
- `GET /api/records/:id` (VIEWER, ANALYST, ADMIN)
- `POST /api/records` (ANALYST, ADMIN)
- `PATCH /api/records/:id` (ANALYST, ADMIN)
- `DELETE /api/records/:id` (ANALYST, ADMIN)

Response notes:

- Successful delete returns `204 No Content`
- Non-admin users can access only records created by themselves

Query filters on `GET /api/records`:

- `type`
- `category`
- `fromDate`
- `toDate`
- `minAmount`
- `maxAmount`
- `page`
- `limit`
- `sortBy` (`date`, `amount`, `createdAt`)
- `sortOrder` (`asc`, `desc`)

### Dashboard

- `GET /api/dashboard/summary`
- `GET /api/dashboard/category-breakdown`
- `GET /api/dashboard/recent-activity`
- `GET /api/dashboard/trends?groupBy=month|week`

## Validation and Errors

- Input validation via Zod
- Login endpoint is rate-limited to reduce brute-force attempts
- Standard error shape:

```json
{
  "success": false,
  "message": "Validation failed",
  "code": "VALIDATION_ERROR",
  "details": []
}
```

## Seed Users

- `admin@zorvyn.com / Password@123`
- `analyst@zorvyn.com / Password@123`
- `viewer@zorvyn.com / Password@123`

These defaults are intended for local development and testing only.

The seed script creates:

- 3 users (one per role)
- Sample financial records spread across categories (Salary, Rent, Groceries, Freelance, Utilities) for each user
- Records span recent months to support trend and summary queries

## Response Examples

### Login (200)

```json
{
  "success": true,
  "message": "Login successful",
  "data": {
    "token": "<jwt>"
  }
}
```

### Create Record (201)

```json
{
  "success": true,
  "message": "Record created",
  "data": {
    "_id": "...",
    "amount": 1000.50,
    "type": "INCOME",
    "category": "Salary",
    "date": "2026-04-01T00:00:00.000Z",
    "notes": "April salary",
    "createdBy": "...",
    "createdAt": "2026-04-03T10:00:00.000Z"
  }
}
```

### Dashboard Summary (200)

```json
{
  "success": true,
  "message": "Summary fetched",
  "data": {
    "totalIncome": 5000,
    "totalExpenses": 2000,
    "netBalance": 3000
  }
}
```

### Validation Error (400)

```json
{
  "success": false,
  "message": "Validation failed",
  "code": "VALIDATION_ERROR",
  "details": [
    { "path": "amount", "message": "Expected number, received string" }
  ]
}
```

## Assumptions

- `amount` supports up to 2 decimal places.
- ANALYST can create, update, and delete records they own. VIEWER is read-only.
- All non-auth routes require valid active user token.
- Dashboard endpoints return only the authenticated user's own data.

## Environment Variables

Use `.env.example` as the source of truth.

Required:

- `MONGO_URI`
- `JWT_SECRET`

Recommended:

- `NODE_ENV`
- `PORT`
- `JWT_EXPIRES_IN`
- `CORS_ORIGIN`
