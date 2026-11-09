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

## Platform interfaces — implemented in microphase 0.3

Source of truth: `src/platform/contracts.ts`. Platform calls are asynchronous and return `Promise<Result<T>>`, including reads and capability discovery. Expected failures are values, not successful empty results or thrown exceptions.

- `Result<T>` is discriminated by `ok`: success contains `data`, failure contains `error: { code, message }`. Both contain `mode: 'demo' | 'device'`.
- Error codes: `UNSUPPORTED`, `NOT_FOUND`, `INVALID_STATE`, `UNAVAILABLE`.
- `PlatformAdapter` exposes `mode`, `deviceInfo`, `appCatalog`, `appLauncher`, `inputSource`, `smartHome`.
- `deviceInfo.getCapabilities()` returns `Result<Capabilities>` with separate capability entries for catalog, launch, input listing/activation and smart-home listing/control.
- Each capability has `status: 'simulated' | 'supported' | 'unsupported'`; unsupported entries include a user-readable `reason`. Simulated capability support never certifies actual TV support.
- `appCatalog.list()` returns `Result<readonly AppInfo[]>`; `appLauncher.launch(appId)` returns `Result<{ appId: string }>`.
- `inputSource.list()` returns `Result<readonly InputInfo[]>`; `activate(id)` returns `Result<InputInfo>`. Input kind is `hdmi | tv`, with explicit active state.
- `smartHome.listDevices()` returns `Result<readonly SmartHomeDevice[]>`; `setState(id, { on: boolean })` returns the updated device. Initial scope is binary switches only; thermostats and blinds need dedicated contracts in a later phase.
- App, input and smart-home records carry their own `mode`. The UI must preserve provenance and display demo labels; mock apps are not evidence of installed TV applications.

`src/platform/mock/MockPlatformAdapter.ts` implements a local-only simulation with per-instance state, generic demo app names (no third-party logos), demo inputs and switches. Successful commands return demo results; they do not launch apps or control hardware. State resets when the adapter is recreated. Reads and command results return copies to protect internal state; DTOs are readonly in TypeScript.

Constructor options `unsupported` and `failures` configure individual scenarios. Keys correspond to the six capability names; `failures` additionally accepts `getCapabilities`. Unsupported capabilities take precedence over simulated runtime failures. Rejected commands do not mutate state. No network, SDK, credentials, persistence or additional dependencies are involved.

The adapter is not wired to the static scaffold yet. Create one shared instance when platform data is integrated into the UI; recreating it on each render would reset simulated state. Implement actual webOS calls only after verifying public APIs, manifest privileges and device behavior; unsupported functions must show a useful disabled state, not fake success.

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

## Browser shell — implemented in microphase 0.4

- Theme tokens: `src/themes/neon/tokens.css`; local system fonts, semantic palette, sizing, spacing, focus treatment and motion durations. No external font requests.
- `TvShell` provides the structural hierarchy from the approved reference: header, scene space, application zone and three lower widget zones. These are explicitly placeholders without simulated active buttons or real device data.
- The centered 16:9 surface uses CSS sizing (no per-frame React state), 4% horizontal safe margins and 2.5 logical width units vertically. Narrow/portrait windows use natural scrolling flow. Body text scales from ~28px at 1080p to ~56px at 4K.
- `BrandLogo` imports the canonical SVG as an image. A static version is derived from that same source and selected via picture/media for reduced motion, avoiding animated-frame artifacts in external SVG decoding. Image errors show the exact brand text.
- Current backdrop is a local CSS gradient; city layers remain in 1.1. Focus tokens are prepared, but D-pad navigation remains in 1.4; idle dimming remains in 2.3. No idle protection is claimed for this static development screen.
- Browser acceptance evidence and reproduction steps: `docs/verification/phase-0.4.md`, screenshots/metrics alongside it, `scripts/verify-shell.mjs`. Hardware verification remains pending.
