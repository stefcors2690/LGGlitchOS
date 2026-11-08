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
