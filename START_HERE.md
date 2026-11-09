# START HERE — StefCors GL1tCh 0S

Aggiornato:2026-11-09. Punto di ingresso per qualsiasi IDE o PC: la continuità è nel repository, non nella chat.

## Stato corrente

- Fasi0,1 e2 chiuse in browser;2.1–2.10 e tutte le cinque milestone del motore completate. Versione locale **0.2.0**, non pubblicata.
- Prossima microfase: **3.1 — Overlay e Back**, ancora da iniziare.
- Home unica con brand/orologio, rail e tre widget Demo. Nessun menu superiore o controllo movimento per l'utente.
- Motore React/TypeScript/Canvas con PNG originale, pioggia, nebbia, neon/ologramma localizzati e particelle; veicoli opzionali non montati.
- Profili presenti anche in produzione: **Balanced attivo**; profilo/tarature finali saranno scelti dopo prove TV. Solo il pannello è escluso dalla produzione.
- Pannello tecnico: `npm run dev`, URL Vite con `?backgroundDebug=1`, poi **Sfondo · debug**. Modifiche solo di sessione; riduzione movimento di sistema e pagina nascosta prevalgono.
- Ultima verifica2.10 su Windows:135 test, lint/typecheck/build e Edge superati. Home produzione per5min,29,99–30,02draw/s locali, risorse stabili; fallback/recupero Canvas, effetti off, resize, policy e focus verificati. Vecchia scena rimossa; rapporti2.9/2.10 separati. Nessuna compatibilità/prestazione G5 o piena fedeltà visiva certificata.

## Ordine di lettura

1. `AGENTS.md`: regole, autorizzazioni e limiti.
2. `PROJECT_STATUS.md`: stato verificato, decisioni e prossima attività.
3. [Trasferimento e ripresa su un altro PC](docs/HANDOFF.md): installazione, asset, comandi portabili, mappa dei file e punto di ripresa3.1.
4. `PROJECT_SPEC.md` e `ROADMAP.md`: contratti e criteri della microfase.
5. `BRAND_IDENTITY.md`, `VISUAL_REFERENCE_GUIDE.md`, `ANIMATION_SPEC.md`: riferimenti e vincoli correnti.
6. `README.md`, `src/features/background/README.md`, `docs/specs/CYBERPUNK_BACKGROUND_ENGINE.md` e codice reale.

Controllare `git status` e preservare modifiche locali. Le sezioni numerate delle specifiche e i rapporti di verifica raccontano anche la storia: per la UI corrente prevalgono lo stato sopra e PROJECT_STATUS, non i vecchi menu/impostazioni eliminati. Prima di cambiare la UI ispezionare references00/01 e conservare `references/background.png` e il logo canonico.

## Avvio sul nuovo PC

Dalla radice del repository, con Node>=22.12 e npm:

```bash
npm ci
npm run check
npm run dev
```

Aprire l'indirizzo stampato da Vite. La cartella del vecchio PC non deve coincidere con quella nuova. Copiare/sincronizzare sorgenti, documenti, asset e lockfile; reinstallare le dipendenze. Non occorrono `.env`, SDK webOS o servizi esterni per la preview. Procedura Git/trasferimento, Chrome e PowerShell in [HANDOFF](docs/HANDOFF.md).

## Prompt da dare all'altro IDE

> Leggi START_HERE.md, AGENTS.md, PROJECT_STATUS.md, docs/HANDOFF.md, PROJECT_SPEC.md, ROADMAP.md e docs/verification/phase-2.10/report.md. Verifica codice e Git locali preservando le modifiche non committate. Fase2 completata in browser, versione locale0.2.0; riprendi solo3.1 — Overlay e Back. Prima delle modifiche dichiara file e criteri. Definisci dialoghi accessibili, chiusura Back/Escape e ripristino focus mantenendo Home unica, mock Demo, brand, PNG, tarature, Balanced e policy automatiche. Il motore ha già cleanup/fallback verificati; usa controlli canonici risolti una volta, nessun controllo movimento finale. Aggiorna documentazione e nuove evidenze, confronta screenshot quando cambia la UI. Non dichiarare fedeltà completa, prestazioni G5, prove TV, deploy o privilegi non verificati/autorizzati.
