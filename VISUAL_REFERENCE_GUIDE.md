# StefCors GL1tCh 0S — Visual Reference Guide

All images in `references/` are concept art generated for this project, not production-ready application screens or editable component layouts. Recreate UI as accessible React components, not a flattened screenshot. Images are reference assets; do not hardcode sample weather, time, app availability, watch progress, or smart-home state as real data.

## Priority and screens

1. `references/00_brand_home.png` — **CURRENT BRAND REFERENCE**. This shows the approved naming and brand treatment, original recognizable app marks and the overall composition. Use it as the primary naming and logo reference.
2. `references/01_home_approved.png` — **APPROVED PRIMARY DESIGN**. This is the canonical layout and aesthetic. Preserve its overall hierarchy: top navigation, immersive city background, app carousel, and three lower widget zones. Use the visual as the main reference for implementation. The mockup contains fictional/sample values.
3. `references/02_boot_sequence.png` — Concept for an optional, **skippable** startup animation. This does not imply control of the physical TV boot process or automatic launch on webOS. Use only when app launches.
4. `references/03_app_focus.png` — Focus and carousel interaction inspiration: selected tile lifts, grows slightly, holographic platform/rings appear, and neighboring tiles remain readable. Avoid excessive movement and focus loss.
5. `references/04_home_alternative.png` — Alternative composition and HUD/widget treatments. Secondary inspiration; never override the approved primary layout without asking.

## Visual implementation requirements

- Design at 16:9 and test at 1920x1080 and 3840x2160, including TV-safe margins and readable 10-foot typography.
- Use dark midnight blues and near-black surfaces; cyan and magenta highlights; restrained glow, atmospheric rain and subtle city parallax.
- Separate visual layers: city backdrop, optional weather/rain effect, decorative HUD, semantic UI components, focus layer.
- App rail must have deterministic keyboard/D-pad focus and accessible names. Support Back/Escape and Enter/OK.
- Preserve clear hierarchy over the busy backdrop with contrast overlays; don't put critical labels directly on bright signage.
- Animation target: fluid on real TV hardware, progressive enhancement, reduced-motion and idle dimming.
- Reuse original concept images as development placeholders if helpful, but for a convincing animated city, create separated background layers or original licensed loops. Never animate the whole screenshot as if it were an interactive UI.
- The sample logo/wordmark and app logos are visual references, not guaranteed exact vector assets. Rebuild with components or legally usable assets.

## Acceptance checkpoints

- Home structure visually resembles approved reference rather than a generic dashboard.
- Focus states are clearly legible and function with D-pad alone.
- Background animations do not interfere with interaction and can be disabled.
- No fabricated live TV/device data or unsupported app launch promises.
- Browser mock works without root; webOS system replacement remains an independent feasibility track.

## Brand and application icon policy
- The exact, case-sensitive project display name is **StefCors GL1tCh 0S** (digit 1 in GL1tCh and digit 0 in 0S). Never silently normalize it to Glitch OS or Neon OS.
- Create an original vector/SVG brand symbol inspired by digital interference and an angular S/C monogram; do not trace generated mockup pixels. The brand mark may be animated using lightweight CSS/SVG effects.
- Keep brand assets separate from third-party app assets. Never apply a glitch filter, recolor, redrawing, or stylized font to official app logos. Animate the containing card, glow and focus frame instead.
- Prefer installed webOS app metadata/icon assets where publicly available; otherwise use official brand assets with appropriate usage rights and provenance. Do not package AI-generated approximations as official logos. Provide a neutral fallback icon if an authentic asset cannot be obtained.
- Demo mockups are illustrative: only show an app as installed when the adapter confirms it.
- The boot image still says the old placeholder name: it is *composition reference only*. The implementation must show StefCors GL1tCh 0S everywhere.


## v3 addendum — animated logo
Read `ANIMATION_SPEC.md`; use `assets/branding/StefCors_GL1tCh_0S_Glitch_Slow.svg` as the canonical brand asset. The previous NEON OS wording is legacy and must not appear in the shipped UI. Keep original application logos sourced from official/licensed assets or the TV where permitted; never generate counterfeit app logos.
