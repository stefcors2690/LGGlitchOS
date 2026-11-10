# Microfase 3.2 — Pointer e simulatore telecomando

Data: 2026-11-10. Base locale `4742c5e` (`fase 3 in corso`), working tree inizialmente pulito. Versione locale0.3.1, patch intermedia della fase3. Nessun commit, tag, release, push o deploy.

## Interventi e contratto

`useTvFocus` integra pointermove e pointerdown con il grafo esistente. Movimento effettivo mouse/pen senza trascinamento → focus al controllo TV colpito, senza click; coordinate invariate non riprendono focus dopo una freccia. Touch in movimento non è hover; il tap usa il click nativo. Pointerdown primario mette a fuoco, senza attivare manualmente; niente doppio avvio. Target non disponibili, pannelli tecnici e dialogo modale sono esclusi dal focus Home. Memoria per zona e tasti della3.1 preservati, listener rimossi nel cleanup. `data-input-mode` diagnostica l'ultimo input TV riconosciuto pointer/D-pad, senza stato React per movimento.

Il trattamento focus cyan/magenta esistente è esteso a `:focus` su app/widget, così selezione e cornice restano visibili anche dopo mouse o eventi sintetici che non impostano :focus-visible. Nessuna nuova geometria, logo, taratura o animazione.

`navigation/development/RemoteSimulator.tsx` e CSS caricati lazy solo con Vite dev e `?remoteDebug=1`. Pulsante inizialmente chiuso, sei comandi Su/Sinistra/OK/Destra/Giù/Back. Inviano KeyboardEvent DOM al controllo Home ricordato o al dialogo corrente; OK usa l'alias gestito dal focus manager, senza fingere il click nativo di Enter e senza doppia attivazione. Nessun evento di sistema o Magic Remote reale. Tab/Enter rendono i controlli utilizzabili senza mouse. Click sul pannello non perde il focus applicativo; comandi nativi dei campi tecnici continuano a usare la tastiera.

La shell conserva l'espansione in memoria e colloca il simulatore dentro ActionDialog quando è aperto, evitando di rendere cliccabile la Home sotto il modale. Tab/Shift+Tab del dialogo percorrono anche i pulsanti tecnici visibili, senza uscire dal modale; senza simulatori rimane il comportamento3.1. Produzione ignora la query ed esclude modulo/CSS dei controlli. Nessuno storage, servizio o dipendenza aggiunti. Il pannello background resta indipendente con `backgroundDebug=1`.

## Verifiche

Windows11 Pro N10.0.26300 x64, Node24.22.2/npm11.19.1, Edge156 headless con GPU disattivata. `npm run check` sulla0.3.1: **141 test unitari in21 file, lint, TypeScript e build superati**. I nuovi casi d'interazione sono nel modulo browser `scripts/verify-pointer.mjs`, richiamato dal collaudo Home; nessun test unitario aggiunto per ripetere gli stessi dettagli DOM.

Primo collaudo browser nella radice di questa cartella superato per pointer/simulatore e regressioni; successivamente uniformata la cornice di focus per mouse/input sintetici e aggiunta asserzione sul focus visibile del widget. **Run finale in final/ superato**, `runtimeErrors=[]`, con `pointer-metrics.json`, `dialog-metrics.json` e `shell-metrics.json`. Build0.3.1 finale `index-TPK4AWSn.js`/`index-D9OKHoZm.css`; versioni package/lockfile coerenti, diff senza errori di whitespace. Nessun errore o check incompleto osservato nei percorsi eseguiti.

Verificati nel browser:

