# Home senza controlli movimento

Rimossi su richiesta utente Movimento e logo e Pausa sfondo. Animazioni automatiche: logo e sfondo attivi quando pagina visibile e sistema senza reduced motion. Storage precedente ignorato. Nessun cambio a dispositivi demo o asset.

Verifiche: npm run check OK (79 test, lint/typecheck/build). Chrome: 1080p/4K/mobile senza overflow orizzontale né verticale TV, navigazione rail/widget e Back, controlli assenti, preferenze obsolete riduzione=true/logo=false ignorate dopo reload, riduzione di sistema applicata live a logo e sfondo. Esiti in shell-metrics.json.

Screenshot 1080p/4K ispezionati: spazio superiore libero come richiesto, logo/clock e composizione città/rail/tre widget preservati. Confronto con references 00/01: menu e controlli assenti per decisione esplicita; differenze residue già note di marchio canonico, fallback app e contenuti demo. Nessuna fedeltà completa o prova hardware dichiarata. Visibilità pagina mantiene la policy precedente; nessun test webOS. I vecchi helper di persistenza/test sono storico non collegato alla UI.
