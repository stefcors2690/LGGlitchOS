# Microfase 3.1 — Overlay e Back

Data: 2026-11-09. Base locale `4d1ca97` (`fase 2 completata`), working tree inizialmente pulito. Ambito confermato dall'utente: dialoghi informativi per avvio app e Riprendi; HDMI/domotica mantengono il feedback esistente. Nessun commit, tag, push o deploy.

## Comportamento e implementazione

`ActionDialog.tsx` usa un dialog nativo con showModal, nome/descrizione accessibili, un pulsante Chiudi, cornice cyan/magenta e sfondo scuro. Home resa inerte dal browser mentre è aperto. Focus iniziale su Chiudi, Tab/Shift+Tab e frecce confinati al dialogo. Enter e pulsante nativi, alias OK e Back/Escape supportati; ripetizione di attivazione/Back ignorata. Nessuna intercettazione del tasto Home di sistema o API webOS.

La shell possiede un solo dialogo. AppRail lo richiede dopo il risultato dell'adapter, senza trasformare errori in successi; ContinueWatching mostra la ripresa simulata senza video o modifica progresso. I feedback inline restano disponibili. Una richiesta arrivata mentre un dialogo è aperto non sostituisce quello visibile; il relativo feedback inline è comunque conservato, senza coda o overlay sovrapposti.

Chiudere ritorna all'origine tramite ID stabile, anche da widget: non va subito alla prima app. Solo un successivo Back agisce sulla Home. Se l'origine non è disponibile, la policy sceglie la prima app utilizzabile, poi un altro controllo visibile; con nessun controllo non forza focus a un elemento rimosso. Se showModal non è disponibile o fallisce, il dialogo viene rimosso e la Home resta utilizzabile con feedback inline. useTvFocus sospende la gestione Home durante il modale; il pannello tecnico non modale rimane indipendente.

Nessuna modifica a motore, PNG, logo, tarature, progressi Demo, comandi HDMI/domotica o adapter. Nessuna dipendenza aggiunta. Versione locale0.3.0 in package/lockfile, inizio della fase3; non è chiusura della fase3 o pubblicazione.

## Verifiche

Ambiente: Windows11 Pro N10.0.26300 x64, Node24.22.2/npm11.19.1, Edge156.0.4314.58 headless con GPU disattivata. Il primo typecheck ha rilevato isComposing sul tipo evento React; corretto usando nativeEvent.isComposing. Controlli successivi prima del bump: **141 test in21 file, lint, TypeScript e build superati**, inclusi6 casi della policy di ritorno focus (origine rail/widget, rimossa, non disponibile, fallback e lista vuota).

Primi run browser fermati sul tasto Back del collaudo: su Windows CDP invia un evento con key/code vuoti per questo nome non standard. Rilevato con probe di tastiera, poi rimosso; il test ora distingue tasti standard CDP dagli alias DOM sintetici. Le catture preliminari nella radice, recheck/ e key-diagnostic/ non costituiscono accettazione completata.

**Ultimo run completo superato**: `complete/dialog-metrics.json` e `complete/shell-metrics.json`, `runtimeErrors=[]`. Check sulla **0.3.0** superato:141 test in21 file, lint/TypeScript/build; bundle finale `index-CPqspdGL.js`. Il run precedente in final/ resta il controllo intermedio prima di estendere il ritorno focus al caso CSS visibility:hidden/collapse; l'ultimo run verifica anche questo caso. Modulo di collaudo dedicato `scripts/verify-dialogs.mjs`, richiamato dallo script Home esistente; nessuna dipendenza browser npm aggiunta.

Verificati:

