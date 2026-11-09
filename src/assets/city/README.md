# City assets — current selection

On 2026-11-09 the user supplied and explicitly selected `references/background.png` as the actual background. It is imported directly by city.css and bundled by Vite, without copying or modifying the source. External origin/license has not been independently verified; do not attribute this PNG to the vector generator.

The procedural city-distant.svg and city-foreground.svg below are superseded and no longer imported in the UI. shuttle.svg remains active for additional animated craft. Craft already painted into the PNG are static. The generator remains for reproducibility of the legacy vectors and active shuttle; it does not generate or alter the selected PNG.

## Legacy procedural assets and active shuttle

All three SVGs are original vector artwork created for StefCors GL1tCh 0S in this repository on 2026-11-09. No external images, fonts, third-party marks, film art, traced mockup pixels, or downloaded models are used.

- city-distant.svg: night sky, moon and procedural skyline.
- city-foreground.svg: framing towers, elevated edge and wet-surface reflections.
- shuttle.svg: original flying transport silhouette and restrained engine trail.

Reproducible source: `python3 scripts/generate-city.py` (Python standard library, deterministic seed). SVGs are committed and require no Python at app runtime or during npm build. Keep generated SVGs and generator synchronized when editing.

CSS handles motion independently of the static artwork. These SVGs themselves contain no animations or scripts. Reduced motion or manual pause retains the static city; CSS gradients remain if the image assets fail. Background state is fictional decorative scenery, never live weather or TV data.
