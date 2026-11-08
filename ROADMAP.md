# StefCors GL1tCh 0S — Development Roadmap

## Phase 0 — Foundation
React + TypeScript + Vite, strict linting, folder structure, mock adapter, theme tokens, responsive TV layout, basic tests.
**Done when:** `npm run dev` and `npm run build` succeed, screen fits 16:9.

## Phase 1 — Cinematic Home MVP
Original animated cyberpunk skyline with lightweight rain/parallax or video fallback; holographic app rail, navigation, demo HDMI and domotics widgets, clock, reduced-motion setting.
**Done when:** coherent UI resembles approved concept, smooth D-pad navigation, no broken focus.

## Phase 2 — Interaction polish
Focus graph, remote keyboard simulator, pointer mode, overlays, transitions, idle dimming, offline and empty states, accessibility and performance profiling.
**Done when:** TV navigation works without mouse and motion degrades gracefully.

## Phase 3 — webOS application packaging
Verify current SDK documentation, package IPK, enable Developer Mode on test TV, inspect webOS capabilities and permissions. Implement safe public-API adapter only.
**Gate:** access to actual LG G5 and exact firmware/webOS version.
**Done when:** app runs on G5 with verified supported controls and documented unsupported functions.

## Phase 4 — Real integrations
App listing/launching and HDMI where APIs/permissions permit; Home Assistant via appropriately secured local bridge. No secrets in client bundles.
**Done when:** each integration is verified on-device and falls back safely.

## Phase 5 — Feasibility of full Home replacement (separate decision)
Research exact firmware compatibility, root status, existing launcher approaches, risks, reversibility and recovery plan. Request explicit approval before system changes.
**Done when:** written go/no-go decision. If no-go, maintain standalone app without pretending full replacement.

## Phase 6 — Optional privileged integration
Only after Phase 5 go decision and explicit authorization: prototype reversible startup/Home behavior, test boot/recovery and upgrades. Never assume guaranteed compatibility.

## Open questions
- Exact firmware and webOS build on user's LG OLED G5.
- Original city background: video loop, layered still assets, or procedural rendering.
- Which installed apps and HDMI inputs matter most.
- Home Assistant endpoint and desired device scope (later).
- Need for audio feedback and ambient sound; default off.


## v3 addendum — animated logo
Read `ANIMATION_SPEC.md`; use `assets/branding/StefCors_GL1tCh_0S_Glitch_Slow.svg` as the canonical brand asset. The previous NEON OS wording is legacy and must not appear in the shipped UI. Keep original application logos sourced from official/licensed assets or the TV where permitted; never generate counterfeit app logos.
