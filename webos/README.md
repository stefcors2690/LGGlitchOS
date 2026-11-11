# Pacchetto standalone webOS

App di sviluppo **StefCors GL1tCh 0S**, ID stabile **com.stefcors.glitchos**, versione **0.4.3**. Installata e avviata sulla G5 nel collaudo4.4 richiesto dall'utente; non sostituisce la Home LG. Le build locali non installano automaticamente nulla sul TV.

## File e contratti

- `appinfo.json`: versione allineata a package/root lockfile, grafica1920×1080, `requiredACG: ["systemconfig.query"]`, `disableBackHistoryAPI: true`. Nessun servizio JS, hook/autostart o API privata. Le altre sei capability sono unsupported.
- `vendor/`: SDK ufficiale LG webOSTV.js1.2.13 originale13.818byte, licenza Apache2.0 e provenienza/hash. Caricato solo nella build webOS, senza CDN o nuove dipendenze npm. Verificatore controlla hash, ordine di caricamento e licenza nel pacchetto.
- `icons/icon.png`80×80 e `largeIcon.png`130×130: esportazioni statiche del logo canonico originale, inserito in una cornice quadrata; `source.svg` ne conserva la derivazione. Non sono loghi terzi o immagini AI. Logo canonico e scenografia restano invariati.
- `dist-webos/`: output generato/ignorato da Git; IIFE classico con defer, CSS separato e URL relativi per avvio locale. Target JS/CSS Chromium132 per webOS26 documentato, non certificazione del motore sul TV. La build browser ordinaria resta in dist/ con moduli ES.
- `artifacts/`: IPK e package-report.json generati/ignorati. `ares-package --no-minify` evita un secondo passaggio dopo Vite; identità byte-per-byte fra nove file app nello stage e archivio verificata senza estrarre percorsi su disco.

Sulla TV il runtime ufficiale platform.tv seleziona l'adapter webOS. Il footer mostra soltanto modelName/firmwareVersion/sdkVersion effettivamente ricevuti da getSystemInfo; permesso negato, dati malformati o attesa8s mostrano errore e Riprova. Alcuni campi richiedono consensi LG; nessun dato CLI viene incorporato nell'app. Il pulsante **Apri modalità Demo** abilita la Home simulata e **Torna alla modalità TV** ripristina l'adapter reale; nessun salvataggio della scelta. App/HDMI/domotica reali saranno integrate nella fase5; Continua a guardare resta sempre Demo. Nel browser rimane il mock predefinito.

Back461 chiude prima il dialogo; sulla Home chiama webOS.platformBack(), anche quando è aperta la Demo. Utente4.4 conferma dialogo/ritorno focus, uscita LG e Home LG→riapertura funzionanti. Pressione lunga non provata. Le policy visibilitychange/idle/reduced motion restano attive, senza handler launch/relaunch o modifica Home. Inspector4.4 osserva idle45% e stop Canvas dopo l'attesa; riscontro fisico di risveglio nel rapporto4.4.

Taratura accettata dall'utente sulla G5: solo effetti Canvas1600×900,179 gocce/32 particelle a target30fps, anche nella Demo TV. Immagine originale, CSS/logo e layout app1920×1080 invariati; il browser conserva Balanced208/40/FHD. Nessun profilo Eco o auto-degrado introdotto. Misure e limiti in [rapporto4.4](../docs/verification/phase-4.4/report.md).

## Prerequisiti e generazione locale

Dalla radice del repository: Node>=22.12 (verificato24.22.2), npm e CLI ufficiale **@webos-tools/cli3.2.6** installata separatamente dal frontend. Se non presente:

```powershell
npm install -g @webos-tools/cli@3.2.6
ares -V
npm ci
npm run check
npm run package:webos
npm run verify:webos
ares-package --info artifacts/com.stefcors.glitchos_0.4.3_all.ipk
```

Installazione da lockfile non ripetuta in4.2 (dipendenze frontend invariate). I comandi check/package/verify e analisi CLI vanno distinti: verify controlla un artefatto già presente, non lo ricrea. `npm run build:webos` prepara solo lo stage, package lo ricostruisce e produce l'IPK con verifica. Non serve una TV o un target CLI per generare il pacchetto.

