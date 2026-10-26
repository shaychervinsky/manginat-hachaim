# Manginat HaChaim (מנגינת החיים) — MVP

A Hebrew-first (RTL) personal-growth web app built on the Tanya's model of the soul, for a secular audience. Read `SPEC.md` (Hebrew) before changing behavior or content.

## Layout
- `index.html` — the whole MVP: one self-contained page (HTML + CSS + vanilla JS, no build step). Content lives in the constants at the top of the script (`POWERS`, `MONTHS`, `LEVELS`, `QUIZ`, `MIDDOT`, `DISTRESS`).
- `SPEC.md` — product spec.

## Rules
- Content source is the Tanya text only. Never copy wording from commentaries or other authors' books. Every insight cites a Tanya chapter.
- Tone: no commandments, no charms, no self-blame ("ראית, למדת, ממשיכים").
- No tasks or notifications on Shabbat.
- Keep the "not a substitute for therapy" consent and the help card (ERAN 1201, Sahar, MDA 101, Police 100).
- Storage: `store` abstraction — private per-user cloud store when hosted as a Claude artifact (`window.claude.use("db")`), else `localStorage`, else memory. Replace with a real backend when moving to a native app.

## Next steps
1. Ship as a PWA or React Native app with real auth and backend.
2. Write 12 months × 6 weekdays of content with the founder.
3. Holiday calendar, notifications, guided audio meditations.
4. Clinical advisor review of the distress flow before launch.
