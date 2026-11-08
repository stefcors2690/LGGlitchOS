# StefCors GL1tCh 0S — Roadmap incrementale

Ultimo aggiornamento: 2026-11-08.

## Come usarla

Le macrofasi conservano la numerazione delle specifiche originali. L'unità di lavoro è una **microfase** (es. `0.1`): implementarne una alla volta, mantenendo il progetto verificabile. Se è ancora troppo grande, dividerla prima di iniziare. Le dipendenze seguono l'ordine della lista; le fasi hardware richiedono anche i gate indicati.

Stati ammessi: `DA FARE`, `IN CORSO`, `BLOCCATA`, `COMPLETATA`. Una microfase è completata solo con criteri soddisfatti e verifiche registrate. Non segnare come verificato ciò che non è stato provato.

**Stato corrente:** microfase `0.1` completata. **Prossima:** `0.2`.
Il dettaglio operativo, gli esiti dei controlli e lo storico sono in `PROJECT_STATUS.md`.

A fine lavoro aggiornare questa roadmap e `PROJECT_STATUS.md`; aggiornare anche istruzioni, specifiche e README quando cambiano contratti, decisioni o comandi. Il passaggio a un altro IDE non deve dipendere dalla cronologia della chat.

## 0 — Fondamenta browser

### 0.1 — Scaffold eseguibile

- Stato: `COMPLETATA`
- Ambito: Creare React + TypeScript strict + Vite, entry point e struttura modulare minima.
- Accettazione: Installazione da checkout pulito, dev server e build funzionanti; comandi documentati.

### 0.2 — Controlli di qualità

- Stato: `DA FARE`
- Ambito: Configurare lint, typecheck e runner di test leggero.
- Accettazione: Script eseguibili e almeno un test significativo; risultati registrati.

### 0.3 — Contratti e adapter mock

- Stato: `DA FARE`
- Ambito: Definire interfacce tipizzate per capability, app, ingressi e domotica; implementare mock con dati demo.
- Accettazione: Test di successi, errori e capability non supportate; nessuna chiamata TV o rete.

### 0.4 — Tema e shell TV

- Stato: `DA FARE`
- Ambito: Introdurre token neon, layout 16:9, margini sicuri e logo canonico.
- Accettazione: Shell leggibile a 1080p e 4K; asset locali risolti e nome esatto del brand.

## 1 — Home cinematografica interattiva

### 1.1 — Sfondo e livelli visivi

- Stato: `DA FARE`
- Ambito: Creare sfondo originale o con licenza documentata e fallback statico; separare scena e controlli.
- Accettazione: Nessun mockup usato come intera UI; contrasto e provenienza asset verificati.

### 1.2 — Header e sezioni

- Stato: `DA FARE`
- Ambito: Creare Home, App, Ingressi, Domotica, Impostazioni e orologio locale.
- Accettazione: Sezioni selezionabili, semantica accessibile; meteo assente o esplicitamente demo.

### 1.3 — Rail applicazioni

- Stato: `DA FARE`
- Ambito: Creare card da catalogo mock, selezione e feedback di avvio simulato.
- Accettazione: Demo visibile; loghi autentici con provenienza o fallback neutri; nessuna promessa di avvio reale.

### 1.4 — Navigazione D-pad essenziale

- Stato: `DA FARE`
- Ambito: Implementare focus deterministico tra header e rail, frecce e OK/Enter.
- Accettazione: Focus sempre visibile e stabile dopo rerender; test dei percorsi principali.

### 1.5 — Widget Continua a guardare

- Stato: `DA FARE`
- Ambito: Creare contenuti e avanzamento demo con azione simulata.
- Accettazione: Stato demo esplicito, etichette leggibili e accesso da tastiera.

### 1.6 — Widget ingressi

- Stato: `DA FARE`
- Ambito: Creare sorgenti mock e selezione simulata.
- Accettazione: Navigazione da rail a widget verificata; nessuno stato HDMI presentato come reale.

### 1.7 — Widget domotica

- Stato: `DA FARE`
- Ambito: Creare dispositivi demo e comandi tramite adapter mock.
- Accettazione: Stato aggiornato in simulazione, errori gestiti e test della logica.

### 1.8 — Impostazioni movimento

- Stato: `DA FARE`
- Ambito: Aggiungere movimento ridotto, rispetto preferenza di sistema e controllo animazione logo.
- Accettazione: Preferenze applicate a tutti gli effetti; test di precedenza e persistenza se implementata.

## 2 — Qualità di interazione

### 2.1 — Overlay e Back

- Stato: `DA FARE`
- Ambito: Implementare dialoghi accessibili, Escape/Back e ripristino focus.
- Accettazione: Nessuna trappola fuori dai dialoghi; chiusura e ritorno alla sezione testati.

### 2.2 — Pointer e simulatore telecomando

- Stato: `DA FARE`
- Ambito: Coordinare hover/click e D-pad; aggiungere simulatore browser.
- Accettazione: Cambio modalità senza perdita di focus; controlli utilizzabili senza mouse.

### 2.3 — Transizioni e idle dimming

- Stato: `DA FARE`
- Ambito: Aggiungere animazioni leggere e attenuazione dopo inattività.
- Accettazione: Input ripristina luminosità; timer testati; nessun aggiornamento React per frame.

### 2.4 — Stati limite

- Stato: `DA FARE`
- Ambito: Gestire cataloghi vuoti, caricamento, errori, offline e capability assenti.
- Accettazione: Fallback accessibili e nessun falso successo; test dei casi principali.

