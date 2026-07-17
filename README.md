# Ambit — Social App for Gated Communities

A mobile-first social app for residents of gated societies to discover and connect with neighbors who share their hobbies and interests.

## Project Structure

```
ambit/
├── backend/          # Node.js/Express API server
│   ├── src/
│   │   ├── index.ts           # Main server entry
│   │   ├── db/
│   │   │   ├── client.ts      # Database connection
│   │   │   ├── schema.sql     # Database schema
│   │   │   ├── migrate.ts     # Migration runner
│   │   │   └── seed.ts        # Sample data seeder
│   │   ├── middleware/
│   │   │   ├── auth.ts        # JWT authentication
│   │   │   └── errorHandler.ts
│   │   └── routes/
│   │       ├── auth.ts        # Login/signup
│   │       ├── circles.ts     # Circle management
│   │       ├── requests.ts    # Requests (inside circles)
│   │       └── profile.ts     # User profile
│   └── package.json
├── frontend/         # React frontend
│   ├── src/
│   │   ├── pages/
│   │   │   ├── LoginPage.tsx
│   │   │   ├── SignupPage.tsx
│   │   │   ├── HomePage.tsx        # Circle feed
│   │   │   ├── CircleDetailPage.tsx
│   │   │   └── ProfilePage.tsx
│   │   ├── api/
│   │   │   └── client.ts      # API client wrapper
│   │   ├── store/
│   │   │   └── authStore.ts   # Zustand auth store
│   │   ├── App.tsx            # Main router
│   │   └── main.tsx
│   └── package.json
└── package.json     # Root workspace config
```

## Tech Stack

**Backend:**
- Node.js + Express
- TypeScript
- PostgreSQL
- JWT authentication
- Zod for validation

**Frontend:**
- React 18
- TypeScript
- React Router
- Tailwind CSS
- Zustand for state
- Axios for API

## Quick Start

### Prerequisites

- Node.js 18+ and npm
- PostgreSQL 13+

### Setup

1. **Clone and install dependencies:**
   ```bash
   npm install
   ```

2. **Configure database:**
   - Copy `backend/.env.example` to `backend/.env`
   - Update `DATABASE_URL` with your PostgreSQL connection string
   - Create a PostgreSQL database: `createdb ambit`

3. **Run migrations and seed data:**
   ```bash
   npm run db:migrate --workspace=backend
   npm run db:seed --workspace=backend
   ```

4. **Start development servers:**
   ```bash
   npm run dev
   ```
   - Backend: http://localhost:5000
   - Frontend: http://localhost:3000

## Core Concepts

### Circles
Ongoing, recurring groups (e.g., "Pickleball — Tue/Thu evenings"). Members join to find their people.

### Requests
One-off, time-bound asks inside a Circle (e.g., "need a 4th at 6pm today"). Only visible to Circle members.

**Important:** Requests only exist inside Circles. No generic chatbox or freeform messaging.

## API Endpoints

### Auth
- `POST /api/auth/signup` — Create account with society invite code
- `POST /api/auth/login` — Login

### Circles
- `GET /api/circles` — List circles in user's society
- `GET /api/circles/:id` — Circle detail + members
- `POST /api/circles` — Create circle
- `POST /api/circles/:id/join` — Join circle
- `POST /api/circles/:id/leave` — Leave circle

### Requests (member-only)
- `GET /api/requests/circle/:circleId` — List requests in circle
- `POST /api/requests` — Create request (must be circle member)
- `POST /api/requests/:id/respond` — Respond to request
- `PATCH /api/requests/:id` — Update status (creator only)

### Profile
- `GET /api/profile` — User profile + interests
- `PATCH /api/profile` — Update name/interests
- `GET /api/profile/circles` — User's joined circles

## Database Schema

**Users** — Account info, approval status
**Societies** — Gated communities with invite codes
**Circles** — Interest groups (Pickleball, Tennis, etc.)
**Requests** — One-off asks inside circles
**Interests** — User hobby tags
**CircleMembers** — Membership records
**RequestResponses** — Who responded to what

## Next Steps

- [ ] Implement Create Circle UI/flow
- [ ] Implement Create Request UI (inside CircleDetail)
- [ ] Implement Request response UI
- [ ] Add society admin panel (approve new users)
- [ ] Add Edit Profile form
- [ ] Real-time updates (WebSockets or polling)
- [ ] Admin-only endpoints (manage societies, approve users)
- [ ] Notification system
- [ ] Search/filtering for circles

## Development

### Backend
```bash
npm run dev --workspace=backend      # Dev with hot reload
npm run build --workspace=backend    # Build for production
npm run lint --workspace=backend     # Lint code
```

### Frontend
```bash
npm run dev --workspace=frontend     # Dev with hot reload
npm run build --workspace=frontend   # Build for production
npm run preview --workspace=frontend # Preview build locally
```

## Environment Variables

**Backend (.env):**
```
PORT=5000
DATABASE_URL=postgresql://user:pass@localhost:5432/ambit
JWT_SECRET=your-secret-key-here
FRONTEND_URL=http://localhost:3000
NODE_ENV=development
```

**Frontend (.env):**
```
VITE_API_URL=/api  (default, proxied via vite config)
```

## Deployment

- **Backend:** Heroku, Railway, AWS ECS, etc.
- **Frontend:** Vercel, Netlify, AWS S3 + CloudFront

Update backend database URL and JWT secret in production. Use environment-specific configs.

## Notes

- All passwords are hashed with bcryptjs
- JWT tokens expire in 7 days
- Users must be admin-approved to log in
- Requests are scoped to their Circle (no cross-circle visibility)
- No open messaging — all posts are structured cards with fixed fields

For questions or issues, open a GitHub issue in the [Ambit repo](https://github.com/himankvijureja20-arch/Ambit).
