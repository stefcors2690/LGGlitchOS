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

La microfase 0.1 ha introdotto lo scaffold React + TypeScript strict + Vite. Usare `npm install` (oppure `npm ci` dal lockfile), `npm run dev`, `npm run build` e `npm run preview`, con prerequisiti e dettagli in `README.md`. Lint e test arriveranno in 0.2. Consultare sempre `PROJECT_STATUS.md` e `ROADMAP.md` per lo stato aggiornato.

Per il logo, `assets/branding/preview.html` è l'anteprima standalone. Il collaudo richiesto prevede almeno due cicli da 9 secondi in Chrome/Edge, poi embedding e verifica su webOS quando disponibile. La presenza del file non certifica questi test.

La sostituzione completa della Home e la compatibilità root restano non verificate.
