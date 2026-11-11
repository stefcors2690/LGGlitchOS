# 4.1 — Inventario dispositivo e fattibilità SDK

Aggiornato: **2026-11-11**. Stato: **COMPLETATA**, inventario, matrice/fonti e accesso al G5 confermati. Base Git `553bbf8`, working tree inizialmente pulito. Applicazione invariata **0.3.4**; eseguita solo lettura informazioni via CLI, nessuna API integrata nell'app, modifica firmware, packaging o deploy. Prossima4.2 — Packaging standalone, non avviata. [Evidenza reale](../verification/phase-4.1/device-info.md).

## Inventario con provenienza

| Voce | Valore | Evidenza |
| --- | --- | --- |
| Famiglia | LG OLED evo G5 | Dichiarata dall'utente il11/11/2026 |
| Modello completo | **OLED55G56LS.DPIQLJP** | CLI system-info exit0; modello base OLED55G56LS comunicato dall'utente |
| Firmware/software | **43.21.96** | Confermato via CLI, coincide con dichiarazione utente |
| Versione webOS TV | **webOS26 / 11.2.0-3711** | Letta e comunicata dall'utente il11/11/2026; non acquisita via API/CLI |
| sdkVersion | **11.2.0** | Letto via CLI system-info; distinto dalla stringa completa del menu |
| Developer Mode | **Installata e attiva** | Conferma utente dopo attivazione,11/11/2026 |
| Sessione residua | **999h59m all'ultima lettura** | Dichiarazione utente, non un contatore aggiornato dal progetto |
| Key Server | **Attivo** | Conferma utente11/11/2026 |
| Target CLI locale | **glitch-g5**, prisoner, porta9922 | ares-setup-device --add riuscito; indirizzo comunicato dall'utente conservato nella configurazione CLI locale, non in Git; emulatore predefinito preservato |
| Accesso PC→TV | **Confermato** | Dopo getkey eseguito dall'utente, ares-device --device glitch-g5 --system-info exit0 e dati reali ricevuti; precedente TCP9922=True |
| Strumenti CLI nel PC | **@webos-tools/cli3.2.6 installata globalmente** | Inizialmente assenti nel PATH; installazione npm riuscita, `ares -V` e help setup-device/device/novacom verificati su Node24.22.2 |
| Versione applicativa mock | 0.3.4 | package.json e lockfile; collaudo browser3.5 già documentato |

La CLI conferma sdkVersion11.2.0; il suffisso menu3711 resta evidenza utente, non viene inventato nell'output CLI. Firmware43.21.96 è un campo distinto. La lettura tramite CLI non equivale a collaudare deviceInfo o i permessi di una nostra app installata. [Motori web LG](https://webostv.developer.lge.com/develop/specifications/web-api-and-web-engine).

## Matrice di fattibilità e permessi

**Documentato** significa presente nelle fonti LG, non già collaudato su questo OLED55G56LS. Nessuna voce passa a `supported` nell'adapter per effetto di questa tabella: il runtime usa ancora il mock e le capability `simulated`. Assenza di un'API nell'indice consultato non dimostra impossibilità su ogni firmware.

| Funzione / contratto | Evidenza pubblica | Vincoli e decisione provvisoria | Stato sul dispositivo |
| --- | --- | --- | --- |
| App standalone | Developer Mode e CLI, fonti1/2 | Percorso pubblico per installare/testare la propria app; non equivale a sostituire la Home | Accesso CLI confermato; IPK/app non ancora provati |
| Informazioni modello/firmware/webOS | `webOS.deviceInfo()`; `getSystemInfo` su `luna://com.webos.service.tv.systemproperty`, fonti4/5 | LG distingue campi con user agreements: modello/firmware li richiedono, sdkVersion no; nessun grant dell'app verificato | Modello/firmware/SDK letti via CLI; API runtime app non collaudate |
| appCatalog | Application Manager documenta `getAppLoadStatus` per un ID noto, fonte3 | Verifica di un ID ≠ elenco completo di app e icone. Nessun metodo pubblico di enumerazione completo identificato nelle fonti consultate; non usare listApps privati per deduzione | Elenco reale non disponibile; fase5.1 |
| appLaunch | Application Manager `launch`; wrapper `webOSDev.launch`, fonti3/6 | ID/parametri effettivi e installazione da verificare; errori di sicurezza e app privilegiate possibili. Documentazione non concede accesso universale alle app di sistema | Candidato per futura integrazione, non provato |
| inputList / inputActivate | Indice Luna pubblico consultato, fonte7 | Non identificato un contratto pubblico confermato per elenco/stato/cambio HDMI da questa app. Nessuna chiamata SSAP o servizio interno introdotta | Non verificati, Demo preservata; fase5.3 |
| smartHomeList / smartHomeSetState | Nessuna integrazione domotica LG/Home Assistant configurata | Non derivare questi permessi dalla presenza di Developer Mode; integrazione e autenticazione separate in fase5 | Solo Demo |
| D-pad, OK, pointer e Back dell'app | Guide Magic Remote/Back, fonti8/9 | Frecce37–40, OK13, Back461 documentati. Strategia Back/history/manifest da scegliere e provare in4.2–4.4, senza rimappare tasti di sistema | Mock browser verificato; remote reale no |
| Home fisica / avvio automatico | Guida telecomando: Home torna alla Home di sistema, fonte8 | Nessun meccanismo pubblico verificato per assegnare questa app al tasto Home o all'avvio. Fasi6/7 separate; niente hook, root o patch | Non implementati/non autorizzati |
| Continuità streaming / dati reali | Nessun provider o permesso acquisito | Progressi e Riprendi rimangono dichiaratamente Demo | Non integrati |

