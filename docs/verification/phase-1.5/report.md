# Verifica 1.5 — Continua a guardare demo

Data: 2026-11-09. Chrome locale headless sulla build Vite; nessuna prova su G5. Riferimenti confrontati: 00_brand_home.png e 01_home_approved.png; sfondo approvato background.png.

## Realizzato

Il primo widget della Home mostra Neon District, titolo fittizio demo, durata 80 minuti, posizione 38 minuti, avanzamento 47,5% e 42 minuti rimanenti. Sono dati locali esplicitamente demo, senza storico TV o streaming. Miniatura ricavata tramite CSS dallo sfondo fornito dall’utente, senza includere artwork cinematografico di terzi o modificare il PNG.

Titolo con icona play originale, separatore, miniatura sinistra, informazioni e barra magenta a destra. Cornice smussata a doppio livello, accenti magenta/cyan e fondo scuro seguono il trattamento del widget approvato. Il controllo nativo Riprendi è raggiungibile da tastiera e D-pad; comunica una ripresa simulata senza player, rete o cambio del progresso.

## Verifiche superate

- `npm run check`: lint senza warning, typecheck, 64 test e build.
- Sei nuovi test: quattro casi dati/progresso/ripresa (clamp, valori invalidi, assenza mutazioni) e due percorsi della nuova zona focus widgets.
- Browser: Giù dall’ultima card raggiunge Riprendi; Enter mostra Ripresa simulata e Nessun video avviato; focus e valore progress restano invariati.
- Su ritorna alla card ricordata. Uscendo da Home mentre il widget è focalizzato, il focus viene recuperato nell’header della nuova sezione.
- Layout 1080p/4K senza overflow; finestra 390×844 senza overflow orizzontale e con scroll verticale previsto. Regression suite di rail/header/orologio/Back/OK/sfondo ancora superata.
- Screenshot 1080p/4K ispezionati e confrontati con references 00/01.

## Confronto visivo e scostamenti

Il widget riprende posizione, gerarchia, miniatura, barra e cornice del riferimento. Titolo e immagine sono volutamente demo e non il film del mockup. La miniatura usa la scena già approvata, non un ritratto generato o artwork recuperato senza licenza. Ingressi e domotica restano placeholder fino a 1.6/1.7; le proporzioni complessive e il trattamento header/brand non sono ancora identici al concept. Etichette Demo e feedback sono aggiuntivi per rendere la simulazione esplicita. Non si dichiara fedeltà completa della Home.

## Evidenze

- [Home 1080p](shell-1920x1080.png)
- [Home 4K](shell-3840x2160.png)
- [Finestra stretta](shell-390x844.png)
- [Ripresa simulata e focus](watch-resume-1920x1080.png)
- [Misure e controlli](shell-metrics.json)

## Riproduzione, limiti e debug browser

Eseguire `npm run check`, avviare `npm run preview -- --host 127.0.0.1 --port 5187 --strictPort`, poi `node scripts/verify-shell.mjs` in un secondo terminale con Chrome locale. Lo script salva qui le evidenze; CHROME_PATH, SHELL_URL e VERIFY_OUTPUT configurabili.

Il messaggio del widget si azzera uscendo da Home, mentre i dati demo restano fissi. Nessun playback, integrazione streaming, persistenza o nuova dipendenza. G5 e prestazioni/leggibilità reali non verificati.

Come richiesto dall’utente, dopo 1.8 è pianificata una sessione interattiva di debug browser della Home completa, prima della fase 2; non è stata ancora svolta. Il debug è già possibile con npm run dev e DevTools secondo README. Le verifiche headless qui descritte sono distinte da quella sessione. Prossima microfase 1.6.
