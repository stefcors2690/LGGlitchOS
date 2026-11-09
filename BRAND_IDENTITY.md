# StefCors GL1tCh 0S — Brand identity v1

Stato operativo alla2.10: fase2 del motore completata in browser; logo canonico v3 e variante statica derivata preservati. Non generare un nuovo marchio per il trasferimento. Conservare assets/branding e references insieme ai sorgenti. Direzione estetica invariata; differenze residue della Home nel [rapporto2.10](docs/verification/phase-2.10/report.md), ripresa3.1 in [HANDOFF](docs/HANDOFF.md) e regole in [VISUAL_REFERENCE_GUIDE](VISUAL_REFERENCE_GUIDE.md). Le liste “Deliverables” indicano obiettivi, non un elenco corrente di lavori mancanti.

## Official naming
Exact display name: **StefCors GL1tCh 0S**. Never replace the digit `1` or `0` with letters.
Internal slug: `stefcors-gl1tch-0s` (suggested). Brand is a custom launcher interface, not a claim to replace the LG operating system.

## Visual direction
- Neon City + Netrunner: wet futuristic city, cinematic rain, cyan-magenta highlights, deep navy and near-black.
- Proposed tokens: background `#070C1B`, surface `#10192B`, cyan `#00DDF5`, magenta `#FF39CF`, text `#F4F7FF`. Validate contrast in real UI.
- Typography: readable geometric sans for navigation; custom angular/glitch treatment for logo only.
- Original stylized S/C monogram with split scanline edges; create SVG paths and a nonanimated fallback.
- Animation: brief startup logo signal assembly, 200–350ms focus transitions, subtle intermittent decorative glitch (never persistent flashing). Respect reduced motion and idle dimming.

## Asset usage
- `references/00_brand_home.png` is the current identity and screen concept. It is NOT a complete interactive UI asset.
- The older boot/focus/home concepts are composition references; replace all old brand text at implementation time.
- Use real third-party application icons sourced from app metadata or official approved assets, preserve proportions/colors and comply with rights. No AI-drawn substitutes.
- Never embed API tokens, home network credentials or privileged webOS actions in frontend code.

## Deliverables for Codex
1. BrandLogo SVG/React component with static and optional animated modes.
2. Theme tokens, typography and TV-safe sizing.
3. Authentic app icon resolution strategy with neutral fallback.
4. Header, focus carousel, widgets and motion consistent with branded mockup.
5. Screenshots at 1920×1080 and 3840×2160 and performance checks when possible.


## v3 addendum — animated logo
Read `ANIMATION_SPEC.md`; use `assets/branding/StefCors_GL1tCh_0S_Glitch_Slow.svg` as the canonical brand asset. The previous NEON OS wording is legacy and must not appear in the shipped UI. Keep original application logos sourced from official/licensed assets or the TV where permitted; never generate counterfeit app logos.
