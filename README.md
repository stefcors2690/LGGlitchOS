# StefCors GL1tCh 0S — Codex Development Kit v3

Cyberpunk LG OLED G5 custom launcher design and implementation reference.

- `START_HERE.md` — entry point and resume prompt for any IDE
- `PROJECT_STATUS.md` — current implementation state, checks and handoff notes
- `AGENTS.md` — agent instructions
- `PROJECT_SPEC.md` — product and architecture
- `ROADMAP.md` — small implementation steps, statuses and acceptance criteria
- `BRAND_IDENTITY.md` — brand and visual rules
- `VISUAL_REFERENCE_GUIDE.md` — how to use screenshots
- `ANIMATION_SPEC.md` — slow glitch timing and performance rules
- `references/` — five visual mockups including the branded Home
- `assets/branding/` — animated SVG and browser preview

Mockups are reference art, not interactive assets. All integrations with webOS must be tested on device; root/autostart are not guaranteed.

## Avvio browser — microfase 0.1

Prerequisito: Node.js >= 22.12 (consigliato Node 24 LTS) e npm. Ambiente verificato: Node 24.22.2, npm 11.19.1. Dipendenze risolte in `package-lock.json`.

```bash
npm install
npm run dev
```

Aprire l'indirizzo locale stampato da Vite (normalmente http://localhost:5173). Il server resta attivo fino a Ctrl+C. Per un'installazione riproducibile dal lockfile usare `npm ci` al posto di `npm install`.

```bash
npm run build
npm run preview
```

La build esegue prima TypeScript strict e genera `dist/`. Preview serve la build locale, normalmente su http://localhost:4173; non è un servizio di produzione. Non aprire direttamente `dist/index.html` tramite file://.

La configurazione segue la [guida ufficiale Vite](https://vite.dev/guide/). Le sole dipendenze runtime sono React e React DOM; i tool di sviluppo sono Vite, plugin React, TypeScript e tipi React.

## Struttura attuale

- `index.html`: documento italiano e punto di ingresso Vite.
- `src/main.tsx`: mount React con StrictMode.
- `src/app/App.tsx`: pagina minima di sviluppo.
- `src/styles/global.css`: stili statici essenziali; tema e shell TV previsti in 0.4.
- `tsconfig.json`, `src/vite-env.d.ts`, `vite.config.ts`: configurazioni strict, tipi asset e build.

I moduli platform, features e navigation saranno aggiunti nelle rispettive microfasi, quando avranno un'implementazione.

## Verifiche e limiti

Microfase 0.1: installazione npm, reinstallazione da lockfile, build con TypeScript strict e risposta HTTP del dev server verificate. Installazione e build verificate anche in una cartella temporanea priva di node_modules, utilizzando la cache dei pacchetti scaricati. Nessun collaudo visivo in browser o su TV ancora eseguito.

Lint, script typecheck separato e test runner saranno introdotti in **0.2**: `npm run lint`, `npm run typecheck` e `npm test` non sono ancora disponibili. Il controllo TypeScript è già incluso in `npm run build`.

La schermata è uno scaffold statico: Home, adapter mock, D-pad, logo integrato, tema completo e impostazioni movimento restano nelle prossime microfasi. Nessuna integrazione TV o servizio remoto presente.

Consultare `PROJECT_STATUS.md` per il punto di ripresa. Dopo ogni sessione aggiornare roadmap e contesto per consentire il passaggio a un altro IDE.
