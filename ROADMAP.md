# StefCors GL1tCh 0S — Roadmap incrementale

Ultimo aggiornamento: 2026-11-11.

## Come usarla

Numerazione aggiornata: nuova fase 2 per il motore animato; le precedenti fasi 2–6 diventano 3–7. La fase 1 resta chiusa. L'unità di lavoro è una **microfase** (es. `0.1`): implementarne una alla volta, mantenendo il progetto verificabile. Se è ancora troppo grande, dividerla prima di iniziare. Le dipendenze seguono l'ordine della lista; le fasi hardware richiedono anche i gate indicati.

Stati ammessi: `DA FARE`, `IN CORSO`, `BLOCCATA`, `COMPLETATA`. Una microfase è completata solo con criteri soddisfatti e verifiche registrate. Non segnare come verificato ciò che non è stato provato.

**Stato corrente:** **macrofasi0–4 completate**, versione **0.4.3** installata/collaudata sulla G5. Lettura reale, telecomando/uscita/riapertura e idle/ripristino verificati; taratura TV ridotta su richiesta e accettata.179 test/check/IPK/CLI e regressioni Edge1080p/4K superati, limiti espliciti nel [rapporto4.4](docs/verification/phase-4.4/report.md). Prossima **5.1 — Catalogo applicazioni**, non avviata.
Il dettaglio operativo, gli esiti dei controlli e lo storico sono in `PROJECT_STATUS.md`. Per riprendere su un altro PC usare [docs/HANDOFF.md](docs/HANDOFF.md) e il [rapporto3.5](docs/verification/phase-3.5/report.md).

A fine lavoro aggiornare questa roadmap e `PROJECT_STATUS.md`; aggiornare anche istruzioni, specifiche e README quando cambiano contratti, decisioni o comandi. Il passaggio a un altro IDE non deve dipendere dalla cronologia della chat.

## 0 — Fondamenta browser

### 0.1 — Scaffold eseguibile

- Stato: `COMPLETATA`
- Ambito: Creare React + TypeScript strict + Vite, entry point e struttura modulare minima.
- Accettazione: Installazione da checkout pulito, dev server e build funzionanti; comandi documentati.

### 0.2 — Controlli di qualità

- Stato: `COMPLETATA`
- Ambito: Configurare lint, typecheck e runner di test leggero.
- Accettazione: Script eseguibili e almeno un test significativo; risultati registrati.

### 0.3 — Contratti e adapter mock

- Stato: `COMPLETATA`
- Ambito: Definire interfacce tipizzate per capability, app, ingressi e domotica; implementare mock con dati demo.
- Accettazione: Test di successi, errori e capability non supportate; nessuna chiamata TV o rete.

### 0.4 — Tema e shell TV

- Stato: `COMPLETATA`
- Ambito: Introdurre token neon, layout 16:9, margini sicuri e logo canonico.
- Accettazione: Shell leggibile a 1080p e 4K; asset locali risolti e nome esatto del brand.

## 1 — Home cinematografica interattiva

### 1.1 — Sfondo e livelli visivi

- Stato: `COMPLETATA`
- Ambito: Usare lo sfondo approvato dall’utente `references/background.png`, con fallback statico, atmosfera animata leggera e navette aggiuntive che attraversano occasionalmente la città dietro la UI; separare scena e controlli.
- Accettazione: Nessun mockup usato come intera UI; contrasto e provenienza asset verificati. Navette con passaggi distanziati e profondità diverse, senza intercettare input; movimento disattivabile, fermo con reduced motion e pagina nascosta. Idle dimming e pausa per inattività restano in 3.3.

### 1.2 — Header e sezioni

- Stato: `COMPLETATA`
- Ambito: Creare Home, App, Ingressi, Domotica, Impostazioni e orologio locale.
- Accettazione: Sezioni selezionabili, semantica accessibile; meteo assente o esplicitamente demo.

### 1.3 — Rail applicazioni

- Stato: `COMPLETATA`
- Ambito: Creare card da catalogo mock, selezione e feedback di avvio simulato.
- Accettazione: Demo visibile; loghi autentici con provenienza o fallback neutri; nessuna promessa di avvio reale.

### 1.4 — Navigazione D-pad essenziale

