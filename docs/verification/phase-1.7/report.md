# Verifica 1.7 — Widget domotica

Data: 2026-11-09. Browser Chrome headless locale su macOS. Nessuna prova sul G5.

## Risultato

Sostituito l'ultimo placeholder Home con SmartHomeWidget. Luce soggiorno e presa sono switch Demo dal medesimo MockPlatformAdapter di app e ingressi. Stato acceso/spento testuale e role=switch/aria-checked; nomi accessibili, feedback live e ID stabili per la zona widgets. Aggiornamento dopo successo, nessuna mutazione visiva su errore; lock sincrono contro comandi concorrenti e protezione da risposte dopo smontaggio. Elenco vuoto, caricamento, capability assenti e errori/rejection distinti. Tornare Home rilegge lo stato mock; reload pagina lo azzera.

## Verifiche

- `npm run check`: lint senza warning, typecheck strict, 74 test e build OK.
- Cinque nuovi test coprono lettura, on/off e indipendenza dei due switch, discovery/capability, dati vuoti, errori e Promise rifiutate. Rilanciati i cinque test dopo aver esteso le asserzioni on/off e indipendenza: OK.
- `node scripts/verify-shell.mjs`: layout 1080p/4K/mobile, percorso D-pad dagli ingressi alla luce e alla presa, accensione e spegnimento luce, accensione presa, bordo destro senza wrap, Up al rail ricordato, Down allo switch ricordato, recupero focus e stato conservato dopo cambio sezione.
- Regressioni di header, orologio, rail, Continua a guardare, ingressi, sfondo, pausa, reduced motion e fallback incluse. Risultati in shell-metrics.json; screenshot smart-home-on-1920x1080.png mostra lo stato dopo comando simulato.

## Confronto visivo

Ispezionati shell-1920x1080.png e shell-3840x2160.png contro references/00_brand_home.png e 01_home_approved.png. Conservati background.png e disposizione a tre pannelli sotto il rail. Pannello domotica ora con cornice smussata segmentata cyan/magenta, icona casa e controlli scuri con stato acceso magenta; focus cyan distinto dallo stato. Scaling coerente senza overflow TV; mobile impila i widget.

Differenze residue: due controlli più larghi anziché i quattro del concetto. Il contratto attuale prevede solo switch: tapparelle e termostato non vengono rappresentati come funzionali, e non mostriamo temperature inventate. Icone e dettagli della cornice sono originali, meno elaborati del mockup. Header ancora da allineare; rail con simboli neutri al posto di marchi terzi; contenuto Continua a guardare fittizio. Non dichiarata fedeltà completa. La sezione Domotica è ancora introduttiva; i comandi sono nel widget Home.

## Limiti e ripresa

Nessun servizio Home Assistant, rete, dato ambiente o dispositivo reale. Nessuna nuova dipendenza o modifica ai contratti. Leggibilità da divano e prestazioni hardware non collaudate. Prossima 1.8 — impostazioni movimento, seguita dal checkpoint debug interattivo browser con utente prima della fase 2. La verifica automatica qui documentata non sostituisce tale sessione.
