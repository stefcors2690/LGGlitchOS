# Microfase 2.10 — Integrazione definitiva e validazione

Data: 2026-11-09. Base Git `7d39aea` con lavoro locale della 2.9 presente e preservato. Nessun commit, push, deploy o accesso TV. Questa verifica chiude il motore browser soltanto dopo tutti i criteri registrati sotto.

## Interventi

- Rimossi `src/features/background/CityBackdrop.tsx` e `city.css`: vecchia implementazione autonoma già non importata. Rimangono gli asset SVG originali e il generatore con provenienza, fuori dal bundle; `FlyingVehicleEngine` resta la predisposizione opzionale prevista, non montata. Nessuna pulizia di sezioni/preferenze di altre fasi.
- `BackgroundCanvas`: cleanup idempotente e immediato in caso di errore setup/draw o evento contextlost; cancella RAF, scollega listener/observer, azzera buffer e sprite. Un errore di clearRect nel cleanup non impedisce il rilascio. Stato `unavailable` conservato e buffer 1×1 anche dopo resize; nessun retry automatico. Un cambio configurazione o remount può creare un nuovo effetto.
- Fixture di sviluppo: toggles per tutti gli effetti, motore e sorgente immagine. Il collaudo verifica assenza/ritorno dell'immagine, disattivazione senza Canvas/layer, perdita contesto simulata ed errore draw/cleanup iniettato, risorse residue e recupero via profilo. Canvas assente verificato anche con navigazione e ripresa Demo da tastiera.
- Output browser predefinito ora `docs/verification/browser-<timestamp>`: nessuna sovrascrittura implicita della vecchia phase-2.8. VERIFY_OUTPUT esplicito resta disponibile; usare directory nuove.
- Aggiunto test significativo della composizione con tutti gli effetti disabilitati: una sola immagine/scrim, nessun Canvas o duplicato legacy.
- Versione applicativa locale allineata a **0.2.0** in package.json, due campi root del lockfile e README, secondo la convenzione fase2→0.2.0. Nessuna dipendenza aggiornata, tag o release creati.

Nessuna variazione di layout, tarature, maschere, PNG originale, logo, profili, adapter o policy sistema/visibilità. Risoluzione dei controlli canonici una volta al confine del motore; nessuna dipendenza aggiunta. Il pannello resta solo dev con opt-in, Balanced resta anche in produzione. Il fallback mantiene PNG e layer CSS indipendenti quando fallisce il Canvas; immagine assente mantiene gradiente/avviso e rimuove i layer mappati. Non si introduce un degrado automatico di profilo.

## Verifiche e ambiente

Windows 11 Pro N 10.0.26300 x64, Intel i9-9900KF, Node24.22.2/npm11.19.1, Edge156.0.4314.58 headless con GPU disattivata. `npm run check`: **135 test in 20 file**, lint, TypeScript e build superati. Lint dello script e controllo diff ripetuti dopo gli ultimi cambi del collaudo.

Primo run browser: test interrotto sul confronto identità immagine dopo un unmount/remount intenzionale, perché il probe conservava il riferimento precedente allo smontaggio. Corretto il riferimento del test al nuovo mount; non era una sostituzione inattesa della UI. Le catture parziali del primo tentativo sono nella radice di questa cartella e non sono evidenza di accettazione completata.

Run finale superato, evidenze in `final/shell-metrics.json` e `final/stability.json`:

- Home produzione 1080p/4K/mobile, D-pad/OK/Back e focus, pioggia/nebbia/neon/ologramma/particelle, resize, reduced motion e visibilità, Canvas assente e immagine mancante: OK. `runtimeErrors=[]`.
- Profili e pannello dev opt-in: OK; produzione ignora query e non contiene pannello/CSS/fixture. Reset, chiusura, tastiera e reload del pannello verificati. Unica immagine originale, nessun video o scena legacy montata.
- Contextlost sintetico ed errore draw/cleanup: subito 0 RAF, 0 sprite e buffer 1×1; 2 listener resize/observer residui appartengono ai layer CSS neon/ologramma, non al Canvas. Resize non ripristina il buffer fallito. PNG preservato e recupero via cambio profilo riuscito.
- Tutti gli effetti off oppure motore off: 0 Canvas/RAF/sprite/listener resize/observer del motore, stesso nodo img. Sorgente immagine assente/ritorno: avviso/gradiente, layer mappati rimossi e ripristino riuscito.
- Stress: 30 transizioni profilo con resize1080p/4K-DPR2 e 120 variazioni slider in 5958 ms, senza duplicazioni. Canvas sempre entro Full HD; cleanup Eco/unmount verificato.
- **Home produzione per 300.035 ms**, Balanced/1080p/DPR1: 30 campioni **29,99–30,02 draw/s**, costo CPU medio Canvas 0,331–0,392 ms/draw, picco osservato 0,8 ms. Sempre 1 RAF/Canvas, 5 sprite, 3 listener resize e 3 observer; focus conservato e D-pad/Back finali OK.
- Heap dopo GC iniziale/finale **14.022.416→14.062.660 byte** (+40.244, circa0,29%); campioni14.051.180–14.212.120 byte. Nodi CDP1975→1975, listener1211→1211. Nessuna crescita incontrollata osservata nella durata registrata.
- Finestre CSS circa10s: scena completa TaskDuration1,5631s / ScriptDuration0,1338s / RecalcStyleDuration0,1080s; layer CSS nascosti1,1412s /0,1288s /0s. LayoutDuration0 in entrambe; costo medio draw0,380/0,368ms. Misure main thread locali, non costo GPU o isolamento causale completo.
- `npm run check` ripetuto sulla versione **0.2.0**:135 test, lint, TypeScript e build OK. Hash bundle JS `index-B62capiC.js` invariato rispetto al codice sottoposto al collaudo browser; la modifica della versione riguarda i metadati. Package e due versioni root del lockfile allineati.