- Stato: `COMPLETATA`
- Ambito: Implementare focus deterministico tra header e rail, frecce e OK/Enter.
- Accettazione: Focus sempre visibile e stabile dopo rerender; test dei percorsi principali.

### 1.5 — Widget Continua a guardare

- Stato: `COMPLETATA`
- Ambito: Creare contenuti e avanzamento demo con azione simulata.
- Accettazione: Stato demo esplicito, etichette leggibili e accesso da tastiera.

### 1.6 — Widget ingressi

- Stato: `COMPLETATA`
- Ambito: Creare sorgenti mock e selezione simulata.
- Accettazione: Navigazione da rail a widget verificata; nessuno stato HDMI presentato come reale.

### 1.7 — Widget domotica

- Stato: `COMPLETATA`
- Ambito: Creare dispositivi demo e comandi tramite adapter mock.
- Accettazione: Stato aggiornato in simulazione, errori gestiti e test della logica.

### 1.8 — Impostazioni movimento

- Stato: `COMPLETATA`
- Ambito: Aggiungere movimento ridotto, rispetto preferenza di sistema e controllo animazione logo.
- Accettazione: Preferenze applicate a tutti gli effetti; test di precedenza e persistenza se implementata.

### Chiusura fase 1 — Debug interattivo nel browser

- Stato: `COMPLETATA` — fase 1 chiusa per approvazione esplicita dell’utente dopo il riscontro browser e le correzioni richieste.
- Riscontro browser: utente soddisfatto; rimossi su richiesta i testi introduttivi sullo sfondo da tutte le sezioni. Chiusura accettata dall’utente; non sono dichiarati controlli manuali Console/Network o percorsi specifici non riportati. Le verifiche automatiche restano nei rapporti.
- Richiesta utente: dedicare una sessione alla Home completa nel browser, con dev server, DevTools e prove guidate reali di navigazione e resa visiva.
- Accettazione: confrontare references 00/01 a 1080p/4K, provare D-pad/Back/OK e widget senza mouse, controllare console e richieste di rete, movimento ridotto e difetti visibili. Registrare esiti e correzioni in PROJECT_STATUS e nel rapporto di verifica. I test headless già eseguiti non sostituiscono questa sessione interattiva.
- Debug browser già disponibile durante lo sviluppo: procedura in README. Questo checkpoint non richiede deploy sulla TV.

## 2 — Cyberpunk Animated Background Engine

Specifica: [docs/specs/CYBERPUNK_BACKGROUND_ENGINE.md](docs/specs/CYBERPUNK_BACKGROUND_ENGINE.md). Motore React/TypeScript/Canvas, PNG originale immutato, video solo riferimento. Ogni microfase termina con controlli e contesto aggiornato; a ogni milestone verificare anche l’integrazione degli effetti già introdotti. Pannello solo sviluppo/diagnostica esplicita, nessun controllo nella Home finale. Nessuna API LG o modifica sistema.

### 2.1 — Architettura, configurazione e immagine originale

- Stato: `COMPLETATA`
- Milestone: 1, parte A.
- Ambito: Audit asset/dipendenze e moduli esistenti; definire CyberpunkBackgroundEngine, config/tipi, controller/ciclo di vita, coordinate e base statica riutilizzabile.
- Accettazione: references/background.png intatto, 16:9 Full HD/4K senza distorsione; percorso configurabile e asset mancante segnalato senza sostituzioni arbitrarie; fallback disponibile. Policy reduced motion/visibilità preservata, zero interferenze focus/pointer e nessuna riscrittura rail/widget.

### 2.2 — Pioggia cinematografica Canvas

- Stato: `COMPLETATA`
- Milestone: 1, parte B; verifica architettura + originale + pioggia.
- Ambito: Canvas 2D con profondità, dimensioni/velocità/opacità variabili e vento; RAF con delta controllato, pool e DPR limitato.
- Accettazione: Pioggia naturale e discreta, nessuna semplice griglia di righe bianche; resize e stop/resume/cleanup testati; Canvas indisponibile torna al PNG; nessun doppio effetto con la pioggia CSS precedente.

### 2.3 — Nebbia atmosferica

