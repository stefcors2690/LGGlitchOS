# Animation specification — StefCors GL1tCh 0S

## Logo v3 — slow cinematic glitch
- Canonical asset: `assets/branding/StefCors_GL1tCh_0S_Glitch_Slow.svg`.
- Cycle: **9 seconds**, with two distortion windows at approximately 1.2–2.0s and 5.1–6.1s.
- Preserve visible text exactly: **StefCors GL1tCh 0S** (digit 1, digit 0).
- RGB chromatic split, horizontal slices, short jitter, scanline, then clean readable recovery.
- Prefer subtle glow between glitches; no continuous intense flashing.
- `prefers-reduced-motion: reduce` disables animations.
- Test SVG standalone in Chrome/Edge via `assets/branding/preview.html`, then embedded via `<img>`, then on webOS. Some viewers display a static frame.
- Never use the image mockup as a baked background containing fake interactive buttons. Recreate all controls in React.

## TV animation rules
- Target smooth navigation and focus feedback; use transform/opacity rather than costly layout animation.
- Focus transition 180–300ms; screen transition 350–650ms; boot sequence optional and skippable.
- Video wallpaper must have a static fallback, quality setting, pause-on-idle, and reduced-motion option.
- Avoid full-screen flashing, high-frequency flicker and persistent OLED-bright stationary highlights.

## Browser integration verified in 0.4

`BrandLogo` keeps the canonical SVG as the normal image source. For `prefers-reduced-motion`, a picture source uses a still version derived from that same SVG, with animations and ghost/slice layers disabled. This avoids retained glitch frames observed when an external SVG image is decoded under browser motion emulation. No separately drawn logo is maintained. An image error falls back to the exact brand name as text.

Chrome headless checks and screenshots are documented in `docs/verification/phase-0.4.md`. The normal standalone SVG timeline advances for two cycles; static source and reduced-motion behavior are verified automatically. Edge, real webOS rendering and visual observation of every animation frame remain unverified. Manual motion setting and idle dimming remain later roadmap work.
