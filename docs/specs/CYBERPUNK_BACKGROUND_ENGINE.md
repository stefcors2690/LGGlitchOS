# Cyberpunk Animated Background Engine — specifica fase 2

Continuità PC: [HANDOFF](../HANDOFF.md) e [START_HERE](../../START_HERE.md). Profili e controlli canonici restano nel motore di produzione, con Balanced attivo; il profilo finale sarà scelto dopo test G5. Il pannello è invece solo Vite dev con opt-in. Le analisi dell'inventario iniziale e le sezioni di pianificazione sono storiche: per file montati e punto di ripresa usare lo stato corrente e il README tecnico.

Stato: **fase2 completata in browser**, tutte le cinque milestone e microfasi2.1–2.10 chiuse; versione locale0.2.0, nessuna pubblicazione. Prossima3.1 — Overlay e Back. Milestone1 base/pioggia,2 nebbia/neon,3 ologramma/particelle/veicoli opzionali off,4 profili/pannello,5 ottimizzazione/integrazione verificate. Roadmap in [ROADMAP.md](../../ROADMAP.md); misure G5 restano rinviate fino a hardware disponibile. Le sezioni progettuali sottostanti documentano anche la progressione storica.

Verifica2.10:135 test/check ed Edge Windows OK; cleanup Canvas immediato e idempotente su errore/contextlost, fallback e recupero, effetti/motore off, sorgente assente/ritorno e navigazione verificati. CityBackdrop/CSS duplicati rimossi; PNG, tarature, profili e UI preservati. Home produzione per5min con risorse/focus stabili, screenshot1080p/4K confrontati e differenze residue nel [rapporto2.10](../verification/phase-2.10/report.md), nessuna piena fedeltà visiva o certificazione webOS dichiarata.

Verifica2.9: scheduler con residuo conservato e delta simulazione separato;134 test/check ed Edge Windows OK, stress profili/resize/slider e Home produzione per5min con risorse stabili. Allocazioni JS transitorie rilevate dal profiler: pooling non implica zero allocazioni della VM/API. Limiti, confronto CSS main thread/Canvas e nuove evidenze nel [rapporto2.9](../verification/phase-2.9/report.md). Nessun cambio al contratto dei profili, tarature o GPU/G5 certificati.

## Obiettivo e vincoli

Trasformare lo sfondo statico approvato di **StefCors GL1tCh 0S** in una città viva, cinematografica, realistica e fluida, tramite React, TypeScript e Canvas 2D, senza video come background principale. Preservare composizione e design Neon City + Netrunner: camera sostanzialmente ferma, magenta/ciano, effetti lenti e localizzati, nessun lampeggiamento continuo, glitch invasivo o ostacolo alla leggibilità delle app. Cicli continui senza stacchi evidenti e transizioni morbide. La scena deve sembrare osservata attraverso una finestra.

Nessuna modifica al sistema operativo LG, root o launcher originale webOS. Non introdurre librerie pesanti senza motivazione tecnica e approvazione secondo AGENTS.md. Non riscrivere componenti funzionanti. Non garantire prestazioni o compatibilità webOS senza prove reali.

## Analisi iniziale e asset

Prima di implementare, leggere AGENTS.md, START_HERE.md, PROJECT_STATUS.md, PROJECT_SPEC.md, ANIMATION_SPEC.md e VISUAL_REFERENCE_GUIDE.md; ispezionare references 00/01. Verificare nuovamente codice, asset e dipendenze.

Inventario alla pianificazione (integrazione aggiornata: 2.1 usa CyberpunkBackgroundEngine al posto del CityBackdrop legacy):

- Home unica: src/app/TvShell.tsx, componenti rail/widget già funzionanti, adapter mock condiviso.
- Background esistente: src/features/background/CityBackdrop.tsx e city.css, immagine **references/background.png** importata da CSS, atmosfera e due navette separate. src/motion/useBackgroundMotion.ts applica riduzione sistema e visibilità pagina.
- Video presente: **assets/cyberpunk-motion-reference.mp4**. Usarlo esclusivamente come riferimento visivo dei movimenti; provenienza Kling non verificata in questa sessione. Nessuna riproduzione come background della Home.
- Runtime: solo React e React DOM. TypeScript strict, Vite, ESLint e Vitest già configurati. Nessuna dipendenza Canvas richiesta per il piano.

Mantenere il PNG originale immutato, 16:9, responsivo Full HD/4K senza distorsioni né camera obbligatoria. Se mancante, percorso configurabile, segnalazione esplicita e fallback; mai sostituirlo con un'immagine arbitraria. Non usare il mockup completo come UI.

## Architettura riutilizzabile

Componente pubblico **CyberpunkBackgroundEngine**, isolato da navigazione, adapter e dati dei widget. Adattare la struttura alle convenzioni esistenti (preferibilmente features/background), senza duplicare motori o policy. Struttura di riferimento del task, non obbligo di un file per effetto:

```text
components/background/
  CyberpunkBackgroundEngine.tsx
  BackgroundCanvas.tsx
  BackgroundImage.tsx
  BackgroundSettings.tsx
engines/background/
  AnimationController.ts
  RainEngine.ts
  FogEngine.ts
  NeonEngine.ts
  HologramEngine.ts
  ParticleEngine.ts
  FlyingVehicleEngine.ts
hooks/
  useAnimationFrame.ts
  usePerformanceMonitor.ts
config/background.config.ts
types/background.types.ts
```

Configurazione centrale tipizzata, ogni effetto attivabile/disattivabile e regolabile indipendentemente. Un controller governa tempo, ciclo di vita, resize e stop; niente rendering React per frame. Integrare progressivamente nella Home mantenendo fallback statico disponibile da subito. Evitare accumulo dei vecchi layer CSS e nuovi effetti equivalenti: ogni effetto migrato sostituisce il precedente.

## Livelli di rendering

1. **Immagine originale:** livello base immutato, cover/fit coerente con scena 16:9, fallback statico sempre disponibile, nessun ridisegno permanente.
2. **Pioggia Canvas 2D:** gocce di dimensioni, velocità, profondità e opacità diverse, lieve vento, alcune gocce vicine più luminose. Movimento naturale e continuo, visibile ma discreto. Evitare semplici linee bianche uniformi che attraversano lo schermo.
3. **Nebbia atmosferica:** simulazione volumetrica principalmente in basso, movimento orizzontale molto lento e ciclico, trasparenza variabile e colori influenzati dai neon. Preferire texture trasparenti e transform CSS efficienti a filtri pesanti; non coprire UI.
4. **Neon e luce:** pulsazioni lievi, luminosità graduale, interferenze brevi occasionali, riflessi e bagliori magenta/ciano. Localizzare con maschere o regioni configurabili sulle insegne appropriate, mai su tutta l'immagine indiscriminatamente.
5. **Ologramma volto destro:** maschera/regione normalizzata, scanline, interferenze digitali brevi, RGB split molto leggero, luminosità e occasionali distorsioni orizzontali esclusivamente nella regione. Mappare coordinate immagine → viewport rispettando crop/resize per non alterare aree vicine.
6. **Particelle:** frammenti digitali, polvere luminosa, scintille lontane o particelle al vento; numero limitato e aspetto discreto.
7. **Veicoli opzionali:** modulo predisposto ma **disattivato inizialmente**, per futuri asset trasparenti. Non duplicare evidentemente i veicoli nel PNG; non spostare oggetti dipinti senza livelli separati e aree ricostruite. Le navette CSS aggiuntive esistenti vanno escluse quando il nuovo motore entra in uso per rispettare il default disattivato.

Tutti i layer decorativi dietro l'intera interfaccia, aria-hidden e pointer-events:none; non coprire logo/widget, non intercettare click o Magic Remote, non modificare focus o causare rerender delle card.

## Configurazione dinamica

Valori di partenza del task, da calibrare visivamente e per costo; non sono misure hardware:

```typescript
// Da definire con tipi espliciti durante 2.1.
export const backgroundConfig = {
  enabled: true,
  rain: { enabled: true, intensity: 65, speed: 1, wind: 0.15 },
  fog: { enabled: true, density: 35, speed: 0.2 },
  neon: { enabled: true, intensity: 70, flicker: true },
  hologram: { enabled: true, glitch: true, glitchFrequency: 0.15 },
  particles: { enabled: true, count: 40 },
  flyingVehicles: { enabled: false }
};
```

Definire unità, limiti, validazione e semantica della frequenza glitch; non lasciare numeri ambigui nel contratto. Configurare sorgente immagine, regioni normalizzate e limiti di rendering. enabled=false arresta l'animazione conservando l'immagine statica.

## Profili prestazionali

| Profilo | Comportamento previsto |
| --- | --- |
| Cinematic | Pioggia dettagliata, nebbia completa, neon e ologrammi dinamici, particelle attive. |
| Balanced | Meno particelle, pioggia semplificata, nebbia meno complessa, neon/ologrammi essenziali. Default sul TV fino a misure reali; usare anche nel browser come baseline prudente. |
| Eco | Animazioni minime, pioggia lieve o disattivata, nessun effetto pesante, statico sempre disponibile. |

Prestazione iniziale obiettivo **30 fps sul TV**, non garanzia. Limitare DPR effettivo e risoluzione Canvas; non confondere output UI 4K e buffer effetti 4K. requestAnimationFrame, delta temporale controllato, niente allocazioni continue, pool riutilizzati. Gestire resize, cambio profilo e durata prolungata senza crescita incontrollata di risorse. Monitor leggero senza aggiornamenti React per frame; non introdurre auto-degrado imprevedibile senza definirne criteri.