- Stato: `COMPLETATA`
- Milestone: 2, parte A.
- Ambito: Nebbia principalmente inferiore con trasparenza e tinte neon, drift lento ciclico; texture/transform efficienti.
- Accettazione: Nessuno stacco di ciclo o filtro pesante non motivato; UI leggibile, configurazione densità/velocità e disattivazione indipendente; sostituita la nebbia precedente senza sovrapposizioni duplicate.

### 2.4 — Neon e illuminazione localizzata

- Stato: `COMPLETATA`
- Milestone: 2, parte B; verifica nebbia + luci.
- Ambito: Regioni/maschere per insegne, lievi pulsazioni, luminosità graduale, interferenze occasionali e riflessi cyan/magenta.
- Accettazione: Effetti solo sulle aree appropriate, coordinate allineate anche dopo crop/resize; nessun lampeggio continuo o variazione indiscriminata dell’intera immagine. Confronto visivo documentato.

### 2.5 — Ologramma mascherato

- Stato: `COMPLETATA`
- Milestone: 3, parte A.
- Ambito: Regione normalizzata del volto destro con scanline, RGB split leggero, luminosità e brevi distorsioni orizzontali.
- Accettazione: Effetto confinato al volto e corretto a resize, glitch raro/non invasivo, immagine originale immutata, configurazione e disattivazione indipendenti.

### 2.6 — Particelle e predisposizione veicoli

- Stato: `COMPLETATA`
- Milestone: 3, parte B; verifica ologramma + particelle.
- Ambito: Particelle ambientali discrete con pool e numero limitato; modulo opzionale veicoli per futuri asset trasparenti.
- Accettazione: Particelle non ostacolano UI; veicoli disattivati di default e navette aggiuntive precedenti escluse nel nuovo motore. Nessun oggetto dipinto nel PNG spostato o duplicato evidentemente.

### 2.7 — Profili prestazionali

- Stato: `COMPLETATA`
- Milestone: 4, parte A.
- Ambito: Cinematic, Balanced ed Eco, config centrale con unità/limiti espliciti, budget Canvas/DPR e monitor leggero.
- Accettazione: Balanced predefinito, cambi profilo coerenti senza loop/risorse duplicati, Eco minimo/statico disponibile, test della risoluzione configurazione e limiti. Nessuna promessa fps G5 da misure desktop.

### 2.8 — Pannello tecnico di sviluppo

- Stato: `COMPLETATA`
- Milestone: 4, parte B; verifica pannello + profili.
- Ambito: Controlli live per intensità/velocità pioggia, densità nebbia, luminosità neon, glitch ologramma, numero particelle, profilo e reset default.
- Accettazione: Solo sviluppo o diagnostica esplicitamente abilitata; assente dalla Home definitiva e dalla produzione ordinaria. Valori validati e Home accessibile, nessun ripristino dei vecchi controlli utente rimossi.

### 2.9 — Ottimizzazione e stabilità

Completata su Windows con correzione scheduler, profiling Canvas/CSS/allocazioni e Home produzione per 300.032 ms. 134 test/check e Edge superati; 30 cambi profilo/resize, 120 variazioni slider, risorse stabili e cleanup verificato. Misure e limiti nel [rapporto 2.9](docs/verification/phase-2.9/report.md). Nessuna prestazione G5 certificata.

- Stato: `COMPLETATA`
- Milestone: 5, parte A.
- Ambito: Profilare frame time/allocazioni/risorse, limitare buffer/DPR, pooling, resize ripetuti e sessione prolungata con durata registrata.
- Accettazione: Niente stato React per frame o crescita incontrollata; RAF/listener/risorse liberati allo smontaggio, pagina nascosta/riduzione ferme e ripresa senza salti. Obiettivo 30 fps TV, misurazione G5 rinviata finché non disponibile.

### 2.10 — Integrazione definitiva e validazione

- Stato: `COMPLETATA`
- Milestone: 5, parte B; verifica finale di tutto il motore.
- Esito: vecchia scena rimossa, cleanup Canvas immediato e idempotente su errore/contextlost, fallback/recupero verificati. 135 test/check ed Edge superati; Home produzione per300.035ms, risorse e focus stabili; confronto1080p/4K e differenze residue nel rapporto2.10. Fase2 chiusa in browser, nessuna certificazione G5 o piena fedeltà visiva. Versione locale0.2.0, nessuna pubblicazione.
- Ambito: Consolidare integrazione Home e fallback, eliminare doppioni della scena precedente, completare documentazione e rapporto con evidenze.
- Accettazione: Lint/typecheck/test/build, console senza errori osservati, effetti off/Canvas assente/resize/reduced motion/prova prolungata verificati; D-pad/OK/Back e focus invariati. Screenshot 1080p/4K confrontati con originale e riferimenti, differenze e misure esplicite; nessuna compatibilità webOS dichiarata senza TV.

