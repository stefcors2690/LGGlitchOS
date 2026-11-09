# START HERE — StefCors GL1tCh 0S

Punto di ingresso per qualsiasi IDE o agente. La continuità del lavoro è nei file del repository, non nella chat.

## Ordine di lettura

1. `AGENTS.md`: regole di lavoro e confini delle autorizzazioni.
2. `PROJECT_STATUS.md`: stato reale, ultimo lavoro, verifiche e prossimo passo.
3. `PROJECT_SPEC.md` e `ROADMAP.md`: obiettivi, architettura e microfasi.
4. `BRAND_IDENTITY.md`, `VISUAL_REFERENCE_GUIDE.md`, `ANIMATION_SPEC.md`: vincoli visivi e movimento.
5. `README.md` e sorgenti/configurazioni effettivamente presenti; controllare anche `git status` e modifiche locali.

Prima di lavorare sulla UI, ispezionare `references/00_brand_home.png` e `references/01_home_approved.png`, poi gli altri riferimenti se pertinenti. Preservare `references/` e `assets/branding/`.

## Prompt per riprendere lo sviluppo

> Leggi START_HERE.md e i documenti nel suo ordine di lettura. Verifica lo stato contro i file reali e le modifiche Git locali. Riprendi la microfase attiva o la prossima indicata in PROJECT_STATUS.md e ROADMAP.md, una sola alla volta. Prima delle modifiche indica file previsti e criteri di accettazione. Mantieni browser/mock, dati demo espliciti, navigazione TV e vincoli del brand. Esegui i controlli disponibili e riporta cosa non è verificato. Prima di concludere aggiorna ROADMAP.md, PROJECT_STATUS.md e ogni altro documento interessato, lasciando un punto di ripresa concreto. Non eseguire modifiche privilegiate al TV senza autorizzazione separata e recupero verificato.

## Stato e comandi

La microfase 0.1 ha introdotto lo scaffold React + TypeScript strict + Vite. Usare `npm install` (oppure `npm ci` dal lockfile), `npm run dev`, `npm run build` e `npm run preview`, con prerequisiti e dettagli in `README.md`. La microfase 0.2 aggiunge `npm run lint`, `npm run typecheck`, `npm test`, `npm run test:watch` e `npm run check` (tutti i controlli). La microfase 0.3 introduce contratti e adapter mock in `src/platform/`, con uso e limiti descritti in `PROJECT_SPEC.md` e `README.md`; non è ancora collegato alla pagina. La microfase 0.4 aggiunge tema neon, shell TV e logo con reduced motion; evidenze browser in `docs/verification/phase-0.4.md`. La microfase 1.1 aggiunge sfondo locale `references/background.png` scelto dall’utente, pioggia/foschia e navette aggiuntive occasionali; pausa, reduced motion e pagina nascosta sono gestiti dalla policy in `src/motion/`. Evidenze in `docs/verification/phase-1.1-background/report.md`. La 1.2 aggiunge header con cinque sezioni selezionabili e orologio locale reale; evidenze in `docs/verification/phase-1.2/report.md`. La 1.3 collega il rail demo a un adapter condiviso; card, feedback e selezione persistente tra sezioni sono in `src/features/apps/`, evidenze in `docs/verification/phase-1.3/report.md`. La 1.4 introduce focus manager e tasti browser in `src/navigation/`; regole e comandi nel README, evidenze in `docs/verification/phase-1.4/report.md`. La 1.5 aggiunge Continua a guardare demo e zona focus widgets; dopo 1.8 è pianificato il debug interattivo browser, già disponibile secondo README. Evidenze in `docs/verification/phase-1.5/report.md`. La 1.6 aggiunge il widget ingressi Home con quattro sorgenti mock, cambio simulato e memoria nello stesso adapter; evidenze in `docs/verification/phase-1.6/report.md`. La 1.7 collega luce e presa demo al widget Home in `src/features/smart-home/`, con switch accessibili, gestione errori e stato conservato tra sezioni; evidenze in `docs/verification/phase-1.7/report.md`. La 1.8 aggiunge preferenze movimento/logo persistenti, precedenza del sistema e pagina nascosta; evidenze in `docs/verification/phase-1.8/report.md`. Fase 1 chiusa per approvazione esplicita utente dopo debug e correzioni; prossima microfase 2.1 — Overlay e Back. Consultare sempre `PROJECT_STATUS.md` e `ROADMAP.md` per lo stato aggiornato.

Per il logo, `assets/branding/preview.html` è l'anteprima standalone. Il collaudo richiesto prevede almeno due cicli da 9 secondi in Chrome/Edge, poi embedding e verifica su webOS quando disponibile. La presenza del file non certifica questi test.

La sostituzione completa della Home e la compatibilità root restano non verificate.

## Home unica — modifica layout approvata dall’utente

La navigazione superiore per sezioni è stata eliminata su richiesta utente. Header con solo brand e orologio; app, Continua a guardare, ingressi e domotica sono sempre nella Home. Il controllo espandibile “Movimento e logo” contiene le preferenze esistenti. Frecce percorrono controls → rail → widgets → settings (solo se aperte); primo input direzionale e Back/Escape portano alla prima app, Back richiude anche le preferenze. Mantiene badge Demo, sfondo e componenti reali. Questa decisione sostituisce le precedenti indicazioni sulle cinque sezioni; i riferimenti 00/01 restano guida estetica, con eccezione esplicita del menu rimosso. Verifiche correnti: scripts/verify-shell.mjs; vecchio collaudo sezioni conservato in scripts/verify-shell-sections-legacy.mjs, non compatibile con UI attuale.

## Policy corrente — animazioni fisse, senza controlli

Su richiesta utente rimossi “Movimento e logo” e “Pausa sfondo”: nessun pannello o preferenza modificabile nella Home. Sfondo e logo animati automaticamente quando la pagina è visibile e il sistema non richiede movimento ridotto. Reduced motion e pagina nascosta continuano a fermarli automaticamente. La vecchia chiave localStorage glitchos.motion.v1 è ignorata; le precedenti descrizioni di impostazioni e pausa sono storico, sostituite da questa decisione. Primo input direzionale e Back tornano al rail; frecce tra rail e widget. Evidenze correnti in docs/verification/fixed-motion/.
