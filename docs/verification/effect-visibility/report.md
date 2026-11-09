# Correzione visibilità pioggia e nebbia

Riscontro utente: in debug gli effetti non erano percepibili. Individuate scie subpixel e doppia attenuazione dal passaggio sotto scrim; nebbia molto bassa e coperta in gran parte dai widget. L'utente conferma di non aver attivato la riduzione movimento. Correzione concentrata sulla visibilità degli effetti; nessuna modifica alla policy di sistema.

Correzioni: ordine immagine → scrim → effetti → UI, sprite pioggia più spesse (3.6px originarie), alpha .28–.68 e lunghezze 18–58px logici. Pool e budget invariati. Nebbia dal 38% con nuclei più alti, opacity default .2975 e semiperiodi 60/85s, drift ±8%. PNG e UI immutati, nessuna nuova dipendenza o controllo finale.

npm run check: 99 test, lint/typecheck/build OK. Lint rieseguito dopo modifica verifica browser. Chrome: collaudo completo layout, pioggia/nebbia, continuità, visibilità/riduzione, fallback e navigazione OK. Oltre al movimento pixel, misurata visibilità: 10244 pixel con alpha almeno 20/255 e picco 171/255 nel campione 1080p (valori dipendono dalla fase casuale). Non equivalgono a una misura percettiva universale o prestazionale G5.

Ispezionati rain-1920x1080.png e rain-3840x2160.png confrontando composizione con evidenze precedenti e riferimenti già letti: scie distinguibili e velo più evidente tra città/rail, label widget leggibili. Le immagini statiche non mostrano l'intero movimento; necessario riscontro della preview utente. Il 4K è viewport logico, screenshot DPR2. Restano differenze demo/brand/header autorizzate e limiti TV documentati. Prossima 2.4 invariata; nessuna macrofase nuova iniziata.
