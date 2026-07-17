# Ambit — Project Brief

## Project links
- **Git repository:** https://github.com/himankvijureja20-arch/Ambit/
- **Google Drive (assets, docs, design files):** https://drive.google.com/drive/folders/1Heu-wRTeI4tqh9P5Y_vDSBvUpdPFs0Lf?usp=sharing
- **Local project folder:** C:\Users\himan\Desktop\Ambit
- **Contact email:** himankvijureja20@gmail.com
- **Team size:** 4

## Design brief

**Product name**
Ambit

**Primary user**
A working professional living in a gated society, mid-20s to 40s, who has a hobby or interest they've had to shelve since moving in — because they know almost no one in a building of 200+ households.

Seed user story (given to mentor): *As a working professional living in a gated society, I want to connect with someone who plays pickleball so I can continue my hobby and have a sense of community around me.*

**Pain**
They want to keep playing pickleball / running / jamming on guitar, but have no way to find out who else in their own society shares that interest — so it quietly dies, or they trek across the city to find people instead of finding them 50 meters away.

**Experience principles**
Warm · Trusted · Low-pressure — this should feel like a friendly notice board run by people you actually live near, not a dating-app-style matching engine and not another task list.

**Core journey**
Sign up with society invite code → admin approves → pick your interests → land on Home, see active Circles (ongoing, e.g. "Pickleball — Tue/Thu evenings") near you → join a Circle → see and respond to Requests posted inside that Circle (one-off, time-bound asks from fellow Circle members, e.g. "need a 4th at 6pm today") → connect and meet up.

**Key screens**
- Onboarding (society invite code + admin approval)
- Home (Circles feed)
- Circle detail (members, ongoing Requests inside it, join button)
- Create Circle / Create Request (Request creation only available from within a Circle you're already in)
- Profile (your Circles, your society, trust indicator)

**Done =**
Deployed, live URL, real admin-approved users from Himank's own society or college hostel actually using it — a working product people can open on their phone, not a demo walkthrough.

## Core concept: Circles vs Requests

**Circles** = ongoing, recurring, exist independently of any single moment (a standing pickleball group, a weekly chess night). No fixed end — people join over time.

**Requests** = one-off, time-bound, only exist because someone needs something right now (e.g. "need a 4th at 6pm today"). Have a natural end — resolve and disappear once accepted/completed.

**Scoping rule (locked decision):** Requests are NOT a standalone, freestanding feature. They only exist inside a Circle a user has already joined, visible only to that Circle's members. This avoids the "generic ask-anything chatbox" trap (explicit mentor restraint), solves the cold-start problem by giving Requests a built-in audience, and keeps the product to one clean story: Circles are where you find your people, Requests are how you make plans with them.

No open-ended freeform chat — all posts (Circles and Requests) are structured cards with fixed categories/fields, not message threads.

## Hard constraint from mentor
No generic community/chatbox product. Every feature must justify itself against this — if it starts to look like open messaging or an unstructured ask-board, it's out of scope.

## Rubric this is being built toward
- Problem clarity — 25 pts (must be real, specific, immediately legible without explanation)
- Product completeness — 25 pts (core flow works end-to-end, no placeholders, real data)
- UX quality — 20 pts (usable on first encounter, navigation, copy, consistency, craft)
- Pitch & Demo — 30 pts (conviction beats polish)
