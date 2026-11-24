# Manginat HaChaim (מנגינת החיים) — MVP

A Hebrew-first (RTL) personal-growth web app built on the Tanya's model of the soul, for a secular audience. Read `SPEC.md` (Hebrew) before changing behavior or content.

## Layout
- `index.html` — the app source: one self-contained page (HTML + CSS + vanilla JS). Content lives in the constants at the top of the script (`POWERS`, `MONTHS`, `LEVELS`, `QUIZ`, `MIDDOT`, `DISTRESS`). This is the single source of truth; everything else is built or copied from it.
- `build.py` — builds the installable PWA into `docs/` (served by GitHub Pages). Run `python3 build.py` after every change to `index.html` and commit both.
- `brand/` — the logo ("הפאוזה": a fermata, an arc over a dot — stop on the note; works in Hebrew and English) as SVG; `docs/icons/*.png` are rendered from `brand/app-icon*.svg`.
- `SPEC.md` — product spec (Hebrew).

## Where things live (one name each)
- App, installable: GitHub Pages from `docs/` on `main`.
- App on claude.ai: https://claude.ai/artifact/WiXonev3tnCN4cGSYBRjSz — republish `index.html` there after changes.
- Design system: https://claude.ai/artifact/CijEKYQ4aHCQ3jLaPuHVF9 — tokens, components, voice. Change it when the look changes.
- Content review sheet: https://claude.ai/artifact/HPpA9T6w31u59k7F9XdRSS — every daily item, level question and middah line, with a status per row. The `מזהה` column (e.g. `thought.3`, `hanukkah.2`) maps a row to its place in `index.html`. Approved rows are copied back into the code.
- Screen designs and logo: https://claude.ai/artifact/V59ZCeHoDjCRLog45KFyw8 — mockups only, not the app.

## Vocabulary
- The evening practice is **התבוננות ערב** (never "תחקיר"). In code it is still `debrief` internally.
- English name, for now: **Melody of Life** (not final).
- The look is the calm version ("נוסח שקט"); there is no other palette.

## Rules
- The Tanya is the backbone of the content, but not the only source: other sources (e.g. the Lubavitcher Rebbe) are welcome. Every insight and quote names its source (a Tanya chapter, or the author). Keep quotes short and attributed; otherwise write in the brand's own words rather than copying long passages.
- Tone: no commandments, no charms, no self-blame ("ראית, למדת, ממשיכים").
- No tasks or notifications on Shabbat.
- Keep the "not a substitute for therapy" consent and the help card (ERAN 1201, Sahar, MDA 101, Police 100).
- Storage: `store` abstraction — private per-user cloud store when hosted as a Claude artifact (`window.claude.use("db")`), else `localStorage`, else memory. Replace with a real backend when moving to a native app.

## Next steps
1. Ship as a PWA or React Native app with real auth and backend.
2. Write 12 months × 6 weekdays of content with the founder.
3. Holiday calendar, notifications, guided audio meditations.
4. Clinical advisor review of the distress flow before launch.
