# Microfase 3.4 — Stati limite

Data: 2026-11-10. Base Git `4742c5e`, con modifiche locali 3.2/3.3 preservate. Versione locale **0.3.3**, nessuna nuova dipendenza, commit, push o pubblicazione.

## Contratto implementato

Le tre aree alimentate dalla piattaforma (app, ingressi e domotica) condividono `usePlatformResource`: caricamento con `aria-busy`, lettura iniziale, retry esplicito, gestione della durata delle richieste e blocco sincrono dei comandi duplicati. Le letture terminano dopo **10 secondi** con un errore leggibile; una risposta arrivata dopo il timeout viene ignorata. Il limite comprende discovery e lettura, senza modificare le interfacce degli adapter. Nessun retry automatico, cancellazione del trasporto o cache introdotti.

`ResourceNotice` distingue caricamento, errore e lista vuota valida. Dopo errore o lista vuota, **Riprova** rilegge capability e dati, è descritto dal messaggio ed è navigabile con D-pad/OK e pointer. Una capability assente mostra la motivazione; anche in quel caso Riprova può verificarla nuovamente, senza aggirarla. Dati leggibili ma comandi non supportati restano visibili e consultabili, con `aria-disabled` e motivo associato tramite `aria-describedby`; i gestori non invocano il comando.

I comandi restano non ottimistici: lo stato HDMI/interruttore cambia solo dopo successo; gli errori restano espliciti. Durante un comando c'è feedback di attesa e il blocco impedisce doppi invii nella stessa area. Non si introducono timeout o retry automatici sui comandi: un futuro trasporto potrebbe avere già eseguito l'operazione e richiede una propria strategia di conferma/cancellazione. Le Promise già partite non vengono annullate, ma risultati e dialoghi obsoleti sono scartati dopo retry, cambio adapter o unmount. Snapshot, feedback e busy del precedente adapter non contaminano quello nuovo.

Se un controllo focalizzato scompare, il focus manager cerca prima un controllo superstite nella stessa zona, poi il normale fallback Home. Il caricamento non ruba il focus a un controllo ancora presente; dialoghi e relativo ritorno restano invariati.

`ConnectionNotice` osserva online/offline con cleanup dei listener. Quando il browser segnala offline compare un avviso nel footer; **la Demo locale continua a funzionare**. `navigator.onLine` è un indizio del browser, non una verifica di raggiungibilità Internet o dei servizi. Nessun endpoint, polling, servizio reale o dato di rete inventato. Il mock è locale anche online; questo lavoro non aggiunge service worker, cache offline o installabilità.

Home regolare, PNG, brand canonico, tarature, profili, dialoghi, pointer/simulatore e idle 2min/45% preservati. Nessun nuovo menu finale.

## Verifiche

Primo controllo completo sulla 0.3.3: **156 test in 23 file**, lint, TypeScript e build superati. Quattro nuovi test verificano i contratti accessibili dei fallback; i test già presenti distinguono capability, errori/rejection, elenchi vuoti e comandi senza falso successo.

Il primo collaudo Edge completo è passato (`first/`), con attesa reale di10.202ms. Dopo aver ispezionato le schermate sono stati rifiniti contrasto del messaggio rail, feedback per adapter e messaggi di attesa. **Controllo finale completo superato** sulla0.3.3:156 test in23 file, lint/typecheck/build e collaudo Edge; evidenze separate in `final/`, build index-Cqy5H5Vl.js/index-Bly57XtD.css.