## 3 — Qualità di interazione

### 3.1 — Overlay e Back

- Stato: `COMPLETATA`
- Ambito: Implementare dialoghi accessibili, Escape/Back e ripristino focus.
- Esito: dialoghi Demo app/Riprendi confermati dall'utente; un modale nativo, Home inerte, tasti/focus/ritorno origine e fallback verificati. 141 test/check ed Edge produzione/dev superati, albero accessibilità e screenshot1080p/4K/mobile ispezionati. Alias telecomando sintetici distinti dai tasti CDP, nessuna prova reale G5. Rapporto3.1; versione locale0.3.0, nessuna pubblicazione.
- Accettazione: Nessuna trappola fuori dai dialoghi; chiusura e ritorno alla sezione testati.

### 3.2 — Pointer e simulatore telecomando

- Stato: `COMPLETATA`
- Ambito: Coordinare hover/click e D-pad; aggiungere simulatore browser.
- Esito: focus condiviso con movimento effettivo, hover fermo/touch-move ignorati, click/tap singoli; simulatore dev-only opt-in Home/dialoghi, escluso produzione, accessibile da tastiera. 141 test/check e nuovi casi browser pointer/simulatore/regressioni superati, runtimeErrors vuoto, screenshot1080p/4K/mobile verificati. Rapporto3.2 con input CDP/sintetici distinti e limiti G5; versione0.3.1 non pubblicata.
- Accettazione: Cambio modalità senza perdita di focus; controlli utilizzabili senza mouse.

### 3.3 — Transizioni e idle dimming

- Stato: `COMPLETATA`
- Ambito: Aggiungere animazioni leggere e attenuazione dopo inattività.
- Esito: attesa2min confermata dall'utente, opacità45%/pausa decorazioni, primo input ripristina senza consumo, focus preservato. Timer unico e priorità sistema/hidden; dissolvenze CSS180/600ms e ingresso dialogo220ms. 152 test/check e Edge completo, due attese reali120,0/120,5s, screenshot1080p/4K verificati; nessun risultato G5 dichiarato. Rapporto3.3, versione0.3.2 non pubblicata.
- Accettazione: Input ripristina luminosità; timer testati; nessun aggiornamento React per frame.

### 3.4 — Stati limite

- Stato: `COMPLETATA`
- Ambito: Gestire cataloghi vuoti, caricamento, errori, offline e capability assenti.
- Esito: fallback accessibili e Riprova da D-pad, letture con scadenza10s, risultati tardivi scartati, stato confermato e blocco doppi comandi; capability motivate, Demo locale operativa offline. 156 test/check ed Edge completo superati, attesa reale10.206ms, regressioni e screenshot1080p/4K verificati; runtimeErrors vuoto. Rapporto3.4, versione0.3.3 non pubblicata, nessuna prova hardware.
- Accettazione: Fallback accessibili e nessun falso successo; test dei casi principali.

### 3.5 — Verifica MVP browser

- Stato: `COMPLETATA`
- Ambito: Controllare accessibilità, navigazione completa, 1080p/4K e prestazioni.
- Esito:156 test/check e matrice Edge157 superati. DOM/AX,14 azioni da D-pad e Tab/Shift+Tab, dialoghi/focus, stati limite e idle reale120,2/120,2s; screenshot1080p/4K ispezionati e limiti espliciti. Home animata300.035ms,29,99–30,01draw/s, risorse stabili, heap dopo GC+58.588byte; runtimeErrors vuoto. Report3.5/run-4, versione0.3.4 non pubblicata. Nessuna certificazione WCAG/screen reader/GPU/G5 o piena fedeltà; fase3 chiusa in browser.
- Accettazione: Lint, typecheck, build e test eseguiti; screenshot e risultati manuali documentati, limiti espliciti.

## 4 — Applicazione webOS pubblica

### 4.1 — Inventario dispositivo e fattibilità SDK