### 2.5 — Verifica MVP browser

- Stato: `DA FARE`
- Ambito: Controllare accessibilità, navigazione completa, 1080p/4K e prestazioni.
- Accettazione: Lint, typecheck, build e test eseguiti; screenshot e risultati manuali documentati, limiti espliciti.

## 3 — Applicazione webOS pubblica

### 3.1 — Inventario dispositivo e fattibilità SDK

- Stato: `DA FARE`
- Ambito: Rilevare modello, firmware/webOS esatti e accesso Developer Mode; verificare documentazione ufficiale aggiornata.
- Accettazione: Matrice capability e permessi con fonti; accesso al G5 confermato prima delle prove hardware.

### 3.2 — Packaging standalone

- Stato: `DA FARE`
- Ambito: Aggiungere manifest, icone e procedura IPK usando strumenti verificati.
- Accettazione: Pacchetto generabile e procedura documentata; nessuna modifica al sistema TV.

### 3.3 — Adapter webOS di base

- Stato: `DA FARE`
- Ambito: Implementare solo API pubbliche verificate e selezione adapter.
- Accettazione: Mock ancora disponibile; funzioni assenti disabilitate con motivo, timeout ed errori gestiti.

### 3.4 — Collaudo G5

- Stato: `DA FARE`
- Ambito: Installare e avviare app standalone in Developer Mode; provare remote, rendering e prestazioni.
- Accettazione: Risultati misurati sul dispositivo, regressioni registrate e funzioni non verificate dichiarate.

## 4 — Integrazioni reali verificate

### 4.1 — Catalogo applicazioni

- Stato: `DA FARE`
- Ambito: Integrare elenco app e icone solo se API e permessi lo consentono.
- Accettazione: App installate confermate sul TV; fallback esplicito se API indisponibile.

### 4.2 — Avvio applicazioni

- Stato: `DA FARE`
- Ambito: Integrare lancio tramite API pubbliche verificate.
- Accettazione: Avvio ed errori collaudati sul G5; nessun falso successo.

### 4.3 — Ingressi reali

- Stato: `DA FARE`
- Ambito: Integrare elenco e cambio ingresso dove consentito.
- Accettazione: Stato e azioni verificati sul TV; limiti documentati.

### 4.4 — Progetto bridge domotico

- Stato: `DA FARE`
- Ambito: Definire endpoint, dispositivi, autenticazione e confine server/client.
- Accettazione: Architettura revisionabile; approvazione prima di introdurre servizi o dipendenze rilevanti.

### 4.5 — Home Assistant

- Stato: `DA FARE`
- Ambito: Implementare bridge autorizzato e azioni sui dispositivi concordati.
- Accettazione: Nessun segreto nel bundle; timeout, offline e autorizzazioni verificati.

### 4.6 — Collaudo integrazioni

- Stato: `DA FARE`
- Ambito: Verificare riavvio app, rete assente e guasti delle integrazioni.
- Accettazione: Matrice test reale aggiornata; UI utilizzabile anche con integrazioni indisponibili.

## 5 — Decisione separata sulla sostituzione Home

### 5.1 — Ricerca compatibilità esatta

- Stato: `DA FARE`
- Ambito: Ricercare fattibilità per firmware esatto, rischi e alternative senza eseguire modifiche.
- Accettazione: Fonti aggiornate, incertezze e limiti documentati; nessuna compatibilità presunta.

### 5.2 — Decisione e recupero

- Stato: `DA FARE`
- Ambito: Preparare go/no-go, piano di rollback e recupero verificato.
- Accettazione: Decisione scritta; no-go mantiene app standalone; go non autorizza da solo azioni privilegiate.

## 6 — Opzionale, solo con autorizzazione separata

### 6.1 — Prototipo privilegiato circoscritto

- Stato: `DA FARE`
- Ambito: Solo dopo go, recupero verificato e autorizzazione esplicita: definire ed eseguire un singolo esperimento reversibile.
- Accettazione: Ambito e autorizzazione registrati; ripristino verificato prima di ulteriori interventi.

### 6.2 — Verifica avvio e Home

- Stato: `DA FARE`
- Ambito: Solo per azioni specificamente autorizzate: verificare comportamento, recupero e aggiornamenti.
- Accettazione: Esiti reali e procedura di ritorno allo stock documentati; nessuna garanzia di compatibilità futura.

## Vincoli trasversali

- Brand esatto `StefCors GL1tCh 0S`; logo canonico `assets/branding/StefCors_GL1tCh_0S_Glitch_Slow.svg` e regole di `ANIMATION_SPEC.md`.
- Riferimenti prioritari: `00_brand_home.png` per branding, `01_home_approved.png` per layout. Componenti reali, loghi terzi autentici o fallback neutri.
- Browser/mock prima del TV; dati simulati sempre indicati. Niente telemetria o servizi di rete introdotti implicitamente.
- D-pad, focus visibile, Back/OK, reduced motion e protezioni OLED lungo tutto lo sviluppo.
- Nessun exploit, patch, autostart o rimappatura Home senza istruzione separata esplicita e recupero verificato.

## Questioni aperte

- Modello completo, firmware e versione webOS del G5; disponibilità del dispositivo per test.
- Tecnica e provenienza dello sfondo: livelli originali, rendering procedurale o video locale con fallback.
- Applicazioni e ingressi prioritari; disponibilità legale dei relativi asset.
- Endpoint e dispositivi Home Assistant, da definire nella fase 4.
- Eventuale feedback audio, disattivato per default.