Il report include ID, versione, dimensione, SHA256 e liste file. L'hash identifica quella generazione, non promette IPK bit-identici fra sistemi/esecuzioni (timestamp/metadati CLI possono variare). Dopo ogni modifica runtime rigenerare; non distribuire uno stage nuovo con un IPK precedente. Per aggiornare versione modificare package/root lockfile e webos/appinfo.json insieme; i controlli rifiutano disallineamenti.

## Rigenerazione icone

I PNG sono inclusi nei sorgenti, quindi build/package ordinari non richiedono Edge. Solo se cambia il branding:

```powershell
$env:CHROME_PATH = 'C:\Program Files (x86)\Microsoft\Edge\Application\msedge.exe'
node scripts/export-webos-icons.mjs
```

Lo script usa browser locale headless e Canvas per rasterizzare una copia statica del SVG canonico. Nessun servizio esterno; rendering dei font dipendente dal sistema. Source SVG e PNG sono stati ispezionati su Windows. Conservare il titolo esatto e non modificare l'asset canonico per questa esportazione.

## Collaudo locale da file

Il collaudo browser principale può aggiungere la matrice del file locale, senza disattivare CORS o sicurezza del browser:

```powershell
$env:CHROME_PATH = 'C:\Program Files (x86)\Microsoft\Edge\Application\msedge.exe'
$env:PACKAGED_FILE_URL = ([Uri](Join-Path (Get-Location).Path 'dist-webos/index.html')).AbsoluteUri
$env:VERIFY_OUTPUT = 'docs/verification/my-webos-run'
$env:MVP_TEST = '1'
node scripts/verify-shell.mjs
Remove-Item Env:PACKAGED_FILE_URL, Env:MVP_TEST
```

Richiede preview browser5187 attiva; configurazione opzionale dei server/fixture come README. Produce evidenze separate packaged-file/ con DOM/AX,14 azioni D-pad/OK, Tab/inverso e screenshot1080p/4K, più conferma avvio classico/immagine/footer/assenza tool. Il test è sullo stage, la cui identità con i file app dell'IPK è verificata dal packaging. Edge file:// non riproduce WebAppManager, permessi, lifecycle, rendering o prestazioni del G5.

## Installazione, aggiornamento e prova TV

**Eseguite nella4.4:** installazione/avvio0.4.1 e aggiornamenti0.4.2/0.4.3 sul target glitch-g5, con delega dell'utente per questo collaudo. Lettura reale dei dati TV e WebAppManagerChrome132/FHD/DPR1 verificati da Inspector. Su altro PC seguire il [dossier4.1](../docs/webos/PHASE_4_1.md), senza copiare chiavi nel progetto. La delega4.4 non è una pubblicazione automatica futura. Dalla radice, per una successiva versione autorizzata:

```powershell
npm run check
npm run package:webos
npm run verify:webos
ares-device --device glitch-g5 --system-info
ares-install --device glitch-g5 artifacts/com.stefcors.glitchos_0.4.3_all.ipk
ares-launch --device glitch-g5 com.stefcors.glitchos
ares-inspect --device glitch-g5 --app com.stefcors.glitchos
```

I comandi sopra sono riusciti sul dispositivo in4.4. L'Inspector restituisce un URL locale; nessun --open automatico. Ogni chiusura/riapertura può cambiare il target: rilanciare ares-inspect e usare il nuovo URL, non conservare endpoint in Git. Per aggiornare un'app già aperta, chiudere prima con il comando sotto; app is not running significa che era già chiusa, non che l'installazione sia fallita. Rigenerare con versione allineata in package/root lockfile/manifest e usare il nuovo nome IPK.

Nel Web Inspector controllare Console e Network per errori/asset mancanti; nessun accesso root ai log di sistema. Dal DOM verificare footer dati TV, [data-system-info], .tv-shell[data-idle], Canvas[data-state] e data-fps/data-average-draw-ms. Questi ultimi descrivono il draw Canvas, non FPS presentati o GPU. Nessun errore osservato dall'aggancio non prova l'assenza di errori precedenti. Confrontare anche sul display: primo avvio, Demo/ritorno TV, frecce/OK/Back/dialogo/focus, pointer, Home LG/riapertura e idle/ripristino.

Diagnosi: se non c'è connessione, verificare sessione Developer Mode e alias locale; non rifare getkey se ancora valido. Se la Home è vuota, verificare runtime/asset in Console e rigenerare lo stage corretto. Se i dati TV non arrivano, usare Riprova e verificare consensi LG/ACG; app/HDMI/domotica indisponibili sono attesi fino alla fase5, non un fallimento del collegamento. Non pubblicare payload di sistema, passphrase o screenshot dell'app Developer Mode.