- Entrambi i flussi app/Riprendi, etichetta/descrizione nell'albero accessibilità Chromium, vero stato nativo `:modal` e focus iniziale su Chiudi.
- Tab/Shift+Tab e frecce, autorepeat Escape/Enter, tentativo di focus sulla Home inerte, click sul backdrop che non chiude, seconda richiesta che non sostituisce il modale.
- Escape/Back/BrowserBack/Backspace/OK/Accept/Select/Enter, pulsante Chiudi, riaperture ripetute e ritorno al controllo effettivo di rail/widget. Il successivo Back torna alla prima app; origine disabilitata o nascosta via CSS ripiega sulla prima app disponibile.
- Manca showModal: feedback inline e focus Home disponibili, nessun errore runtime. Dev StrictMode e pannello tecnico aperto: Escape chiude solo il modale frontale e conserva il pannello; poi la sua chiusura resta separata.
- Bounds del dialogo1920×1080,3840×2160 e390×844 entro viewport; screenshot salvati. Stessi nodi PNG/Canvas durante il modale, rendering Canvas attivo e campione disponibile. Nessuna nuova misura prestazionale del G5.
- Regressioni Home/sfondo complete del collaudo esistente: widget, profili, pannello, Canvas assente, sorgente assente/ritorno, errori contextlost/draw iniettati, disattivazioni, resize, visibilità e reduced motion OK. Il fallback senza Canvas include apertura/chiusura di Riprendi con ritorno al widget.

## Riproduzione

Dalla radice, `npm run check`; in due terminali:

```powershell
npm run dev -- --host 127.0.0.1 --port 5188 --strictPort
npm run preview -- --host 127.0.0.1 --port 5187 --strictPort
```

In questa sessione server avviati con gli equivalenti entry point `node node_modules/vite/bin/vite.js` e `node node_modules/vite/bin/vite.js preview`, stessi argomenti. Poi:

```powershell
$env:CHROME_PATH = 'C:\Program Files (x86)\Microsoft\Edge\Application\msedge.exe'
$env:VERIFY_OUTPUT = 'docs/verification/phase-3.1/complete'
$env:PROFILE_TEST_URL = 'http://127.0.0.1:5188/scripts/fixtures/background-profiles.html'
$env:BACKGROUND_TEST_URL = 'http://127.0.0.1:5188/'
node scripts/verify-shell.mjs
```

SHELL_URL usa il default127.0.0.1:5187. Per nuove prove usare cartelle output nuove. Il browser viene avviato fuori sandbox con approvazione. STABILITY_MS e ALLOCATION_MS non impostate: niente nuova prova di cinque minuti o profiling allocazioni in3.1; le evidenze2.9/2.10 restano separate.

## Confronto e limiti

Riferimenti00/01 ispezionati prima delle modifiche; ispezionati Home1080p e dialoghi1080p/4K/mobile (4K visualizzato ridimensionato a2048×1152). Il modale è un nuovo componente non presente nei mockup: usa token, cornice cyan/magenta, contrasto scuro e focus visibile della Home, senza animazioni, flicker o asset terzi. A dialogo chiuso, gerarchia e composizione della2.10 preservate; a dialogo aperto la scena è oscurata dal backdrop nativo e l'attenzione è sul messaggio. Nessuna dichiarazione di fedeltà completa: restano differenze precedenti di header, simboli Demo, pannelli e footer già documentate nella2.10. PNG originale verificato invariato (SHA2567ac43c3324781f7061c8e5a4527d0234ed97c43161f70123e5d619bae62b8482).

I controlli accessibili sono verificati mediante DOM/albero accessibilità Chromium e input automatici; nessuna prova con screen reader, Magic Remote, GPU/G5 o altro browser dichiarata. Back/BrowserBack/OK/Accept/Select usano KeyboardEvent DOM sintetici perché CDP Windows non ne inoltra direttamente i nomi; Escape/Enter/Backspace sono verificati tramite CDP. Non è certificazione hardware. Il test della seconda richiesta usa un click programmatico sotto il modale per simulare un risultato tardivo, non un click utente attraverso la Home inerte. La richiesta con origine disabilitata è una condizione iniettata nel DOM. Compatibilità dialog nativo webOS ancora da verificare.

## Chiusura e ripresa

**3.1 completata**, versione locale0.3.0; fase3 ancora aperta. Prossima **3.2 — Pointer e simulatore telecomando**, non avviata. Nessun nuovo blocco identificato. Nessuna pubblicazione o funzione privilegiata; prove hardware future. Verifica diff e coerenza package/lockfile riuscita.
