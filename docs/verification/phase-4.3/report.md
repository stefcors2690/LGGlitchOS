# Microfase4.3 — adapter webOS di base

2026-11-11. Versione **0.4.1**, base553bbf8 con lavoro locale4.1/4.2 preservato; nessun commit/push/deploy/installazione TV. Scelta utente: adapter webOS predefinito sulla TV, Demo opzionale; browser sempre Demo. La4.4 resta il collaudo sul dispositivo.

## Modifiche e limiti funzionali

- DeviceInfo.getSystemInfo e SystemInfo tipizzati, campi opzionali modelName/firmwareVersion/sdkVersion. Mock: UNSUPPORTED per dati reali. WebosPlatformAdapter: service.request/getSystemInfo soltanto, nessun seriale o altro identificatore richiesto/esposto; validazione dei campi, nessuna ricostruzione dai dati CLI.
- Lettura non sottoscritta, scadenza8s, cancel protetto, settlement unico e callback tardive ignorate. Errori di risposta/permesso/trasporto tradotti senza payload grezzi in log/UI; Riprova esplicito, niente retry automatico. Unmount/cambio adapter impedisce aggiornamenti UI tardivi, mentre il trasporto rimane limitato al suo timeout.
- Sei capability future unsupported con motivo; chiamare direttamente i relativi comandi non manda richieste LG e non simula successi. Continua a guardare è sempre un esempio Demo. Footer con dati effettivamente ricevuti e pulsante Demo/TV senza persistenza; badge TV nelle aree del device, browser invariato.
- Back461 interpretato solo nel runtime TV: prima chiude il modale e ripristina l'origine, poi dalla Home chiama platformBack pubblico, anche nella Demo TV. Manifest disableBackHistoryAPI:true. Nessun Home/pressione lunga/autostart/hook, nessun handler launch/relaunch; policy visibilitychange/idle/reduced motion preservate.
- webOSTV.js1.2.13 ufficiale locale13.818byte, originale, Apache2.0 inclusa. Niente CDN/dipendenza npm frontend; solo build webOS. Manifest con solo systemconfig.query, nessun gruppo per launch/HDMI/domotica. Packaging controlla SDK SHA256/ordine defer/licenza, whitelist/versione/icone/asset e identità IPK-stage.

## Verifiche

- npm run check: **178 test/25 file**, lint/TypeScript/build passati. Test nuovi: selezione, provenance, campi mancanti/malformati/extra, errore e retry, timeout8s con timer simulati, cancel che lancia, callback tardiva/sincrona, throw SDK, comandi assenti senza trasporto e mapping461 circoscritto.
- npm run package:webos/verify:webos: nove file app identici byte-per-byte. Artefatto finale **artifacts/com.stefcors.glitchos_0.4.1_all.ipk**,2.974.414byte,SHA256`66d05e5aa22c5b8e01239fdc32c48f87f14d9129e8b4a31c26a89e48c32f2f21`. Vedere package-report.json. CLI --check/--info e verify:webos finali superati anche dopo la rifinitura delle etichette; nessuna connessione TV.
- Edge157 headless --disable-gpu, sicurezza file normale. browser-final/ completo passato con runtimeErrors vuoto: regressioni Demo HTTP/file://, DOM/AX14 azioni1080p/4K, dialoghi/pointer/simulatore/stati limite/offline/profili/resize/reduced motion/hidden/fallback. SDK LG originale sopra bridge Palm sintetico verifica selezione TV, soli tre parametri, errore/retry, passaggio Demo/TV, modale461 e Home platformBack.
- Dopo la rifinitura testo/badge, browser-release/ ripete il collaudo e aggiunge accesso al footer tramite D-pad/provenienza TV. Esito finale exit0, runtimeErrors vuoto; screenshot finali ispezionati,4.3 COMPLETATA e prossima4.4. TEST TV/test-sdk sono valori solo di test, fuori dal pacchetto.
- SHA256 immagine originale`7ac43c3324781f7061c8e5a4527d0234ed97c43161f70123e5d619bae62b8482`, logo canonico`64b0c09d6c4c400b5e1fb2c32151b2e3ad50c5a69cef7b1141df1812a5c14fa7`, SDK`2e83e028aef8651ef0b79b25a70c7ebc076a36781486a68623634bc0c2162670`.

## Confronto visivo e limiti delle prove

Riletti riferimenti e regole, ispezionati00/01 e screenshot1080p/4K browser/pacchetto/TV simulata. Demo preservata; modalità TV con area rail indisponibile e footer più alto per dati/passaggio Demo. Gli stati limite riusano i pannelli esistenti, nessun nuovo asset o tema. Differenze pregresse di header/logo, simboli Demo e cornici/densità widget rimangono esplicite. Il visualizzatore ridimensiona4K a2048px: nessuna certificazione pixel-perfect o piena fedeltà. Nessuna prova GPU, screen reader/WCAG, divano o G5; nessuna nuova attesa reale idle2min/soak3.5.

La verifica del bridge non prova i permessi effettivi o il motore WebAppManager. Consensi LG possono limitare alcuni campi. Da verificare4.4: prima installazione/avvio, grant/read reali, Back fisico/pressione lunga/uscita LG, pointer/D-pad, sfondo/idle/ripresa e rilancio, viewport e prestazioni. Non dedurre esiti dal CLI SSH. Nessuna API fase5 implementata.

## Correzioni durante la sessione

Primo check: lint rifiutava regexp con controlli; sostituita con controllo dei caratteri senza disabilitare regole. Secondo: accesso window in ambiente SSR, aggiunta guardia. Primo run browser/ interrotto da CDP Object reference chain is too long: il test restituiva un nodo DOM, corretto in booleano; nessuna eccezione runtime dell'app mascherata. browser-final/ completo superato, poi brevi rifiniture di provenienza/testo e browser-release/. Evidenze precedenti conservate.

## Fonti ufficiali consultate

[Informazioni TV](https://webostv.developer.lge.com/develop/references/tv-device-information), [ACG](https://webostv.developer.lge.com/develop/guides/acg-guide), [Back](https://webostv.developer.lge.com/develop/guides/back-button), [API webOS](https://webostv.developer.lge.com/develop/references/webostvjs-webos), [SDK originale](https://webostv.developer.lge.com/develop/references/webostvjs-introduction), [lifecycle](https://webostv.developer.lge.com/develop/guides/app-lifecycle-management). Documentazione distinta dai risultati hardware: il solo gruppo della lettura è dichiarato; deviceInfo dell'SDK non viene chiamato perché richiede altri gruppi.
