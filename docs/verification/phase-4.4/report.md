# Microfase4.4 — collaudo G5

2026-11-11. **COMPLETATA**, versione **0.4.3**, fase4 chiusa; prossima5.1 — Catalogo applicazioni, non avviata. L'utente ha richiesto la4.4 e l'installazione/avvio della nostra app sono stati eseguiti per questo collaudo. Lavoro locale4.1–4.3 preservato; nessun commit/push, root, Home remapping, autostart o integrazione fase5.

## Dispositivo e prima installazione

Target locale glitch-g5, Developer Mode già associata. Lettura CLI system-info riuscita: OLED55G56LS.DPIQLJP, firmware43.21.96, SDK11.2.0. IP/credenziali/endpoint Inspector non salvati. Verifica locale IPK0.4.1 passata prima dell'installazione; ares-install e ares-launch exit0. Prima connessione ares-inspect riuscita.

Inspector reale: WebAppManager Chrome132.0.6834.207, viewport1920×1080/DPR1, platform.tv true, immagine caricata, nessun overflow DOM. Footer letto dall'app: modello/firmware/SDK corrispondenti al dispositivo. È una lettura del nostro adapter, distinta dalla lettura CLI e dal bridge simulato4.3. Screenshot e snapshot in device/. L'utente conferma Home visibile con dati TV.

Telecomando reale, riscontro utente: frecce/OK/Back del dialogo/ritorno alla card e passaggio Demo→TV funzionano. Puntatore e leggibilità utilizzabili. Segnalati piccoli scatti durante il cambio icona, con richiesta esplicita di riduzione leggera del carico.

Campionamento Inspector60.060ms,30 campioni,22 con Canvas running:29,51–30,25draw/s, media non ponderata delle finestre CPU draw6,954ms. Nessun errore osservato durante l'aggancio. Otto campioni con Canvas statico esclusi dall'intervallo attivo; input/idle naturali non bloccati. Non è misura GPU, FPS dell'interfaccia o latenza telecomando. Evidenze device-performance/. Il primo helper aveva già scritto snapshot/screenshot ma rimaneva nel close handshake WebSocket: interrotto solo il processo locale, poi aggiunta chiusura limitata; il campionamento successivo exit0.

## Taratura0.4.2 richiesta dall'utente

Solo sul runtime TV, sia in modalità reale sia Demo: budget Canvas1728×972 (−10% per lato,−19%pixel), pioggia192 invece di208 gocce e particelle36 invece di40. Target30fps conservato; PNG originale, CSS nebbia/neon/ologramma, logo, geometria/focus e calibrazione browser Balanced invariati. Nessun passaggio a Eco o riduzione automatica. Config dedicata webosBackgroundConfig, HomeBackground riceve flag TV indipendente dalla modalità Demo; test assicura isolamento e limiti.

npm run check passato: **179 test/25 file**, lint/TypeScript/build. package:webos con nove file app identici allo stage;0.4.2,2.974.470byte,SHA256`826043bd9e0f1f631f08f967e1acff39b103804b291d5253c8f003304916d7e2` (package-0.4.2.json). Aggiornamento e avvio sulla G5 exit0, nuovo Inspector collegato. Il tentativo di chiusura precedente restituiva app is not running, senza impedire l'aggiornamento; non contato come prova di uscita Back.

## Taratura finale0.4.3 e controlli conclusivi

Utente0.4.2: un po' meglio, richiesto un altro piccolo ritocco; conferma uscita LG e Home LG→riapertura funzionanti. Nessuna distinzione strumentale tra rilancio freddo e ripresa calda, né misura della durata in background. Sulla0.4.3 l'utente accetta esplicitamente l'equilibrio fluidità/dettaglio: Canvas1600×900,179gocce/intensità56 e32particelle,target30fps, solo runtime TV anche Demo. Rispetto a0.4.1 circa−31%pixel overlay,−14%gocce e−20%particelle; l'immagine originale e gli altri layer non vengono ridimensionati o rimossi. Nessun cambio CSS delle card, root o manipolazione del sistema.

