# Getting Started with Ambit

Follow these steps to get the dev environment running.

## 1. Install Dependencies

```bash
npm install
```

This installs both backend and frontend dependencies via the workspace setup.

## 2. Set Up PostgreSQL

**Option A: Local PostgreSQL**
```bash
# Create database
createdb ambit

# Copy env template
cp backend/.env.example backend/.env

# Edit backend/.env and set:
DATABASE_URL=postgresql://youruser:yourpassword@localhost:5432/ambit
JWT_SECRET=dev-secret-change-in-production
```

**Option B: Docker**
```bash
docker run --name ambit-db -e POSTGRES_PASSWORD=postgres -e POSTGRES_DB=ambit -p 5432:5432 -d postgres:15
```
Then update `backend/.env`:
```
DATABASE_URL=postgresql://postgres:postgres@localhost:5432/ambit
```

## 3. Initialize Database

Run migrations to create tables:
```bash
npm run db:migrate --workspace=backend
```

Optionally seed sample data:
```bash
npm run db:seed --workspace=backend
```

## 4. Start Development Servers

```bash
npm run dev
```

This starts both backend (port 5000) and frontend (port 3000) in parallel.

## 5. Test the App

1. Open http://localhost:3000
2. Sign up with:
   - Invite Code: `RIVER2024` (seeded with sample society)
   - Email: `alice@example.com` (or any new email)
   - Password: anything (min 8 chars)
3. Note: New signups require admin approval. Seeded users are pre-approved.
4. To skip approval, use seeded credentials:
   - Email: `alice@example.com`
   - Password: `demo123`

## Workflow

After initial setup, daily work is:
```bash
npm run dev              # Start both servers
npm run lint            # Check code quality
npm run build           # Build for production
```

## Common Issues

**"connect ECONNREFUSED"** — PostgreSQL not running. Start it or check DATABASE_URL.

**"POSTGRES_INITDB_ARGS"** — Ignore if using Docker; Postgres initializes automatically.

**Port 3000/5000 in use** — Kill the process or change ports in `vite.config.ts` and `src/index.ts`.

## Next Development Steps

1. **Complete Create Circle form** (HomePage + backend validation)
2. **Complete Create Request form** (CircleDetailPage, member-only)
3. **Build Request Response flow** (UI + API)
4. **Add Edit Profile form** (ProfilePage)
5. **Implement Join/Leave Circle** (CircleDetailPage buttons)
6. **Add society admin panel** (approve new users)
7. **Real-time updates** (WebSockets or polling)
8. **Search/filter circles** (HomePage)
9. **Notifications** (new requests, responses)
10. **Mobile responsiveness** (test on phone)

## Architecture Notes

- **Circles** are persistent groups (e.g., "Pickleball — Tue/Thu 6 PM")
- **Requests** are one-off, time-bound asks that only exist inside a Circle
- **No generic messaging** — all posts are structured cards with fixed fields
- Users can only see Requests in Circles they've joined
- Admin must approve new users before they can log in

See README.md for full tech stack, API docs, and deployment info.
