# Neon più evidenti — calibrazione dopo 2.4

Richiesta utente: rendere l'ultimo effetto ben visibile. Default intensity 70→100, gain insegne .4→.6 e riflessi .16→.28: picco insegne .6 anziché .28, riflessi .28 anziché .112. Gradiente più pieno, respiro locale .12–1 e semicicli 4.5–9.9s. Stesse regioni/confini, niente flash rapidi, cali occasionali ancora 18%. Pioggia e nebbia invariate, PNG originale preservato.

npm run check OK: 104 test, lint/typecheck/build. Verifica Chrome estesa al minimo/massimo della pulsazione e acquisizione diagnostica neon-peak-1920x1080.png: il test sincronizza temporaneamente le luci al picco e poi ripristina le fasi; la produzione resta sfasata. Primo giro interrotto da controllo coordinate eseguito prima dell'aggiornamento ResizeObserver; il test ora attende l'allineamento corretto, senza allentare la tolleranza di 1px. Cleanup del browser di test reso limitato nel tempo sul solo processo Chrome avviato dallo script.

Confronto screenshot: bagliori più forti sulle insegne e riflessi più visibili, senza illuminare l'intera immagine o spostare la geometria della Home. La modulazione sovrappone luce al PNG e non può spegnere le insegne dipinte; screenshot non equivalgono a una prova percettiva nella preview utente. Nessuna fase nuova avviata, prossima 2.5 invariata. Limiti hardware e maschere sfumate rettangolari già documentati in 2.4.

Collaudo Chrome finale completato con successo: mapping 1080p/4K/mobile, pausa e fallback, runtime/console.error raccolti vuoti. Ispezionati picco 1080p e scena 4K, confronto con evidenze 2.4; git diff --check OK.