- Stato: `COMPLETATA`
- Ambito: Rilevare modello, firmware/webOS esatti e accesso Developer Mode; verificare documentazione ufficiale aggiornata.
- Esito11/11: matrice/fonti LG, Developer Mode/Key Server, CLI3.2.6/Node24 verificati; target glitch-g5 con default emulatore preservato, getkey eseguito dall'utente e system-info exit0. Modello OLED55G56LS.DPIQLJP, firmware43.21.96, SDK11.2.0 reali; webOS26/11.2.0-3711 dichiarato dal menu. Accesso confermato, nessun IPK/app/adapter reale provato. Evidenza docs/verification/phase-4.1/device-info.md, versione0.3.4 invariata.
- Accettazione: Matrice capability e permessi con fonti; accesso al G5 confermato prima delle prove hardware.

### 4.2 — Packaging standalone

- Stato: `COMPLETATA`
- Ambito: Aggiungere manifest, icone e procedura IPK usando strumenti verificati.
- Esito: manifest com.stefcors.glitchos0.4.0/FHD/ACG vuoto, icone80/130 dal canonico, build separata Chromium132/IIFE e script packaging/verify. IPK2.964.650byte validato CLI, sette file app identici allo stage;165 test/check e regressioni Edge browser+file://1080p/4K superati. Guida completa, install/launch TV non eseguiti; rapporto4.2 con limiti e hash. Nessun deploy/privilegio.
- Accettazione: Pacchetto generabile e sezione deploy del README aggiornata con prerequisiti e comandi verificati per preparazione, connessione, packaging, installazione e avvio; nessuna modifica al sistema TV.

### 4.3 — Adapter webOS di base

- Stato: `COMPLETATA`
- Ambito: Implementare solo API pubbliche verificate e selezione adapter.
- Esito: runtime LG locale, getSystemInfo pubblico/ACG minimo/timeout8s/errori e retry, adapter TV predefinito e Demo opzionale, sei capability future indisponibili con motivo, Back461 e platformBack.178 test/check e IPK validato, collaudo Edge browser/file:// e bridge sintetico1080p/4K superato, runtimeErrors vuoto. Nessuna prova dispositivo o integrazione5.x; rapporto4.3 e limiti aggiornati, prossima4.4.
- Accettazione: Mock ancora disponibile; funzioni assenti disabilitate con motivo, timeout ed errori gestiti.

### 4.4 — Collaudo G5

- Stato: `COMPLETATA`
- Ambito: Installare e avviare app standalone in Developer Mode; provare remote, rendering e prestazioni.
- Esito: install/launch/update fino0.4.3 riusciti, getSystemInfo reale/FHD/DPR1/Chrome132 e budget TV confermati da Inspector; utente conferma navigazione, Back/uscita LG/riapertura e primo input dopo idle. Due ritocchi leggeri richiesti, taratura1600×900/179/32/30fps accettata. Campione hardware130s con idle45% e pausa/ripresa, metriche e limiti nel rapporto;179 test/check/package/verify/CLI e regressioni Edge1080p/4K OK. README deploy/diagnosi/sessione completato; pressione lunga/GPU/latency/disinstallazione/downgrade non certificati.
- Accettazione: Risultati misurati sul dispositivo, regressioni registrate e funzioni non verificate dichiarate; sezione deploy del README completata con collaudo, log, diagnosi, aggiornamento, disinstallazione e gestione sessione Developer Mode.

## 5 — Integrazioni reali verificate

### 5.1 — Catalogo applicazioni

- Stato: `DA FARE`
- Ambito: Integrare elenco app e icone solo se API e permessi lo consentono.
- Accettazione: App installate confermate sul TV; fallback esplicito se API indisponibile.

### 5.2 — Avvio applicazioni

- Stato: `DA FARE`
- Ambito: Integrare lancio tramite API pubbliche verificate.
- Accettazione: Avvio ed errori collaudati sul G5; nessun falso successo.

### 5.3 — Ingressi reali

- Stato: `DA FARE`
- Ambito: Integrare elenco e cambio ingresso dove consentito.
- Accettazione: Stato e azioni verificati sul TV; limiti documentati.

### 5.4 — Progetto bridge domotico

