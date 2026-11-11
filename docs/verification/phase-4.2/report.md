# 4.2 — Packaging standalone

Data: **2026-11-11**. Versione applicativa **0.4.0**. Base Git553bbf8 con modifiche locali4.1 presenti e preservate. Nessuna dipendenza frontend aggiunta, commit, push, deploy o connessione TV durante4.2. Accesso/inventario G5 restano evidenza4.1; qui si verifica il pacchetto locale.

## Risultato

**4.2 completata.** IPK generato: `artifacts/com.stefcors.glitchos_0.4.0_all.ipk`, **2.964.650byte**, SHA256 **c4ed8d7c0cfaeb6064b05e78ee43460466970c208b90e94af4735cdd565b672c**. Report macchina copiato in [package-report.json](package-report.json). Stage e artefatto sono generati/ignorati da Git; sorgenti manifest/icone/script sono da trasferire insieme al progetto. Una nuova generazione può avere hash diverso per metadati/timestamp CLI, senza cambiare i file app.

Manifest tracciato: IDcom.stefcors.glitchos, titolo esattoStefCors GL1tCh 0S, main index.html, type web, versione0.4.0, icone80/130, grafica1920×1080 e **requiredACG vuoto**. Nessun servizio JS, grant Luna, gestione custom del Back o hook. La sola build webOS mostra Anteprima TV/Demo nel footer; l'adapter rimane il mock. Browser e package non inventano disponibilità app, HDMI o domotica reali.

Build Vite/Rolldown separata: dist/ browser con moduli ES, dist-webos/ con target JS/CSS chrome132, IIFE senza code splitting, CSS unico, script classico defer e percorsi relativi. Il passaggio a script classico avviene solo nell'HTML generato di webOS e ne verifica la forma; è testato da file:// con sicurezza browser normale. Il target deriva dal motore LG documentato per webOS26, non certifica supporto reale di tutti gli API o prestazioni del G5.

## Implementazione e verifiche

- `npm run check` finale **exit0:165 test in24 file**, lint, TypeScript e build. Nove nuovi test per contratti versione/manifest/nessun grant, percorsi locali, PNG e formati archivio invalidi. Nessuna dipendenza aggiornata. Vitest ora risolve esplicitamente la funzione di configurazione Vite per mode test.
- `npm run package:webos` **exit0**: build webOS, preparazione stage e packaging CLI3.2.6 con --no-minify. Verifica manifest/versione, dimensioni PNG, riferimenti locali HTML e file ammessi; nessuna fixture, sorgente, tool di sviluppo o configurazione del PC nell'app. Lettura ar+tar.gz senza estrazione e confronto dei sette file app, contenuti inclusi. L'ottavo file dati dell'archivio è il packageinfo.json generato da LG.
- `ares-package --check dist-webos`: **no problems detected**, exit0. `ares-package --info artifacts/com.stefcors.glitchos_0.4.0_all.ipk`: ID/versione corretti, architettura all, main index.html; Installed-Size3188784 è metadato di installazione, non RAM misurata.
- Edge157.0.4341.42 headless --disable-gpu: regressioni browser complete con MVP_TEST e fixture background/stati limite, **runtimeErrors=[]**. DOM/AX,14 azioni D-pad/Enter, Tab/inverso, dialoghi/focus1080p/4K; pointer/tap/simulatore/dev-only, fallback, errori, offline, timeout letture, profili/pannello, resize e sistema reduced motion/hidden superati. Mobile390×844 con scorrimento verticale previsto. Evidenze browser/.
- `PACKAGED_FILE_URL` aggiunge la stessa matrice MVP sullo stage file:// a1080p/4K: **superata**, startup IIFE, PNG decodificato, asset locali, footer TV/Demo e nessun tool dev confermati in browser/packaged-file/file-metrics.json. Nessuna opzione --allow-file-access-from-files o disabilitazione CORS. L'identità IPK/stage permette di riferire questa prova ai file app inclusi, senza dichiarare installazione su TV.
- Hash PNG scenografia invariato7ac43c3324781f7061c8e5a4527d0234ed97c43161f70123e5d619bae62b8482; SVG canonico invariato64b0c09d6c4c400b5e1fb2c32151b2e3ad50c5a69cef7b1141df1812a5c14fa7. Versione package/root lockfile/manifest0.4.0 allineata. Diff whitespace senza errori.

