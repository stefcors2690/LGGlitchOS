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

## Approved background asset — user update 2026-11-09

Use `references/background.png` as the actual city backdrop, explicitly supplied and selected by the user. It contains scenery without UI controls and is therefore an exception to the reference-only treatment of the five concept screens. Import it directly through Vite from the background CSS; preserve the source image unchanged. Use cover/center framing for the 16:9 surface. Do not replace it with procedural buildings or claim it was generated by this repository.

Keep UI, rain/mist and additional animated shuttles separate. Ships, rain streaks and reflections already painted into the PNG remain static; this is not a layered source image. Avoid animating the full image to imply separately moving objects. Dark contrast overlays may be used without obscuring the approved art excessively. Asset rights/provenance beyond user supply have not been independently established.

## Priorità visiva esplicita — 2026-11-09

L’utente richiede **massima fedeltà visiva ai riferimenti**, non una reinterpretazione o un dashboard generico. Branding: `references/00_brand_home.png`; composizione/layout: `references/01_home_approved.png`; sfondo effettivo: `references/background.png`. Gli altri mockup restano secondari e non devono introdurre una direzione diversa.

Riprodurre gerarchia, proporzioni, posizioni, densità, margini, tipografia leggibile, cornici olografiche, glow cyan/magenta e trattamento del focus. Usare componenti reali e loghi terzi autentici o fallback neutri; non incorporare il mockup completo come UI e non presentare i dati dei mockup come reali.

Prima di completare una fase visiva, confrontare gli screenshot 1080p/4K con i riferimenti prioritari e documentare differenze residue e verifiche. Le funzionalità di fasi future possono restare incomplete, ma lo stile e la geometria degli elementi già implementati devono convergere al riferimento. Non dichiarare fedeltà completa finché restano differenze evidenti; evitare semplificazioni o cambi di direzione non richiesti. L’attuale shell/header è una base funzionante e richiede ancora allineamento visivo al riferimento.

## Pulizia sezioni — feedback browser

Su richiesta utente, tutte le sezioni mantengono lo sfondo libero come Home: eyebrow, titoli promozionali, descrizioni introduttive e nota decorativa della scena non sono visibili. Titoli e descrizioni rimangono accessibili; menu, controllo movimento, pannelli funzionali e badge Demo restano visibili.

## Home unica — modifica layout approvata dall’utente

La navigazione superiore per sezioni è stata eliminata su richiesta utente. Header con solo brand e orologio; app, Continua a guardare, ingressi e domotica sono sempre nella Home. Il controllo espandibile “Movimento e logo” contiene le preferenze esistenti. Frecce percorrono controls → rail → widgets → settings (solo se aperte); primo input direzionale e Back/Escape portano alla prima app, Back richiude anche le preferenze. Mantiene badge Demo, sfondo e componenti reali. Questa decisione sostituisce le precedenti indicazioni sulle cinque sezioni; i riferimenti 00/01 restano guida estetica, con eccezione esplicita del menu rimosso. Verifiche correnti: scripts/verify-shell.mjs; vecchio collaudo sezioni conservato in scripts/verify-shell-sections-legacy.mjs, non compatibile con UI attuale.

## Policy corrente — animazioni fisse, senza controlli

Su richiesta utente rimossi “Movimento e logo” e “Pausa sfondo”: nessun pannello o preferenza modificabile nella Home. Sfondo e logo animati automaticamente quando la pagina è visibile e il sistema non richiede movimento ridotto. Reduced motion e pagina nascosta continuano a fermarli automaticamente. La vecchia chiave localStorage glitchos.motion.v1 è ignorata; le precedenti descrizioni di impostazioni e pausa sono storico, sostituite da questa decisione. Primo input direzionale e Back tornano al rail; frecce tra rail e widget. Evidenze correnti in docs/verification/fixed-motion/.
