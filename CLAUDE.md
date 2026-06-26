# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Overview

Front-end for the Majority Judgment election application (`app.mieuxvoter.fr`). It lets users create elections, vote with graded ballots, and view Majority Judgment rankings. It is a **Next.js (Pages Router)** app, deployed on **Netlify**, and talks to a separate back-end (`api.mieuxvoter.fr`) that stores votes and computes the ranking. The front-end owns translations and invitation emails.

## Commands

Requires Node 20 (`.nvmrc`). Uses `--webpack` (not Turbopack).

```bash
npm install          # or: make install
npm run dev          # local dev server at http://localhost:3000 (or: make demo)
npm run build        # production build
npm run start        # serve a production build
npm run lint         # eslint . (flat config in eslint.config.mjs)
```

There is currently **no automated test runner wired up** — `package.json` has no `test` script (the `tests/` folder holds fixtures + a manual `netlify-send-emails.sh` shell script, and the `.circleci/config.yml` references stale `yarn translate`/`yarn test` scripts that no longer exist). Don't assume `npm test` works; verify changes via `npm run lint` and `npm run dev`.

To exercise the Netlify email function locally, run the app via Netlify Dev (so `/.netlify/functions/*` is served) rather than plain `next dev`.

## Architecture

### Routing & user flow (`pages/`)
Elections are addressed by a **public ref/slug (`pid`)** and an optional **token (`tid`)** that grants elevated access. The flow spans dynamic routes:
- `pages/admin/new.tsx` — create an election (multi-step form driven by `ElectionContext`).
- `pages/admin/[pid]/[tid].tsx` — admin panel (requires the admin token).
- `pages/votes/[pid]/[[...tid]].tsx` — cast a ballot.
- `pages/results/[pid]/[[...tid]].tsx` — view results.
- `pages/end/[pid]/[[...tid]].tsx` — post-vote confirmation.

There are both singular and plural route families (`vote`/`votes`, `result`/`results`); the canonical ones are the plural forms enumerated in `RouteTypes` (`services/routes.ts`). **Always build page URLs with `getUrl(type, locale, ref, token)` from `services/routes.ts`** — URLs are locale-prefixed (`/{locale}/{type}/{ref}/{token}`) and refs are normalized via `displayRef`.

### State (`services/`)
Two React Context + `useReducer` stores, not Redux:
- **`ElectionContext.tsx`** — the election being created/edited (candidates, grades, dates, privacy, emails). Actions via the `ElectionTypes` enum; dispatch through the reducer rather than mutating.
- **`context.tsx`** — global app state: full-page flag and the toast queue (`AppTypes`).
- **`BallotContext.tsx`** — the voter's in-progress ballot.

### Back-end API (`services/api.ts`, `services/constants.ts`)
All endpoints are defined in `api.routesServer` (`elections`, `results/:slug`, `elections/:slug/progress`, `ballots`). Base URL is `URL_SERVER` (`NEXT_PUBLIC_BACKEND_URL`, defaults to `https://api.mieuxvoter.fr/`). The API translates between back-end `*Payload` shapes and front-end `*Item`/context shapes — keep that mapping in `api.ts`, not in components.

Nearly all tunable values are env-driven `NEXT_PUBLIC_*` constants in `services/constants.ts` (URLs, default grades, `GRADE_COLORS`, max candidates). Prefer adding new config there over hardcoding.

### Emails (Netlify Functions)
`functions/send-emails/index.ts` is a Netlify serverless function using **Mailgun** + **Handlebars** templates (`invite.html`/`.txt`, `admin.html`/`.txt`) and its own i18n (`functions/i18next.ts`). The front-end calls it via `services/mail.ts` (`sendInviteMails`, `sendAdminMail`) which POST to `/.netlify/functions/send-emails` with an `action` of `invite` or `admin`. Required env vars: `MAILGUN_API_KEY`, `MAILGUN_DOMAIN`, `MAILGUN_URL`, `FROM_EMAIL_ADDRESS`, `REPLY_TO_EMAIL_ADDRESS`. The `functions/` tree is excluded from the app's `tsconfig.json` and has its own i18n separate from the front-end's.

### i18n
Locales `en` and `fr` (default `fr`), configured in `next.config.js` and `next-i18next.config.js`. Translation JSON lives in `public/locales/{en,fr}/`. To add a language: update both configs **and** the `LanguageSelector` component. Production translations are managed via Weblate.

### Components (`components/`)
- `components/admin/` — election creation/editing UI (candidate/grade fields, modals, date limits, privacy params).
- `components/ballot/` — the voting interface, split into `BallotDesktop` / `BallotMobile`.
- `components/layouts/` — page shells.
- Root `components/` — shared widgets (`MeritProfile` renders the MJ result chart, `CSVModal`/`CSVLink` for exports, etc.).

Majority Judgment computation uses the `scalable-majority-judgment` package (transpiled via `transpilePackages` in `next.config.js`); helpers in `services/majorityJudgment.ts` and `services/grades.ts`.

## Conventions

- Path aliases (`tsconfig.json` / `jsconfig.json`): `@components/*`, `@services/*`, `@styles/*`, `@functions/*`. Use these instead of long relative paths.
- TypeScript with `strict: false` — types exist but are loose; match the surrounding style.
- Prettier config is in `package.json`: 2-space tabs, single quotes, semicolons, `printWidth` 80, `trailingComma: es5`.
- Styling is Bootstrap 5 + SCSS (`styles/`, compiled with `sass-embedded`).
- Drag-and-drop (candidate/grade ordering) uses `@dnd-kit`.
```
