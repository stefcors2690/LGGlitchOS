# Verifica 1.1 — Città a livelli e navette

> Rapporto storico della prima scena vettoriale, sostituita su richiesta utente da `references/background.png`. Per il risultato attuale e gli screenshot aggiornati leggere la [correzione 1.1](../phase-1.1-background/report.md).

Data: 2026-11-09. Chrome locale headless sulla build di produzione, Vite preview su 127.0.0.1:5187. Nessuna prova su TV LG.

## Realizzato

Due skyline SVG originali con profondità e riflessi stilizzati, cielo notturno/luna, foschia, pioggia leggera e navette originali con due rotte sfalsate. Non è uno sfondo fotografico o il mockup appiattito: asset statici e animazioni sono separati dalla UI React. Provenienza e generatore in src/assets/city/README.md e scripts/generate-city.py.

Le navette usano cicli 43s/67s con lunghi intervalli di invisibilità; effetti su transform/opacity e nessun aggiornamento React per frame. Pioggia e navette scompaiono quando si ferma lo sfondo, lasciando la città. Il fondo a gradiente resta disponibile se gli SVG falliscono.

## Controlli superati

| Verifica | Risultato |
| --- | --- |
| npm run check | Lint, typecheck, 29 test e build riusciti |
| 1920×1080 | Nessun overflow; margini e zone widget preservati |
| 3840×2160 | Nessun overflow; testo e proporzioni scalano correttamente |
| 390×844 | Nessun overflow orizzontale; scorrimento verticale previsto |
| Asset città e navette | Tutte le quattro istanze decodificate dal browser |
| Reduced motion | Città ferma, controllo disabilitato, animazioni decorative non in esecuzione |
| Pausa da tastiera | Focus sul pulsante e Invio fermano tutte le animazioni dello sfondo |
| Ripresa | Click riattiva la scena |
| visibilitychange | Proprietà hidden emulata ed evento inviato: pausa e ripresa verificate |
| Navette | Timeline avanza; entrambe le finestre di volo campionate con opacity visibile |
| Fallback asset mancanti | URL SVG sostituiti con risorsa mancante: gradiente di base e UI ancora presenti |
| Logo | Fallback testuale e verifiche reduced motion/timeline standalone della 0.4 ancora superate |

Ispezionati screenshot 1080p, 4K, finestra stretta e fotogramma dei voli: testo su sovrapposizioni scure, controlli separati dalla scena. La scena ha pointer-events none ed è aria-hidden. Non si certifica qui un audit accessibilità completo.

## Evidenze

- [Città statica 1080p, movimento ridotto](shell-1920x1080.png)
- [Città statica 4K, movimento ridotto](shell-3840x2160.png)
- [Fallback finestra stretta](shell-390x844.png)
- [Fotogramma navette](city-flight-1920x1080.png)
- [Misure e risultati automatici](shell-metrics.json)

Il fotogramma dei voli è campionato sospendendo le timeline e portandole nel ciclo attivo; non dimostra una registrazione completa dei 43/67 secondi. Il controllo dell'avanzamento della timeline è distinto dallo screenshot. La navetta lontana è volutamente piccola e attenuata dalla profondità e dallo scrim sinistro.

## Riproduzione

```bash
npm run check
npm run preview -- --host 127.0.0.1 --port 5187 --strictPort
# Secondo terminale, con Chrome locale disponibile:
node scripts/verify-shell.mjs
```

Lo script salva qui le evidenze per default. CHROME_PATH configura l'eseguibile, SHELL_URL la preview locale, VERIFY_OUTPUT una cartella alternativa. Profilo Chrome temporaneo separato da quello dell'utente. Nessuna dipendenza aggiunta. Per rigenerare gli asset usare python3 scripts/generate-city.py; il build npm usa gli SVG già presenti.

## Limiti e prossimo lavoro

Resa stilizzata vettoriale; nessun video o dettaglio fotorealistico. Prestazioni sul G5, 60fps, leggibilità da divano e lifecycle webOS non misurati. visibilitychange è collaudato mediante emulazione, non un cambio stato hardware. Le preferenze manuali non persistono su reload. La pausa sfondo non ferma il logo; l'opzione di sistema reduced motion lo ferma tramite la sua policy separata.

Header e widget sono ancora strutturali. D-pad in 1.4, impostazioni complete in 1.8, pausa per inattività e dimming OLED in 2.3. Prossima microfase: 1.2.
