# StefCors GL1tCh 0S — Product & Technical Specification

## Vision
A cinematic, responsive, cyberpunk custom Home experience for an LG OLED G5. Approved visual direction: **Neon City + Netrunner**, 16:9, holographic glass panels, rain-soaked futuristic skyline, cyan/magenta highlights, smooth transitions, accessible TV focus states. The approved concept image is a visual reference, **not** a source of functional behavior or assets.

## Core objective
Ultimately replace the stock webOS Home experience, including Home button behavior and startup, **only if confirmed feasible for the exact TV firmware**. No root, system hooks, firmware modification, or privileged operations in the initial phases. Do not claim that an ordinary webOS application can replace the Home button or autostart via official public APIs.

## Target and constraints
- LG OLED G5; firmware and webOS versions **unknown** until inspected on the TV.
- Primary canvas 3840x2160 16:9; design in logical units and scale cleanly to 1920x1080.
- Use React + TypeScript + Vite for the UI, with a webOS packaging layer when supported.
- Primary interaction: LG Magic Remote D-pad, OK, Back, and pointer where supported. Never require touch or mouse.
- Maintain 60fps where practical; gracefully degrade motion and resolution based on measured hardware performance.
- OLED-friendly idle dimming and motion reduction; avoid persistent bright static elements.
- No remote tracking, telemetry, or external dependencies without explicit approval.

## Visual design
- Background: layered animated night city, rainfall and parallax; optional optimized local looped video, with static fallback.
- Header: exact-case StefCors GL1tCh 0S wordmark, Home / App / Ingressi / Domotica / Impostazioni, clock and weather (weather optional; don't fabricate data).
- Main app rail: large tiles, active tile luminous magenta/cyan focus border, depth, scale and glow with tasteful motion.
- Lower widgets: Continua a guardare (mock data until real integration is possible), HDMI inputs (mock until capability tested), Home Assistant controls (mock until configured).
- Motion: cinematic but fluid, 180–350ms focus transitions, 400–700ms section transitions; respect reduced motion; no unskippable startup animation.
- Theme tokens: palette, typography, imagery, sound, transitions, focus treatment. Keep themes data-driven so fantasy themes could be added later.
- Use original/licensed visual assets. Third-party app logos only where legally appropriate; no copyrighted film art bundled without license.

## Architecture
Suggested folders:
```
src/
  app/              # app shell, routes, providers
  components/       # reusable UI and widgets
  features/         # apps, inputs, home, settings, smart-home
  navigation/       # remote key map, focus graph, pointer handling
  motion/           # animation policies and effects
  themes/neon/      # tokens and theme components
  platform/         # interfaces, mock adapter, webOS adapter
  assets/           # licensed/original assets
  styles/           # responsive TV-safe CSS
  tests/
webos/             # manifests/packaging after verification
scripts/
```

## Platform interfaces (initial proposal)
- `AppCatalog.list(): Promise<AppInfo[]>`
- `AppLauncher.launch(appId: string): Promise<Result>`
- `InputSource.list(): Promise<InputInfo[]>`
- `InputSource.activate(id: string): Promise<Result>`
- `DeviceInfo.getCapabilities(): Promise<Capabilities>`
- `SmartHome.listDevices()/setState(...)` (optional integration, never embed credentials in frontend)
Implement `MockPlatformAdapter` first. Implement actual webOS calls only after confirming public APIs, manifest privileges and device behavior; unsupported functions must show a useful disabled state, not fake success.

## Remote navigation acceptance
- D-pad cycles predictably among top nav, app rail and lower widgets; no traps.
- Focus always visible and stays consistent when UI rerenders.
- OK activates focused tile; Back closes overlays/returns to prior section.
- Pointer hover and click work when available without breaking D-pad focus.
- Long labels truncate or wrap without overflow; 10-foot UI readable from couch.

## Performance & reliability
- No per-frame React state updates for background animation.
- Prefer CSS transforms and opacity; use canvas/WebGL only when benchmarks justify them.
- Preload critical assets; defer secondary widgets; fallback for video decode failure.
- Local mock data; network timeouts and offline states for integrations.
- No startup dependencies on external APIs.
- Unit tests for navigation and adapters; component tests for widgets; manual TV test matrix.

## Safety boundary for system replacement
- Treat root feasibility as **unknown**. Require exact firmware/webOS version and trusted current research before any implementation.
- Never run exploits, patch system partitions, disable integrity protections, install boot hooks, or remap remote system keys without separate user approval and documented rollback plan.
- Keep stock Home untouched until a verified recovery path exists.

## MVP definition
A runnable desktop preview of the approved cyberpunk Home with animated background, keyboard-based remote simulation, focus navigation, functional internal sections, mock apps/inputs/widgets, settings for reduced motion, and clean modular architecture. Include build, lint, tests, and setup instructions.

## Non-goals for MVP
Root, privileged autostart, actual Home button interception, DRM playback integration, accurate cross-app continue-watching, unverified third-party app launching, real smart-home device control.

## Integrated concept art
See `VISUAL_REFERENCE_GUIDE.md` and the four local PNG files in `references/`. `01_home_approved.png` is authoritative for the initial visual implementation; the other images illustrate boot, focus, and alternative HUD details.


## v3 addendum — animated logo
Read `ANIMATION_SPEC.md`; use `assets/branding/StefCors_GL1tCh_0S_Glitch_Slow.svg` as the canonical brand asset. The previous NEON OS wording is legacy and must not appear in the shipped UI. Keep original application logos sourced from official/licensed assets or the TV where permitted; never generate counterfeit app logos.