Build browser finale index-mT2j42K5.js/index-Bly57XtD.css. Build webOS index-Cxw2HFuf.js/style-CAC46949.css, asset background-DBdo95cH.png condiviso invariato.

## Correzioni durante il lavoro

Primo lint: escape superfluo nella regexp, corretto. Primo typecheck: mergeConfig Vitest non accettava direttamente la nuova config Vite per modalità; ora viene risolta prima. Il primo stage IIFE incorporava CSS nel JS: impostato cssCodeSplit false per CSS separato e verificabile.

La prima CLI ha segnalato requiredACG mancante. Verificata la [guida LG](https://webostv.developer.lge.com/develop/guides/acg-guide), aggiunto array vuoto: nessuna chiamata Luna in questa versione. ACG su webOS26 Re:New è documentato; la futura4.3 dovrà valutare solo i gruppi necessari alle proprie API, senza derivarli dai permessi CLI.

Il confronto dell'archivio ha rilevato JS differente perché la CLI minificava nuovamente. La formattazione del grande diff Buffer Node ha inizialmente prodotto RangeError di allocazione; corretto il verificatore per segnalare il solo nome file, poi usato --no-minify. Flag verificato nella documentazione e nel parser della CLI3.2.6 (non visibile nel suo help breve). Il pacchetto finale non modifica i byte già ottimizzati da Vite e non emette warning ACG.

## Icone e confronto visivo

Prima degli interventi letti riferimenti00/01 e guide visuale/animazione. Icone PNG80×80/130×130 derivate tramite Edge/Canvas dalla copia statica del SVG canonico, dentro una cornice originale. SourceSVG e script di esportazione inclusi; font Arial dipendente dal sistema. PNG tracciati, nessun browser necessario al build ordinario. Ispezionate entrambe le icone: wordmark piccolo ma riconoscibile, titolo completo disponibile nel launcher dal manifest; resa nell'effettivo launcher TV ancora da valutare.

Ispezionati screenshot browser/shell1080p e packaged-file/mvp-home1080p/4K;4K visualizzato a2048×1152. Layout, colori, focus, widget e asset preservati; solo il footer TV descrive correttamente la build standalone e la simulazione. Restano differenze pregresse rispetto a00/01 di header/logo, simboli Demo, cornici e footer; feedback dopo azioni possono andare a capo. Nessuna piena fedeltà o leggibilità dal divano certificata.

## Riproduzione e limiti

Comandi completi per prerequisiti, build/package/verify, icone, collegamento, installazione/avvio/ispezione/chiusura/rimozione sono in [webos/README.md](../../../webos/README.md), richiamato dal README principale. Preparazione CLI e lettura G5 verificate4.1; installazione, avvio, ispezione e rimozione della nostra app sono **solo istruzioni con sintassi verificata dagli help**, non eseguite qui. Deploy resta all'utente salvo delega esplicita.

Server locali preview5187/dev5188. Comando browser eseguito:

```powershell
$env:CHROME_PATH = 'C:\Program Files (x86)\Microsoft\Edge\Application\msedge.exe'
$env:VERIFY_OUTPUT = 'docs/verification/phase-4.2/browser'
$env:PROFILE_TEST_URL = 'http://127.0.0.1:5188/scripts/fixtures/background-profiles.html'
$env:BACKGROUND_TEST_URL = 'http://127.0.0.1:5188/'
$env:PLATFORM_TEST_URL = 'http://127.0.0.1:5188/scripts/fixtures/platform-states.html'
$env:MVP_TEST = '1'
$env:PACKAGED_FILE_URL = ([Uri](Join-Path (Get-Location).Path 'dist-webos/index.html')).AbsoluteUri
node scripts/verify-shell.mjs
```

Windows/Node24.22.2/npm11.19.1, CLI3.2.6. NVM4306 e browser/strumenti richiedono esecuzione fuori sandbox approvata; nessun firewall trust o altra dipendenza installati in4.2. Non ripetuti fresh install, attese idle reali, soak5min o profiling allocazioni; questi restano storico3.5/2.x. Nessuna certificazione WCAG/screen reader, WebAppManager, API runtime/ACG, Back461/Magic Remote, viewport fisico, firmware, GPU o prestazioni G5 dall'esecuzione Edge.

Prossima **4.3 — Adapter webOS di base**, non avviata.4.4 resta collaudo hardware. Nessun install/launch/ispezione TV, aggiornamento firmware, root, sostituzione Home, autostart, commit o pubblicazione in4.2.
