# Verifica 1.6 — Widget ingressi

Data: 2026-11-09. Ambiente: browser Chrome headless su macOS, adapter mock locale. Nessuna prova LG G5.

## Implementazione

Widget Home con HDMI 1/2/3 e TV, badge Demo, icone SVG originali e cornice smussata segmentata cyan/magenta. Il mock condiviso conserva una sola sorgente attiva tra cambi di sezione; il reload azzera la simulazione. Lo stato visivo cambia dopo il successo, senza aggiornamenti ottimistici. Gestiti caricamento, elenco vuoto, capability assenti, errori e Promise rifiutate. Lock contro attivazioni concorrenti e protezione delle risposte dopo smontaggio. La pagina Ingressi rimane introduttiva.

## Controlli

- `npm run check`: lint, TypeScript strict, 69 test e build superati. Cinque test nuovi per lettura, capability, catalogo vuoto, errori/rejection, selezione esclusiva e conservazione dello stato dopo errori.
- `node scripts/verify-shell.mjs`: screenshot e misure 1920×1080, 3840×2160 e 390×844; navigazione D-pad rail/widget, passaggio orizzontale Continua a guardare → HDMI 1 → HDMI 2, Enter con feedback simulato, un solo aria-pressed attivo, ritorno al rail ricordato e rilettura dello stato tornando Home.
- Regressioni header, clock, rail, Continua a guardare, movimento, fallback e logo incluse nello stesso script. Esiti dettagliati in shell-metrics.json.

## Confronto visivo

Ispezionati shell-1920x1080.png e shell-3840x2160.png confrontandoli con references/00_brand_home.png e 01_home_approved.png. Conservati background.png, città aperta, rail sopra tre zone inferiori. Il widget centrale riprende titolo con icona monitor, quattro sorgenti affiancate, HDMI attivo magenta e alloggiamento cyan con segmenti magenta. Le misure scalano tra 1080p e 4K senza overflow TV; mobile usa impilamento verticale.

Differenze residue: il contorno della sorgente attiva è più sobrio e meno spesso del mockup; header e marchio canonico differiscono dal disegno concettuale, rail con fallback neutri al posto dei marchi terzi, contenuto Continua a guardare originale demo, Domotica ancora placeholder. I tre pannelli hanno larghezza uguale mentre il riferimento privilegia leggermente il primo. Nessuna fedeltà completa dichiarata.

## Limiti e seguito

Nessun ingresso, collegamento HDMI o cambio TV reale verificato. Leggibilità da divano e prestazioni sul G5 ancora da collaudare. Nessuna nuova dipendenza o servizio. Prossima microfase 1.7; debug interattivo browser con utente pianificato dopo 1.8 e prima della fase 2.
