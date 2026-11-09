# Verifica 1.4 — Navigazione D-pad essenziale

Data: 2026-11-09. Chrome locale headless sulla build di produzione, Vite preview su 127.0.0.1:5187. Nessuna verifica su LG G5 o API remote webOS.

## Implementazione

Grafo tipizzato in src/navigation/focusGraph.ts e hook useTvFocus.ts. Le zone sono header → controllo sfondo se abilitato → rail se visibile. Ogni controllo ha un ID stabile; la memoria conserva l’ultima posizione per zona. Le frecce orizzontali e verticali si fermano ai bordi senza wrapping. Le zone assenti vengono saltate; elementi hidden/inert o nativamente disabled non entrano nel grafo. Le card aria-disabled restano leggibili ma non avviano azioni.

Il primo tasto direzionale senza focus aggancia la sezione corrente nell’header. Native Enter e Space restano responsabili del click; OK/Accept/Select sono alias gestiti dalla pagina. L’autorepeat di attivazione è ignorato per evitare doppi avvii. Back/Escape/Backspace/BrowserBack torna Home e ne focalizza il pulsante. Non è un’intercettazione del tasto Home o di un comando di sistema.

MutationObserver e focusin mantengono il focus stabile e recuperano controlli rimossi/nascosti/disabilitati verso l’header corrente. Scorrimento nearest immediato per mostrare la card; nessun aggiornamento React per gestire ogni spostamento. Timer dell’orologio e feedback demo non ricreano l’hook. Listener e observer sono rimossi all’unmount.

## Verifiche superate

- `npm run check`: lint senza warning, typecheck strict, 58 test e build. Nuovi 21 casi per bordi, memoria, righe mancanti, cataloghi vuoti, riferimenti stale e mappa tasti.
- Chrome, soli eventi freccia/Invio: Home → App → rail, avvio Musica demo, ritorno header e rientro sull’ultima card ricordata.
- Invio produce un solo click; Enter in autorepeat non aggiunge un avvio.
- Focus conservato dopo feedback asincrono e tick dell’orologio.
- Ultima card e bordi: nessuna uscita dal rail o wrapping inatteso.
- Sezione Impostazioni: rail nascosto e controllo sfondo disabled saltati. Escape torna Home e focalizza Home; selezione rail ricordata.
- Cambio sezione programmatico mentre il focus è nel rail: recupero corretto sull’header della nuova sezione.
- Modalità movimento normale: controllo pausa raggiungibile con Su/Giù, memoria rail preservata. Alias OK attiva Libreria demo senza aprire app reali.
- Tab nativo conservato. Finestra 390×844: frecce raggiungono l’ultima card, scroll interno >0, card visibile e nessun overflow orizzontale della pagina.
- Regressioni header, clock, sfondo, logo, reduced motion, visibilità emulata, navette e fallback superate. Il confronto orologio dello script è stato reso stabile al cambio minuto, confrontando il testo con l’istante ISO rappresentato e verificandone la freschezza separatamente.

## Evidenze

- [Focus D-pad sull’ultima card](dpad-focus-1920x1080.png)
- [Home 1080p](shell-1920x1080.png)
- [Home 4K](shell-3840x2160.png)
- [Finestra stretta](shell-390x844.png)
- [Risultati automatici e misure](shell-metrics.json)

Ispezionati screenshot focus 1080p e Home 4K: grafica, cornici e proporzioni preservate rispetto alla 1.3. Nessuna modifica CSS in questa fase; confronto con riferimenti 00/01 ancora soggetto agli scostamenti già registrati nella 1.3 (simboli neutri, header/brand non identici al concept, widget strutturali). Non si dichiara fedeltà completa della Home.

## Riproduzione e limiti

`npm run check`, poi `npm run preview -- --host 127.0.0.1 --port 5187 --strictPort`; in un secondo terminale `node scripts/verify-shell.mjs` con Chrome locale. CHROME_PATH, SHELL_URL e VERIFY_OUTPUT configurabili, nessuna nuova dipendenza.

Il keymap è del browser: la consegna dei tasti del Magic Remote e il Back effettivo su webOS richiedono prove sul G5. Non sono aggiunti hook di sistema o fallback su keycode non verificati. Il Back attuale ritorna Home; overlay e cronologia restano nella 2.1. I widget futuri aggiungeranno zone e test. Nessun benchmark TV o collaudo fisico di leggibilità. Prossima microfase: 1.5.