## Riproduzione

Dalla radice, `npm run check`; avviare in terminali distinti:

```powershell
npm run dev -- --host 127.0.0.1 --port 5188 --strictPort
npm run preview -- --host 127.0.0.1 --port 5187 --strictPort
```

Server avviati in questa sessione tramite gli equivalenti entry point locali `node node_modules/vite/bin/vite.js` e `node node_modules/vite/bin/vite.js preview` con gli stessi argomenti. Poi:

```powershell
$env:CHROME_PATH = 'C:\Program Files (x86)\Microsoft\Edge\Application\msedge.exe'
$env:PROFILE_TEST_URL = 'http://127.0.0.1:5188/scripts/fixtures/background-profiles.html'
$env:BACKGROUND_TEST_URL = 'http://127.0.0.1:5188/'
$env:VERIFY_OUTPUT = 'docs/verification/phase-2.10/final'
$env:STABILITY_MS = '300000'
node scripts/verify-shell.mjs
```

Per nuove prove scegliere un'altra cartella output. SHELL_URL non impostata: default `http://127.0.0.1:5187`. Il browser è stato avviato fuori sandbox con approvazione; nessuna modifica alle impostazioni del browser personale.

## Limiti e confronto visivo

Ispezionati `references/background.png`, riferimenti 00/01 e catture finali `shell-1920x1080.png`, `shell-3840x2160.png` e `missing-image-fallback.png`. La cattura 4K è stata visualizzata ridimensionata a 2048×1152. L'immagine approvata resta centrata/cover, senza trasformazioni camera o veicoli dipinti duplicati; la composizione Home rimane quella della 2.9. Il fallback mostra gradiente/avviso e mantiene card, widget e focus.

Differenze residue: header/logo meno estesi e articolati rispetto allo 00; rail con simboli originali neutri Demo invece di loghi autentici delle app, cornici/proporzioni dei pannelli più semplici; domotica con due switch Demo invece degli elementi illustrativi del mockup; footer e feedback di preview presenti. Menu superiore e controlli movimento assenti per decisione utente; meteo e dati reali non inventati. Il PNG selezionato non include il grande brand sul cartellone centrale del riferimento 00, e rimane invariato per istruzione esplicita. Nessuna dichiarazione di piena fedeltà visiva: questa fase valida e consolida il motore mantenendo la Home esistente.

SHA256 di `references/background.png` e `assets/cyberpunk-background.png` verificato identico e invariato: `7ac43c3324781f7061c8e5a4527d0234ed97c43161f70123e5d619bae62b8482`. Ricerca nei bundle JS/CSS: nessuna stringa della vecchia scena o del pannello/nuovi controlli fixture; nessun import runtime di CityBackdrop/city.css residuo. Le verifiche dell'esclusione del pannello sono anche nel collaudo browser.

Il contextlost è un evento sintetico e l'errore draw è iniettato: non sono guasti GPU reali. Headless con GPU disattivata non misura compositing o presentazione su TV. CPU draw, main thread CSS e heap dopo GC hanno significati distinti; conteggi stabili per pochi minuti non dimostrano assenza assoluta di leak. Profiling statistico allocazioni della 2.9 resta evidenza storica separata, non rieseguita in questa fase salvo indicazione successiva. Nessun test webOS, Magic Remote reale, packaging, deploy o sostituzione Home.

## Chiusura e ripresa

**2.10 completata**, milestone5 parte B e fase2 del motore browser chiuse; versione locale0.2.0, nessuna release/pubblicazione. Nessun nuovo blocco identificato. Le differenze visive residue e i gate hardware restano espliciti. Prossima **3.1 — Overlay e Back**, non avviata; preservare Home unica, policy automatiche, tarature e mock durante l'estensione delle interazioni.
