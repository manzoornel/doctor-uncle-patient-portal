# Doctor Uncle Patient App

A patient-facing app (mobile-friendly web app / PWA) for Doctor Uncle Family
Clinic, built on top of the existing Grandis EMR API.

## What's inside

- **Login** — mobile number + OTP (via Grandis `getLoginOTP` / `patientLogin`)
- **Home** — next appointment, latest vitals, sugar trend chart
- **Appointments** — doctor list, slot picker, booking
- **Records** — visit history → per-visit vitals, lab reports, medications
- **AI Chat** — ask about your own records in Malayalam or English (powered
  by Claude), answers using only the patient's real data
- **Profile** — logout

## Project structure

```
app/
  page.js              → renders the app
  layout.js            → fonts, page metadata
  api/grandis/route.js → server-side proxy to the Grandis EMR API
  api/chat/route.js    → server-side AI chat endpoint (Claude)
components/
  PatientApp.js         → main screen router + state
  screens/               → one file per screen
  ui.js                  → shared bits (top bar, bottom nav, vital pill)
lib/
  grandisServer.js       → talks to the real Grandis API (server-only)
  api.js                  → talks to our own /api routes (client-side)
  theme.js                → colors + bilingual text
```

## Before this goes live — 3 things to confirm with Grandis

The API PDF lists endpoint names and the fields they expect, but not a full
sample request/response. `lib/grandisServer.js` makes reasonable assumptions
(see comments at the top of that file). Please confirm with Grandis support:

1. The exact request shape (is it `{ "api": "getLoginOTP", "mobile": "..." }`,
   or something else?)
2. Whether the login `token` goes in the request body or an HTTP header for
   authenticated calls.
3. The exact JSON field names returned for vitals, lab values, and
   medication dosage — so the screens show the right labels.

Once confirmed, only `lib/grandisServer.js` needs updating — no UI changes.

## Setup

```bash
npm install
cp .env.example .env.local
# fill in ANTHROPIC_API_KEY for the AI chat feature
npm run dev
```

Open http://localhost:3000 — resize your browser to phone width, or open on
your phone once deployed, to see the mobile-first layout.

## Deploying

This is a standard Next.js app — deploy to Vercel, or any Node host:

```bash
npm run build
npm run start
```

Set `GRANDIS_BASE_URL` and `ANTHROPIC_API_KEY` as environment variables on
whichever host you use. Once deployed, patients can "Add to Home Screen"
from their phone browser and it behaves like an installed app (PWA).

## Making small changes later

Each screen is its own file under `components/screens/`. Colors and
bilingual text are in one place: `lib/theme.js`. Point out the screen name
and the change, and it's a quick edit — no need to touch anything else.
