# AGENTS.md — StefCors GL1tCh 0S Codex instructions

You are implementing StefCors GL1tCh 0S, a cyberpunk TV launcher UI intended for LG OLED G5. Read START_HERE.md, PROJECT_STATUS.md, PROJECT_SPEC.md and ROADMAP.md before changing code.

## Working agreement
1. Work incrementally, one roadmap microphase at a time. Before changes, state planned files and acceptance criteria; after changes, summarize actual edits, tests and limitations.
2. Favor React, TypeScript strict mode, Vite, accessible semantic components and modular architecture. Keep platform calls behind typed interfaces.
3. Implement desktop/browser mock mode first. Do not assume webOS SDK, root access or privileged APIs are available.
4. Never implement exploits, system patches, autostart hooks or remote remapping without a separate explicit user instruction and a verified recovery plan.
5. Never fabricate real device data, weather, streaming progress, app availability or HDMI state. Label sample data as demo.
6. Optimize for 16:9 TV and 10-foot navigation: visible focus, D-pad keyboard support, Back/Escape, OK/Enter, optional pointer.
7. Preserve approved Neon City + Netrunner visual direction; cyan/magenta glow, dark atmospheric city, holographic cards; avoid excessive flicker, flashes or OLED-hostile static bright elements.
8. Support prefers-reduced-motion and idle dimming. Keep background assets local, original or properly licensed, and include fallbacks.
9. Add or update tests for navigation, platform adapters and significant logic. Run available lint/typecheck/build/tests; report any that cannot run.
10. Keep documentation synchronized. Do not introduce large libraries or network services without explaining the tradeoff and requesting approval.

## First assignment
Set up the React + TypeScript + Vite project with a working browser preview. Implement a polished StefCors GL1tCh 0S home screen with demo content, a keyboard-driven TV focus manager, mock platform adapter, theme tokens, and reduced-motion setting. Provide clear `npm install`, `npm run dev`, `npm run build`, and test instructions. Stop before integrating privileged webOS functionality.

## Definition of done
A fresh checkout can install, run, and build. Navigation works without a mouse. All external integrations are mocked and visibly marked. No TypeScript errors or broken asset references. Document known gaps.

## Visual references
Before implementing or changing visual UI, read `VISUAL_REFERENCE_GUIDE.md` and inspect `references/00_brand_home.png` and `references/01_home_approved.png` first. The other three images are secondary references. Build real components, never use the flattened mockup as the whole UI.

11. Brand display name must remain exactly `StefCors GL1tCh 0S`. Third-party app marks must use authentic assets where permitted, never AI imitations; animate cards, not marks.


## v3 addendum — animated logo
Read `ANIMATION_SPEC.md`; use `assets/branding/StefCors_GL1tCh_0S_Glitch_Slow.svg` as the canonical brand asset. The previous NEON OS wording is legacy and must not appear in the shipped UI. Keep original application logos sourced from official/licensed assets or the TV where permitted; never generate counterfeit app logos.

## Project continuity — required at every handoff

- Use `ROADMAP.md` microphase IDs; work on one microphase at a time. Split oversized steps before implementation.
- Before work, reconcile `PROJECT_STATUS.md` and roadmap states with actual files and local Git changes. Preserve unrelated user changes.
- At the end of each microphase or session that changes the project, update `ROADMAP.md` statuses and `PROJECT_STATUS.md`: date, actual work, active/next microphase, decisions, checks with outcomes, limitations and unresolved blockers.
- If interrupted or incomplete, leave concrete remaining steps and affected files. Never mark an unchecked acceptance criterion complete.
- Update README for available commands/setup, PROJECT_SPEC for changed contracts or scope, and visual/animation docs when their rules change. Update START_HERE if the entry workflow changes.
- Keep enough context in repository files for a different IDE to resume without chat history. These documentation updates are part of completion, not optional follow-up work.
- The original First assignment describes the MVP target; execute it through the microphases, not as a single large implementation.

## Priorità visiva esplicita — 2026-11-09

L’utente richiede **massima fedeltà visiva ai riferimenti**, non una reinterpretazione o un dashboard generico. Branding: `references/00_brand_home.png`; composizione/layout: `references/01_home_approved.png`; sfondo effettivo: `references/background.png`. Gli altri mockup restano secondari e non devono introdurre una direzione diversa.

Riprodurre gerarchia, proporzioni, posizioni, densità, margini, tipografia leggibile, cornici olografiche, glow cyan/magenta e trattamento del focus. Usare componenti reali e loghi terzi autentici o fallback neutri; non incorporare il mockup completo come UI e non presentare i dati dei mockup come reali.

Prima di completare una fase visiva, confrontare gli screenshot 1080p/4K con i riferimenti prioritari e documentare differenze residue e verifiche. Le funzionalità di fasi future possono restare incomplete, ma lo stile e la geometria degli elementi già implementati devono convergere al riferimento. Non dichiarare fedeltà completa finché restano differenze evidenti; evitare semplificazioni o cambi di direzione non richiesti. L’attuale shell/header è una base funzionante e richiede ancora allineamento visivo al riferimento.


## Passaggio su un altro PC

La procedura operativa e la mappa dei file sono in `docs/HANDOFF.md`, richiamata da START_HERE. Trasferire sorgenti/asset/lockfile e reinstallare le dipendenze sul nuovo PC. I rapporti storici non sono lo stato corrente; mantenere gli ID di ROADMAP e registrare separatamente le nuove evidenze senza sovrascrivere quelle precedenti. Il punto di ripresa resta PROJECT_STATUS, non questo file di istruzioni.
