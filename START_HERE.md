# START HERE — StefCors GL1tCh 0S (v3)

1. Extract this entire archive into a fresh project folder. Keep `references/` and `assets/branding/`.
2. Open the folder in VS Code with Codex Agent mode.
3. Paste this prompt:

> Read AGENTS.md, PROJECT_SPEC.md, ROADMAP.md, BRAND_IDENTITY.md, VISUAL_REFERENCE_GUIDE.md and ANIMATION_SPEC.md. Inspect every image in references/, prioritizing 00_brand_home.png for current branding and 01_home_approved.png for layout. Use assets/branding/StefCors_GL1tCh_0S_Glitch_Slow.svg as the official animated logo. Implement Phase 0 and an interactive Phase 1 in React + TypeScript + Vite with a mock webOS adapter, keyboard/D-pad navigation, real React components, original or properly licensed background assets, and reduced-motion support. Keep authentic third-party app logos unchanged, sourced legally, with placeholders until assets are available. Test the build and document what remains unverified on LG G5. Do not modify firmware, root the TV, intercept Home, or implement boot overrides yet.

4. For the logo animation, open `assets/branding/preview.html` in Chrome/Edge and observe at least two 9-second cycles.
5. Use `npm install` and `npm run dev` after Codex scaffolds the app.

Note: the complete Home replacement and root compatibility remain unverified pending the exact G5 firmware version.