- Movimento mouse CDP → focus Musica senza click; freccia → Video; movimento alle stesse coordinate iniettato non ruba il focus; nuovo movimento reale torna a Musica. Click nativo contato una volta, apre il dialogo e ritorna all'origine.
- Hover widget → freccia su → card ricordata; touch-move sintetico non seleziona, tap CDP su Video genera un solo click e dialogo. Home inerte sotto il modale preservata anche spostando il mouse sul rail.
- Produzione con remoteDebug=1: niente controlli; sviluppo senza query: niente controlli; sviluppo opt-in: pulsante inizialmente chiuso, apertura senza perdita focus, frecce/OK/Back Home e dialogo, ritorno al widget e secondo Back alla Home.
- Pannello ricollocato nel dialogo nativo, espansione mantenuta, Tab/Enter sui comandi, OK senza doppia attivazione. Focus del widget con outline solido anche da input sintetico; bounds simulatore entro viewport1080p/4K/mobile.
- Due pannelli dev insieme: range pioggia continua a rispondere alla freccia nativa (65→66), senza interferenza del simulatore.
- Regressioni complete3.1 e background: dialoghi/fallback/ritorno focus, origine nascosta/disabilitata, alias e native input, widget Demo, profili, pannello background, Canvas assente/errori iniettati, sorgente assente/ritorno, resize, reduced motion e visibilità OK. Produzione senza stringhe del componente “Simulatore browser”, data-remote-key o CSS remote-panel nei bundle; gli attributi di esclusione dei tool nel focus manager restano legittimamente nel codice comune.

## Riproduzione

`npm run check`, poi server in terminali distinti:

```powershell
npm run dev -- --host 127.0.0.1 --port 5188 --strictPort
npm run preview -- --host 127.0.0.1 --port 5187 --strictPort
```

Avviati qui tramite gli equivalenti entry point locali `node node_modules/vite/bin/vite.js` e `node node_modules/vite/bin/vite.js preview`, con gli stessi argomenti. Poi:

```powershell
$env:CHROME_PATH = 'C:\Program Files (x86)\Microsoft\Edge\Application\msedge.exe'
$env:VERIFY_OUTPUT = 'docs/verification/phase-3.2/final'
$env:PROFILE_TEST_URL = 'http://127.0.0.1:5188/scripts/fixtures/background-profiles.html'
$env:BACKGROUND_TEST_URL = 'http://127.0.0.1:5188/'
node scripts/verify-shell.mjs
```

SHELL_URL usa il default127.0.0.1:5187; per nuove prove scegliere directory output nuove. Edge fuori sandbox con approvazione. Senza BACKGROUND_TEST_URL il modulo verifica pointer/produzione ma non dichiara testato il simulatore dev. Nessuna nuova prova prolungata o profiling: STABILITY_MS/ALLOCATION_MS assenti, rapporti2.9/2.10 separati.

## Confronto e limiti

Riferimenti00/01 letti prima degli interventi; ispezionati screenshot finali pointer-home1080p, simulatore4K e modale+simulatore1080p, oltre al mobile del run iniziale. Cattura4K visualizzata ridimensionata a2048×1152. Layout, PNG e gerarchia Home preservati; il focus usa lo stesso trattamento cyan/magenta in entrambe le modalità. Controlli tecnici fissi sovrapposti solo con opt-in; non fanno parte della Home di produzione e usano dimensioni da strumento desktop, non un'interfaccia TV definitiva. Nessun cambiamento di direzione visiva; scostamenti preesistenti di header, loghi Demo e pannelli restano aperti, non si dichiara piena fedeltà. SHA256 background invariato:7ac43c3324781f7061c8e5a4527d0234ed97c43161f70123e5d619bae62b8482.

Mouse/click/tap tramite CDP, controlli di coordinate ferme/touch-move tramite PointerEvent DOM iniettati; simulatore tramite KeyboardEvent sintetici. Il campione non verifica mouse/pen/touch fisici, Magic Remote, TV/webOS, altri browser o screen reader. L'assenza di errori runtime vale per i percorsi provati, non certifica prestazioni G5. Dialoghi/fallback e policy di movimento continuano secondo3.1/2.10;3.3 non avviata.

## Chiusura e ripresa

**3.2 completata**, versione locale0.3.1; fase3 ancora aperta. Nessun nuovo blocco identificato. Prossima **3.3 — Transizioni e idle dimming**, non avviata. Conservare focus condiviso, slot dei tool nel dialogo e distinzione input sintetici/hardware; nessun servizio o pubblicazione introdotto.
