# City assets — current selection

On 2026-11-09 the user supplied and explicitly selected `references/background.png` as the actual background. It is imported by src/features/background/background.config.ts and bundled by Vite, without copying or modifying the source. External origin/license has not been independently verified; do not attribute this PNG to the vector generator.

The procedural city-distant.svg and city-foreground.svg below are superseded and no longer imported in the UI. shuttle.svg is legacy and is not mounted by the current Home. Craft already painted into the PNG are static. The generator remains for reproducibility of the legacy vectors and shuttle; it does not generate or alter the selected PNG.

## Legacy procedural assets and shuttle

All three SVGs are original vector artwork created for StefCors GL1tCh 0S in this repository on 2026-11-09. No external images, fonts, third-party marks, film art, traced mockup pixels, or downloaded models are used.

- city-distant.svg: night sky, moon and procedural skyline.
- city-foreground.svg: framing towers, elevated edge and wet-surface reflections.
- shuttle.svg: original flying transport silhouette and restrained engine trail.

Reproducible source: `python3 scripts/generate-city.py` (Python standard library, deterministic seed). SVGs are committed and require no Python at app runtime or during npm build. Keep generated SVGs and generator synchronized when editing.

CSS handles motion independently of the static artwork. These SVGs themselves contain no animations or scripts. The former CSS backdrop is historical. The current engine respects system reduced motion/document visibility and provides a gradient fallback; no manual pause is exposed in the final Home. Background state is fictional decorative scenery, never live weather or TV data.

For the current renderer, optional vehicle module and transfer instructions see [background README](../../features/background/README.md) and [HANDOFF](../../../docs/HANDOFF.md). No generated city or shuttle asset should replace the approved PNG during transfer.