Arrestare frame e attività decorative a pagina nascosta e con prefers-reduced-motion, riprendere senza salti temporali. Cleanup di RAF, listener e risorse a smontaggio. Canvas assente/context non disponibile/errore: immagine statica, Home utilizzabile. Con effetti disabilitati nessun lavoro residuo non necessario. Mantenere la policy del logo separata già approvata, rispettando riduzione e visibilità.

## Pannello di sviluppo

BackgroundSettings per intensità/velocità pioggia, densità nebbia, luminosità neon, glitch ologramma, numero particelle, profilo e reset ai default. Aggiornamento live, valori validati. Solo sviluppo o opzione esplicita di diagnostica; mai apertura automatica o comparsa nella Home definitiva. Questo pannello tecnico è autorizzato dal nuovo task e **non reintroduce** Movimento e logo/Pausa sfondo rimossi dalla UI finale. Accessibile senza compromettere la navigazione Home; verificare assenza nella build ordinaria di produzione.

## Milestone e microfasi

| Milestone richiesta | Microfasi roadmap | Esito |
| --- | --- | --- |
| 1 — Architettura, originale e pioggia | 2.1, 2.2 | Modulo montabile, fallback/coordinate/config e pioggia verificati. |
| 2 — Nebbia, neon e illuminazione | 2.3, 2.4 | Atmosfera e luci localizzate calibrate. |
| 3 — Ologrammi e particelle | 2.5, 2.6 | Volto mascherato, particelle e veicoli predisposti off. |
| 4 — Pannello e profili | 2.7, 2.8 | Profili e diagnostica live solo sviluppo. |
| 5 — Ottimizzazione, test e integrazione definitiva | 2.9, 2.10 | Budget/cleanup/stabilità e Home integrata senza regressioni. |

Ogni microfase: criteri della roadmap, controlli disponibili, correzione errori, riepilogo di edit/test/limiti e aggiornamento contesto. A fine milestone eseguire controlli integrati e confrontare visivamente con originale/references; registrare differenze residue e tempi di prova.

## Validazione e consegna

- TypeScript, lint, test e build produzione; nessun errore console osservato durante prove registrate.
- Test appropriati per configurazione/profili, coordinate, controller, cleanup RAF, resize, stop/resume, riduzione sistema, effetti disabilitati e Canvas indisponibile.
- Chrome: Home D-pad/Back/OK e focus stabili durante animazione, nessuna interferenza input; resize 1080p/4K/mobile; assenza pannello nella produzione normale.
- Prova prolungata con durata registrata, osservazione frame time/risorse, cleanup e nessun loop duplicato; dichiarare misure effettive, non stimare webOS da Chrome.
- Screenshot e brevi acquisizioni se disponibili per valutare pioggia/neon/ologramma, con Home e sfondo originale confrontabili. Asset locali e provenienza documentata.
- Documentazione tecnica, API/config, profili, fallback, comandi di verifica, risultati e limiti aggiornati. Mantenere README deploy TV per la fase 4.

Risultato atteso a fine fase 2: motore modulare integrato, pioggia realistica, nebbia, neon, glitch localizzato, particelle, profili e pannello tecnico, senza cambiare la composizione approvata. Nessun test webOS dichiarato fino a prove su TV. Accesso/modello/firmware restano gate hardware della fase 4.


## Stato implementativo 2.7

Profili applicati da resolveBackgroundConfig ai controlli canonici, senza mutarli. Balanced conserva gli effetti leggeri già approvati; Cinematic aumenta quantità pioggia/particelle (moltiplicatori1.4/2), Eco sceglie il fallback statico completo. Nessuna nuova complessità CSS o glitch più forte. Entrambi i profili animati mantengono budget Full HD/DPR1/target30fps, modificabili verso il basso; dettagli e limiti nel README tecnico background. Monitor su finestre2s senza RAF extra, solo costo CPU/cadenza draw Canvas, nessuna certificazione G5 o auto-degrado. Fixture tecnica separata dalla Home e assente dal bundle ordinario; pannello live ancora2.8.


## Stato implementativo2.8

BackgroundSettings e Workbench caricati solo con Vite dev e opt-in ?backgroundDebug=1; pannello inizialmente chiuso, escluso dal bundle e CSS di produzione ordinaria. Controlli live e reset implementati con validazione, valori canonici/effettivi distinti e nessuna persistenza. Dialog non modale, input nativi Tab/frecce, Escape/Back torna alla prima app. Nessun flag produzione diagnostico introdotto. Milestone4 verificata in Chrome con profili/cleanup/pannello insieme; prossimo2.9. Dettagli in README tecnico e rapporto2.8.