- Stato: `DA FARE`
- Ambito: Definire endpoint, dispositivi, autenticazione e confine server/client.
- Accettazione: Architettura revisionabile; approvazione prima di introdurre servizi o dipendenze rilevanti.

### 5.5 — Home Assistant

- Stato: `DA FARE`
- Ambito: Implementare bridge autorizzato e azioni sui dispositivi concordati.
- Accettazione: Nessun segreto nel bundle; timeout, offline e autorizzazioni verificati.

### 5.6 — Collaudo integrazioni

- Stato: `DA FARE`
- Ambito: Verificare riavvio app, rete assente e guasti delle integrazioni.
- Accettazione: Matrice test reale aggiornata; UI utilizzabile anche con integrazioni indisponibili.

## 6 — Decisione separata sulla sostituzione Home

### 6.1 — Ricerca compatibilità esatta

- Stato: `DA FARE`
- Ambito: Ricercare fattibilità per firmware esatto, rischi e alternative senza eseguire modifiche.
- Accettazione: Fonti aggiornate, incertezze e limiti documentati; nessuna compatibilità presunta.

### 6.2 — Decisione e recupero

- Stato: `DA FARE`
- Ambito: Preparare go/no-go, piano di rollback e recupero verificato.
- Accettazione: Decisione scritta; no-go mantiene app standalone; go non autorizza da solo azioni privilegiate.

## 7 — Opzionale, solo con autorizzazione separata

### 7.1 — Prototipo privilegiato circoscritto

- Stato: `DA FARE`
- Ambito: Solo dopo go, recupero verificato e autorizzazione esplicita: definire ed eseguire un singolo esperimento reversibile.
- Accettazione: Ambito e autorizzazione registrati; ripristino verificato prima di ulteriori interventi.

### 7.2 — Verifica avvio e Home

- Stato: `DA FARE`
- Ambito: Solo per azioni specificamente autorizzate: verificare comportamento, recupero e aggiornamenti.
- Accettazione: Esiti reali e procedura di ritorno allo stock documentati; nessuna garanzia di compatibilità futura.

## Modifica layout approvata durante debug

- Taratura neon rafforzata su richiesta dopo 2.4: intensità 100, pulsazioni più evidenti; geometria delle regioni invariata. Prossima microfase resta 2.5.

- Calibrazione effetti su feedback preview: pioggia confermata visibile; nebbia aumentata a densità default 65. Nessuna nuova fase avviata.

- Decisione successiva: nessun controllo Movimento e logo o Pausa sfondo; animazioni fisse con sola riduzione automatica di sistema e sospensione su pagina nascosta. Le preferenze salvate in 1.8 non sono più lette.

- Home unica su richiesta utente: eliminato menu superiore, funzioni sempre in Home e preferenze movimento espandibili. Le descrizioni delle fasi completate rappresentano lo storico; la decisione corrente sostituisce la struttura a cinque sezioni.

## Vincoli trasversali

- Massima fedeltà visiva richiesta dall’utente: confronto screenshot 1080p/4K con riferimenti 00/01 e documentazione degli scostamenti prima di completare ogni fase visiva; nessuna reinterpretazione semplificata.

- Brand esatto `StefCors GL1tCh 0S`; logo canonico `assets/branding/StefCors_GL1tCh_0S_Glitch_Slow.svg` e regole di `ANIMATION_SPEC.md`.
- Riferimenti prioritari: `00_brand_home.png` per branding, `01_home_approved.png` per layout. Componenti reali, loghi terzi autentici o fallback neutri.
- Browser/mock prima del TV; dati simulati sempre indicati. Niente telemetria o servizi di rete introdotti implicitamente.
- D-pad, focus visibile, Back/OK, reduced motion e protezioni OLED lungo tutto lo sviluppo.
- Nessun exploit, patch, autostart o rimappatura Home senza istruzione separata esplicita e recupero verificato.

## Questioni aperte

- Modello completo, firmware e versione webOS del G5; disponibilità del dispositivo per test.
- Calibrazione delle regioni neon/ologramma e budget effetti del nuovo motore: PNG originale, Canvas/CSS e fallback statico, nessun video principale.
- Applicazioni e ingressi prioritari; disponibilità legale dei relativi asset.
- Endpoint e dispositivi Home Assistant, da definire nella fase 4.
- Eventuale feedback audio, disattivato per default.
