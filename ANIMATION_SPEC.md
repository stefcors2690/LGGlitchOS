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

## City backdrop — microphase 1.1

- Original static SVG layers; transforms/opacity animate foreground drift (42s), mist (56s), rain (1.4s) and two craft paths (43s/67s, phase offsets and long hidden portions). No per-frame React state, flashing lights, shaders or video decoder.
- Craft artwork and trail are original and remain behind all UI. Paths have distinct scale/direction/depth; timing is deterministic and not randomized.
- `useBackgroundMotion` combines system reduced motion, document visibility and manual pause. Reduced motion overrides manual resume. Manual pause survives hide/show within the mounted component, but is not persisted across reloads.
- Reduced motion disables decorative animations and hides rain/craft. Manual pause suspends the backdrop and hides rain/craft, leaving a static city. Logo animation has its separate policy from 0.4; the backdrop pause control does not claim to pause the brand logo.
- Tab/Enter/Space operate the background button; full D-pad focus is still 1.4. Idle-based pausing/dimming is still 2.3; hook this background policy into that future idle state.
- Browser evidence: `docs/verification/phase-1.1/report.md`. No 60fps or OLED/device performance guarantee until hardware measurement.

## Approved background correction — 2026-11-09

The user-selected references/background.png replaces the generated city layers. No drift is applied to the full image: only separate fog/rain/additional shuttle layers animate. Artwork already painted in the PNG remains static. Pausing, reduced motion and hidden-page behavior are unchanged. Latest browser evidence is in docs/verification/phase-1.1-background/report.md; the earlier vector-scene evidence is historical.

## Global settings — microphase 1.8

Motion settings persist validated reduced/logo booleans in localStorage (glitchos.motion.v1), with safe defaults and session-only fallback on storage errors. System reduction OR user reduction disables background, shuttles, logo and CSS animations/transitions. The logo uses an unconditional still picture source when its preference is off, reduction is active or the page is hidden; the canonical SVG remains the image fallback and normal source. Visibility restores the policy and may restart the logo cycle. Background pause remains independent and session-only. System matchMedia changes apply live. No idle dimming yet (2.3). Browser evidence: docs/verification/phase-1.8/report.md.

## Policy corrente — animazioni fisse, senza controlli

Su richiesta utente rimossi “Movimento e logo” e “Pausa sfondo”: nessun pannello o preferenza modificabile nella Home. Sfondo e logo animati automaticamente quando la pagina è visibile e il sistema non richiede movimento ridotto. Reduced motion e pagina nascosta continuano a fermarli automaticamente. La vecchia chiave localStorage glitchos.motion.v1 è ignorata; le precedenti descrizioni di impostazioni e pausa sono storico, sostituite da questa decisione. Primo input direzionale e Back tornano al rail; frecce tra rail e widget. Evidenze correnti in docs/verification/fixed-motion/.