Non aggiungere alla cieca nomi di permission group di webOS OSE o grant privilegiati a un futuro manifest TV. Il riferimento è l'API **webOS TV** pertinente e il risultato sul dispositivo. Matrice da aggiornare con esito, versione TV e motivo degli eventuali rifiuti, senza registrare token/chiavi.

## Motore, risoluzione e compatibilità

Per **webOS26** dichiarato dall'utente, LG elenca **Chromium132**. È il riferimento documentale per il futuro target; user-agent e motore effettivo dell'app non sono stati letti sul TV. Il collaudo Edge157 non certifica Chromium132 sul dispositivo. Fonte10.

Per i modelli UHD la documentazione distingue **grafica app1920×1080** e video3840×2160. La futura preparazione IPK dovrà tenerne conto; gli screenshot4K del browser restano utili per la scalabilità ma non dimostrano un viewport grafico TV4K. Per la grafica conta il viewport reale dell'app (`window.innerWidth/innerHeight`), non la sola dimensione video restituita da deviceInfo. Fonti11/4. Nessuna variazione di layout o asset in4.1.

Il repository non definisce un target Vite specifico TV (`vite.config.ts`); in4.2 occorrerà verificare il target rispetto a Chromium132, sintassi emessa, CSS, dialog/showModal/inert, media reduced motion, Canvas, resize e lifecycle. Non introdotti transpiler, polyfill o downgrade Node.

## Strumenti PC: stato e scelta da verificare

LG indica la CLI corrente **`@webos-tools/cli`**, distinta dalle vecchie webOS TV/OSE CLI deprecate. La pagina installazione riporta Windows10+64bit e Node raccomandato14.15.1–16.20.2: questa indicazione non coincide con Node>=22.12 dell'app (ultimo collaudo Node24.22.2). Non certificare automaticamente CLI+Node24 e non abbassare il runtime del progetto. Fonte2.