- `final/platform-metrics.json`: liste vuote, retry da D-pad, Promise rifiutate, capability di elenco/comando assenti, nessun falso successo o aggiornamento ottimistico, blocco duplicati, risposte lettura/comando obsolete ignorate. Attesa reale **10.206ms**, successo arrivato dopo timeout ignorato e retry recuperato.
- Offline tramite CDP su produzione: avvio Demo locale riuscito, avviso di rete rimosso al ritorno online; screenshot1080p/4K. Nessun controllo della reale connettività esterna.
- `final/shell-metrics.json`: **runtimeErrors=[]**,1080p/4K senza overflow, mobile con solo scorrimento verticale previsto. Anche offline1080p e fallback vuoti4K senza overflow.
- Regressioni dialoghi, Back/OK/ritorno focus, pointer/tap/simulatore e relativi tool dev-only superate; metriche in dialog-metrics.json e pointer-metrics.json. Profili/pannello/background, resize, hidden/reduced motion e fallback immagine/Canvas/errori superati.
- Build ispezionata: nessun riferimento alla fixture o ai suoi scenari tecnici, nessuna nuova dipendenza. Versione package/root lockfile coerente e diff senza errori di whitespace.

Fixture Vite `scripts/fixtures/platform-states.html` e `src/platform/testing/PlatformFixture.tsx`: stessi componenti Home, adapter di prova per liste vuote, letture sospese, errori, Promise rifiutate, capability assenti e comandi lenti/falliti. Controlli tecnici solo nella fixture, non importati dalla Home o dalla build ordinaria. `scripts/verify-platform-states.mjs`, attivato da `PLATFORM_TEST_URL`, verifica anche il cambio adapter con letture/comandi pendenti, doppi input, scarto del successo tardivo e recupero dopo timeout.

Comando browser, con server preview 5187 e Vite dev 5188 già avviati:

```powershell
$env:CHROME_PATH = 'C:\Program Files (x86)\Microsoft\Edge\Application\msedge.exe'
$env:VERIFY_OUTPUT = 'docs/verification/phase-3.4/final'
$env:PROFILE_TEST_URL = 'http://127.0.0.1:5188/scripts/fixtures/background-profiles.html'
$env:BACKGROUND_TEST_URL = 'http://127.0.0.1:5188/'
$env:PLATFORM_TEST_URL = 'http://127.0.0.1:5188/scripts/fixtures/platform-states.html'
node scripts/verify-shell.mjs
```

Senza `PLATFORM_TEST_URL` lo script conserva il percorso ordinario; la fixture non serve al funzionamento dell'app. Le due attese reali idle della 3.3 sono opt-in separato `IDLE_TEST=1`, non ripetute in questa fase. Nessun nuovo soak5min o profiling: restano lo storico2.9/2.10, non misure attuali.

## Confronto visivo e limiti

Riferimenti00/01 e guide visuale/animazione letti prima delle modifiche; PNG SHA256 invariato `7ac43c3324781f7061c8e5a4527d0234ed97c43161f70123e5d619bae62b8482`. Ispezionati Home regolare1080p, fallback vuoti1080p/4K e offline1080p finali, più vuoti/capability1080p e offline4K preliminari. Le immagini4K sono state visualizzate ridotte a2048×1152. Il percorso regolare mantiene geometria e asset; i fallback occupano le aree previste, con una superficie scura dietro il messaggio rail per contrasto, e l'avviso offline può andare a capo nel footer. La barra in alto negli screenshot della fixture è tecnica e non è UI finale.

Ambiente: Windows, Node24.22.2/npm11.19.1, Edge156 headless con GPU disattivata. NVM blocca npm nella sandbox con NVM4306; controlli eseguiti fuori sandbox dopo autorizzazione, senza cambiare trust o dipendenze. Test offline tramite emulazione rete CDP, comandi tramite CDP/DOM, guasti e dati sempre simulati. Nessuna prova TV/Magic Remote, altro browser, screen reader o GPU. Non si dichiara fedeltà visiva completa: restano le differenze pregresse di header, loghi Demo, cornici e footer. La 3.5 dovrà verificare l'MVP browser; hardware e integrazioni restano fasi future.

## Punto di ripresa

**3.4 completata in browser**, versione locale0.3.3, fase3 ancora aperta. Prossima microfase: **3.5 — Verifica MVP browser**, non avviata. Nessun blocco identificato, commit, push o deploy.