Chiusura della nostra app: eseguita con successo in4.4. Rimozione: sola istruzione, **non eseguita**, lasciare l'app installata se si vuole continuare a usarla:

```powershell
ares-launch --device glitch-g5 --close com.stefcors.glitchos
ares-install --device glitch-g5 --remove com.stefcors.glitchos
```

Un eventuale ritorno a una versione precedente richiede il suo IPK conservato e un piano per dati/compatibilità: nessun rollback automatico né garanzia di downgrade. Non operare su altri app ID o impostazioni TV.

## Sessione Developer Mode e campionamento

Aprire Developer Mode sulla TV per leggere stato e Remain Session attuali;999h59m era soltanto il checkpoint utente4.1. Per prolungare una sessione ancora valida, LG documenta il pulsante EXTEND con TV connessa alla rete. A sessione scaduta non è più estendibile; la disattivazione Developer Mode rimuove le app installate per sviluppo. Nessun rinnovo automatico, reboot o pulizia cache eseguito. [Guida ufficiale LG](https://webostv.developer.lge.com/develop/getting-started/developer-mode-app).

Helper di collaudo sul dispositivo, con URL **corrente** ricavato da ares-inspect; snapshot/metriche della nostra app soltanto, niente fixture nel pacchetto:

```powershell
$env:TV_INSPECT_WS = '<ws://localhost:PORT/devtools/page/TARGET dal nuovo Inspector>'
$env:TV_VERIFY_OUTPUT = 'docs/verification/my-g5-run'
$env:TV_SAMPLE_MS = '60000'
node scripts/inspect-g5.mjs
Remove-Item Env:TV_INSPECT_WS, Env:TV_VERIFY_OUTPUT, Env:TV_SAMPLE_MS
```

Adattare endpoint/output; il placeholder non è eseguibile. TV_SAMPLE_MS è opzionale (5–300s). TV_IDLE_PROBE=1 aggiunge un solo Shift sintetico senza azione all'inizio, per controllare l'inattività sul dispositivo; durante130s non usare telecomando/pointer. Un endpoint scaduto richiede nuovo tunnel; non dedurre un crash app da un errore WebSocket. Lo script salva screenshot/snapshot/campioni, osserva errori solo dal suo aggancio e chiude il proprio processo dopo la scrittura anche se il handshake della TV resta aperto. Nessuna input injection nelle letture ordinarie.

## Fonti LG consultate11/11/2026

[Manifest](https://webostv.developer.lge.com/develop/references/appinfo-json), [CLI](https://webostv.developer.lge.com/develop/tools/cli-dev-guide), [ACG](https://webostv.developer.lge.com/develop/guides/acg-guide), [risoluzione](https://webostv.developer.lge.com/develop/specifications/app-resolution), [SDK ufficiale](https://webostv.developer.lge.com/develop/references/webostvjs-introduction), [informazioni TV](https://webostv.developer.lge.com/develop/references/tv-device-information), [Back](https://webostv.developer.lge.com/develop/guides/back-button), [API webOS](https://webostv.developer.lge.com/develop/references/webostvjs-webos). Il gruppo systemconfig.query è documentato per getSystemInfo; platformBack non richiede ACG. La documentazione non prova il grant effettivo alla nostra app: da verificare in4.4. Non viene usato webOS.deviceInfo(), che nella libreria corrente richiede ulteriori gruppi.

## Verifica controllata dell'adapter

Con preview browser sulla5187 e server dev sulla5188, aggiungere al comando di collaudo descritto nel README:

```powershell
$env:PACKAGED_FILE_URL = 'file:///C:/Source/LGGlitchOS/dist-webos/index.html'
$env:WEBOS_RUNTIME_URL = $env:PACKAGED_FILE_URL
$env:MVP_TEST = '1'
node scripts/verify-shell.mjs
```

Adattare il percorso assoluto alla propria copia e impostare CHROME_PATH/SHELL_URL come nel README. WEBOS_RUNTIME_URL carica l'SDK LG originale sopra un bridge sintetico solo nel processo Edge di test: selezione, permesso negato/retry, Demo e Back461 a1080p/4K. Non include fixture nel pacchetto e non certifica la G5. [Rapporto4.3](../docs/verification/phase-4.3/report.md).
