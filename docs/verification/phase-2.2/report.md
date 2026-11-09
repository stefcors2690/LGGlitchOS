# Verifica 2.2 — Pioggia cinematografica Canvas

Data: 2026-11-09. Milestone 1 (architettura, originale e pioggia) completata. Ambiente Chrome headless/macOS; nessun collaudo G5.

## Implementazione

RainEngine usa 208 gocce al default intensity=65, pool Float32Array fisso e tre sprite sfumate blu/ciano create una volta. Posizioni normalizzate, profondità che varia lunghezza/velocità/opacità, vento leggero, riciclo invece di nuove allocazioni per frame. Niente oggetti React per frame. BackgroundCanvas collega AnimationController, ResizeObserver/window resize, stop/dispose e fallback. Nessun effetto CSS duplicato, video o navetta aggiuntiva. PNG originale e scrim immutati.

Buffer limitato a 1920×1080 oltre al tetto DPR, indipendente dalla UI; target 30fps non garantito su hardware. Reduced motion/pagina nascosta fermano RAF e nascondono/puliscono Canvas; ripresa ricrea pool senza delta del tempo nascosto. Context assente, contextlost o errore draw fermano l'effetto preservando la scena statica. Cleanup rimuove listener/observer, cancella RAF e libera dimensioni sprite.

## Controlli eseguiti

- `npm run check`: lint senza warning, TypeScript strict, 95 test e build OK. `npm run lint` rieseguito dopo aggiornamento script Chrome.
- Quattro test nuovi: cap buffer Full HD/DPR, pool e tre profondità, resize senza cambio numero gocce, disabled/speed zero/intensity zero, riciclo e coordinate finite durante 1000 step da 100ms simulati. Quest'ultima è simulazione, non test prolungato sul TV.
- `node scripts/verify-shell.mjs`: Home 1080p/4K/mobile, nessun overflow TV, percorsi D-pad/Enter/Back dei widget preservati. Effetti off con sistema reduce.
- Senza riduzione: Canvas running e contenuto pixel differente dopo 250ms; focus invariato durante ulteriore secondo di animazione. Screenshot rain-1920x1080.png.
- Resize viewport 3840×2160 a DPR 2: buffer 1920×1080 confermato. Screenshot rain-3840x2160.png usa pixel fisici 7680×4320 a causa del DPR 2: non implica rendering effetti a tale risoluzione.
- Visibilità emulata: stop con conteggio frame positivo registrato, ripresa running. Riduzione live ferma Canvas e logo.
- Canvas non disponibile emulato con getContext=null prima del caricamento: data-state=unavailable e PNG decodificato; Home ancora navigabile. Errore immagine indotto separatamente mantiene gradiente/avviso. La richiesta mancante intenzionale non equivale a una console pulita.
- `git diff --check`: OK. Nessun test prestazionale G5 o garanzia 4K/30fps.

## Confronto visivo

Ispezionati rain-1920x1080.png e rain-3840x2160.png, confrontati con references 00/01 e base Home 2.1. Camera/crop/composizione restano fermi; scie sottili colorate e tenui sopra la scena, sotto UI e scrim, senza bianco uniforme o lampi. Pioggia volutamente discreta: la dinamica è confermata dal confronto pixel nel tempo, mentre gli screenshot documentano una singola fase. Le gocce dipinte nel PNG non si muovono.

Differenze residue note: header/menu modificati per scelta utente, marchio canonico diverso dal concept, fallback app/demo, due switch domotici; nebbia/neon/ologramma/particelle ancora off. Nessuna fedeltà animata completa dichiarata. Nebbia futura e calibrazione di insieme seguiranno nelle rispettive microfasi.

## Ripresa e limiti

Prossima 2.3 — Nebbia atmosferica. Nessuna dipendenza nuova, nessun servizio o API TV. Profili effettivi in 2.7, pannello tecnico in 2.8, misure/stabilità prolungata in 2.9–2.10. La prova visibilità usa eventi emulati, non lifecycle webOS; durata prolungata reale e prestazioni da divano non verificate.
