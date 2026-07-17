# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project status

**Scaffold created** (2026-07-14). Full-stack Node/React foundation is in place:
- Backend: Node.js + Express + TypeScript + PostgreSQL
- Frontend: React 18 + TypeScript + Tailwind CSS + Zustand
- Monorepo structure with shared package.json
- Core API endpoints for auth, circles, requests, profile
- Database schema with Circles/Requests/Members model
- Auth pages (login/signup) and core feature screens stubbed

Ready for:
1. Database setup (`npm run db:migrate && npm run db:seed`)
2. Dev environment startup (`npm run dev`)
3. Feature implementation (Circle creation, Request posting, Responses)

See README.md for stack details, project structure, and next steps.

## Product context

**Ambit** is a mobile-first social app for residents of gated societies (apartment complexes) who have a hobby or interest they've shelved simply because they don't know which of their 200+ neighbors shares it. The problem is proximity + anonymity within a community the user already lives in — not general "meet new people" or dating.

Seed user story: *As a working professional living in a gated society, I want to connect with someone who plays pickleball so I can continue my hobby and have a sense of community around me.*

**Experience principles:** Warm · Trusted · Low-pressure. It should feel like a friendly notice board run by people you actually live near — explicitly not a dating-app-style matching engine, and not a generic task/community board.

**Core journey:** Sign up with society invite code → admin approves → pick interests → Home (Circles feed near you) → join a Circle → see and respond to Requests posted inside that Circle → connect and meet up in person.

### Circles vs Requests (the central data model — read this before building anything)

- **Circles** = ongoing, recurring, exist independently of any single moment (e.g. "Pickleball — Tue/Thu evenings"). No fixed end; people join over time.
- **Requests** = one-off, time-bound asks that only exist because someone needs something right now (e.g. "need a 4th at 6pm today"). They resolve and disappear once accepted/completed.
- **Locked scoping rule:** Requests are NOT a standalone, freestanding feature. They only exist inside a Circle the user has already joined, and are visible only to that Circle's members. This avoids a generic "ask-anything chatbox," solves cold-start by giving every Request a built-in audience, and keeps the product to one story: Circles are where you find your people, Requests are how you make plans with them.
- All posts (Circles and Requests) are structured cards with fixed categories/fields — **no open-ended freeform chat or message threads**, anywhere in the product.

### Hard constraint from mentor

No generic community/chatbox product. Every feature must justify itself against this constraint — if a feature starts to look like open messaging or an unstructured ask-board, it is out of scope, regardless of how useful it seems.

**2026-07-16 update — Requests scoping reversed.** The Circles-only scoping rule above described the original locked decision. New Figma reference designs (see `Design References/`) show Requests as a society-wide, Circle-independent feature: a dedicated "Requests" nav tab, a Home feed of recent requests, standalone request creation with no Circle picker (category-based: Maintenance/Errand/Tool Share/etc.), and a "Confirm & get contact" flow that reveals phone numbers between requester and a chosen helper. The user explicitly chose to match these mockups exactly, reversing the locked decision above, after being told this contradicts the mentor's hard constraint. Structured cards (not freeform chat) are still preserved — every request is category + fixed fields, not an open text thread — so the "no chatbox" half of the constraint still holds; only the "must be inside a joined Circle" half was reversed. Circle-scoped request creation still exists too (post into a specific Circle from its detail page); it's just no longer the only path. If this matters for the mentor evaluation, revisit before the pilot.

### Key screens

- Onboarding (society invite code + admin approval)
- Home (Circles feed)
- Circle detail (members, ongoing Requests inside it, join button)
- Create Circle / Create Request (Request creation is only available from within a Circle you're already in)
- Profile (your Circles, your society, trust indicator)

### Definition of done

Deployed, live URL, with real admin-approved users from an actual society or college hostel actually using it — a working product people can open on their phone, not a demo walkthrough.

### Evaluation rubric this is being built toward

- Problem clarity — 25 pts (must be real, specific, immediately legible without explanation)
- Product completeness — 25 pts (core flow works end-to-end, no placeholders, real data)
- UX quality — 20 pts (usable on first encounter, navigation, copy, consistency, craft)
- Pitch & Demo — 30 pts (conviction beats polish)