La verifica effettiva del registry npm (`npm view @webos-tools/cli version engines --json`,11/11/2026) restituisce **3.2.6**, **node>=20.0.0**. Node24.22.2 soddisfa il requisito dichiarato dal pacchetto corrente: non si adotta un runtime Node14/16 sulla base della pagina più vecchia. Nessun runtime o dipendenza frontend modificati. [Pacchetto corrente collegato da LG](https://www.npmjs.com/package/@webos-tools/cli).

**Installazione globale3.2.6 riuscita con approvazione**,230 pacchetti, exit0. `ares -V` restituisce3.2.6; `ares-setup-device --help`, `ares-device --help` e `ares-novacom --help` exit0. Verificati inizialmente eseguibili e sintassi; successivamente confermati pairing/system-info come riportato sotto, mentre packaging e prove della nostra app restano futuri. NVM4306 blocca npm/shim ares nella sandbox; prove fuori sandbox autorizzate, nessun comando firewall trust eseguito.

npm segnala dipendenze transitive deprecate e due lifecycle script non coperti da allowScripts (@webos-tools/cli e ssh2). Nessun aggiornamento o sblocco automatico: il postinstall CLI è stato letto e opera soltanto su macOS/Linux, non su questo Windows; gli altri script non sono stati abilitati. Versione/help e connessione con system-info funzionano; packaging/installazione/ispezione dell'app restano da provare nelle microfasi successive.

Comandi di preparazione (versione fissata per riproducibilità):

```powershell
npm install -g @webos-tools/cli@3.2.6
ares -V
```

Non aggiungere la CLI alle dipendenze frontend. Eventuali altre CLI già installate fuori dal PATH non sono state cercate o rimosse.

## Preparazione fisica e accesso: passi ancora da fare

**Completamento11/11:** Developer Mode/Key Server attivi, target glitch-g5 registrato con default emulatore preservato, TCP9922=True. L'utente ha poi eseguito getkey nel proprio terminale; system-info è riuscito (exit0), confermando accesso autenticato e inventario reale. Nessuna passphrase o chiave in chat/Git, nessuna scansione. I passi sotto sono la procedura riproducibile, **già completata su questo PC**; non ripetere aggiunta target/getkey se la configurazione è ancora valida.

1. TV e PC sulla stessa rete; account LG Developer disponibile. Sul TV cercare **Developer Mode** nello store LG e installarla, poi accedere con il proprio account.
2. Attivare **Dev Mode Status**: **la TV si riavvia**. Riaprire l'app e verificare sessione residua e indirizzo locale; attivare **Key Server** per l'associazione.
3. Con CLI verificata, registrare il target con alias `glitch-g5`; inserire localmente l'indirizzo reale, porta9922 e utente`prisoner`. Acquisire la chiave attraverso il prompt CLI. Non condividere in chat o nel repository credenziali, passphrase o chiavi.

La sessione è temporanea: LG documenta condizioni di disattivazione; quando Developer Mode viene disattivata, le app installate con essa vengono rimosse. Nessun rinnovo automatico o modifica delle impostazioni è eseguito dal progetto. Fonte1.

Sequenza documentata da LG; in questa sessione getkey è stato eseguito dall'utente e system-info verificato dall'assistente. La registrazione del target è stata effettuata con opzioni CLI non interattive, preservando il default:

```powershell
ares-setup-device
ares-setup-device --list
ares-novacom --device glitch-g5 --getkey
ares-device --device glitch-g5 --system-info
```

`ares-setup-device` è interattivo; scegliere add e l'alias indicato. La passphrase richiesta da getkey va digitata solo nel terminale locale. L'ultimo comando legge le informazioni del target; condividere per il rapporto solo modello, firmware e sdkVersion, senza dati identificativi ulteriori. Fonti1/12. Non sono comandi di packaging/installazione della nostra app: l'IPK resta4.2 e il deploy4.4.

## Verifica, completamento e ripresa

- Eseguiti: riconciliazione Git (553bbf8, inizialmente pulito), lettura contratti/progetto, inventario dichiarato dall'utente, fonti ufficiali11/11/2026, metadati npm, installazione globale CLI3.2.6, versione/help e controllo di coerenza documentale.
- Aggiornamento accesso: CLI --list prima dell'aggiunta, registrazione target glitch-g5 con default preservato e test TCP9922=True, tutti exit0 fuori sandbox con approvazione; IP reale non inserito in Git. Nessun contatto con altri indirizzi/porte.
- Eseguiti successivamente: getkey nel terminale utente, system-info da target reale exit0; modello OLED55G56LS.DPIQLJP, sdkVersion11.2.0, firmware43.21.96. [Evidenza](../verification/phase-4.1/device-info.md).
- Non eseguiti: installazione/avvio dell'app sul TV, verifica API del suo adapter, prestazioni/remote fisici, packaging o deploy. Nessun codice/asset/versione cambiato; test156/check/browser3.5 restano evidenza storica, non ripetuta.
- Criteri4.1 soddisfatti: inventario con provenienza, matrice/fonti ufficiali e accesso reale prima delle prove applicative. **COMPLETATA**, prossima4.2 — Packaging standalone; non ancora avviata. L'incremento applicativo0.4.0 sarà preparato con l'implementazione del packaging, senza pubblicazione implicita.

## Fonti ufficiali consultate l'11/11/2026

1. [Developer Mode](https://webostv.developer.lge.com/develop/getting-started/developer-mode-app)
2. [Installazione webOS CLI](https://webostv.developer.lge.com/develop/tools/cli-installation)
3. [Application Manager](https://webostv.developer.lge.com/develop/references/application-manager)
4. [webOS API / deviceInfo](https://webostv.developer.lge.com/develop/references/webostvjs-webos)
5. [TV Device Information](https://webostv.developer.lge.com/develop/references/tv-device-information)
6. [webOSDev API](https://webostv.developer.lge.com/develop/references/webostvjs-webosdev)
7. [Indice Luna Service API webOS TV](https://webostv.developer.lge.com/develop/references/luna-service-introduction)
8. [Magic Remote](https://webostv.developer.lge.com/develop/guides/magic-remote)
9. [Back Button](https://webostv.developer.lge.com/develop/guides/back-button)
10. [Web API and Web Engine](https://webostv.developer.lge.com/develop/specifications/web-api-and-web-engine)
11. [Supported App Resolution](https://webostv.developer.lge.com/develop/specifications/app-resolution)
12. [CLI Developer Guide](https://webostv.developer.lge.com/develop/tools/cli-dev-guide)