Chiusura0.4.2, installazione e avvio0.4.3 exit0. IPK finale **2.974.470byte**,SHA256`2bb7aedfd390df02ddbd565ff60c8b2ee601d97f9900c0bc3c746e45f33c82f8`,nove file identici allo stage (package-report.json). CLI --check/--info e verify:webos finali passati;179 test/check finali ripetuti. Asset runtime TV index-CAOpXcXF.js rilevato nel DOM uguale alla build; Inspector conferma1600×900/179/32, immagine caricata/dati reali e nessun overflow.

device-final-idle/:130.060ms,64 campioni,56 con Canvas running e metriche disponibili. Draw/s26,81–30,24,mediana29,78; media non ponderata delle finestre CPU draw6,270ms, massimo di finestra18ms. Confronto indicativo con6,954ms precedente (circa−10%): finestre/carico/warmup non identici, nessun benchmark controllato della UI. DOM121nodi invariato nei campioni; non è un test heap/listener o prova di assenza perdite prolungate. Nessun errore osservato dall'aggancio.

Idle: test sul TV reale con un solo Shift DOM sintetico senza azione per iniziare l'attesa. Timer di prodotto120s; primo campione idle a117.461ms dall'avvio del campionamento, che segue lo Shift, snapshot e screenshot iniziali: questo intervallo **non** è la latenza input→idle. Stato finale visible/idletrue,opacità0,45,backgroundstill,Canvasstatic/frame3485 costanti fino a130.011ms. Utente conferma risveglio completo al primo tasto fisico. device-wake/:idlefalse/Canvasrunning,focus watch-neon-district,dati TV ancora presenti; finestra successiva30,01draw/s/CPUmedia5,928ms. Nessun comando alla luminosità hardware.

Edge157 headless --disable-gpu, browser-release/ exit0 e runtimeErrors vuoto: Demo HTTP/file://,DOM/AX14azioni1080p/4K,dialoghi/pointer/simulatore/stati limite/offline/resize/profili/reduced motion/hidden/fallback e runtime LG con bridge sintetico. Budget TV1600×900/179/32 e browser canonico verificati; niente fixture nell'IPK. browser-final/ si fermava nel nuovo controllo del buffer prima dell'attivazione del Canvas (300×150 iniziale): corretti attesa dello stato running ed emulazione no-preference nello script, senza cambiare prodotto. Primo tentativo idle non partito per target Inspector scaduto dopo riapertura; ristabilito il tunnel e poi test riuscito. Endpoint non salvati in Git.

## Limiti, confronto visivo e continuità

README/webos README aggiornati con installazione/aggiornamento reali, Console/Network e diagnosi, chiusura/rimozione, sessione Developer Mode e helper di campionamento locale. Rimozione e downgrade restano sole istruzioni; nessun rinnovo automatico, cache reset o modifica firmware. Pressione lunga Back, errori di grant indotti, suspend lungo/riavvio TV e condizioni di rete estreme non provati. Questi limiti sono dichiarati, non promossi a risultati. Nessuna certificazione WCAG/screen reader/GPU/latency o lunga stabilità hardware.

Ispezionati screenshot realiFHD iniziale/idle/risveglio e browser1080p/4K con00/01: composizione, PNG, logo e focus conservati; font del TV diversi da Windows, differenze note di brand/header, simboli Demo, widget/rail indisponibile e footer restano. Resa fisica4K non distinta dalla grafica appFHD; tool ridimensiona screenshot4K a2048px. Nessuna piena fedeltà visiva dichiarata. SHA256 PNG`7ac43c3324781f7061c8e5a4527d0234ed97c43161f70123e5d619bae62b8482`,logo`64b0c09d6c4c400b5e1fb2c32151b2e3ad50c5a69cef7b1141df1812a5c14fa7` invariati.

L'app0.4.3 resta installata; la chiusura del tunnel Inspector locale non chiude l'app. Versione package/root lockfile/manifest allineata. Prossima5.1 richiede verificare API pubbliche e permessi per catalogo/icone: non dedurre che il getSystemInfo autorizzi altre integrazioni. Nessuna app di terzi lanciata/enumerata, nessuna Home sostituita. La guida sessione si basa sulla [documentazione LG](https://webostv.developer.lge.com/develop/getting-started/developer-mode-app), distinta dalle prove del nostro adapter.
