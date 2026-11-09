# START HERE — StefCors GL1tCh 0S

Aggiornato:2026-11-09. Punto di ingresso per qualsiasi IDE o PC: la continuità è nel repository, non nella chat.

## Stato corrente

- Fasi0 e1 chiuse;2.1–2.8 completate, milestone1–4 del motore concluse.
- Prossima microfase: **2.9 — Ottimizzazione e stabilità**, ancora da iniziare.2.10 resta separata.
- Home unica con brand/orologio, rail e tre widget Demo. Nessun menu superiore o controllo movimento per l'utente.
- Motore React/TypeScript/Canvas con PNG originale, pioggia, nebbia, neon/ologramma localizzati e particelle; veicoli opzionali non montati.
- Profili presenti anche in produzione: **Balanced attivo**; profilo/tarature finali saranno scelti dopo prove TV. Solo il pannello è escluso dalla produzione.
- Pannello tecnico: `npm run dev`, URL Vite con `?backgroundDebug=1`, poi **Sfondo · debug**. Modifiche solo di sessione; riduzione movimento di sistema e pagina nascosta prevalgono.
- Ultima verifica implementativa:132 test, lint/typecheck/build e Chrome superati. Nessuna compatibilità o prestazione G5 certificata.

## Ordine di lettura

1. `AGENTS.md`: regole, autorizzazioni e limiti.
2. `PROJECT_STATUS.md`: stato verificato, decisioni e prossima attività.
3. [Trasferimento e ripresa su un altro PC](docs/HANDOFF.md): installazione, asset, comandi portabili, mappa dei file e piano2.9.
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

> Leggi START_HERE.md, AGENTS.md, PROJECT_STATUS.md, docs/HANDOFF.md, PROJECT_SPEC.md e ROADMAP.md. Verifica codice e Git locali. Il lavoro è completato fino alla2.8; riprendi solo2.9 — Ottimizzazione e stabilità. Prima delle modifiche dichiara file previsti e criteri. Preserva Home unica, dati Demo, brand canonico, PNG originale, tarature approvate, Balanced di produzione e policy sistema/visibilità. Usa i controlli canonici e non applicare due volte resolveBackgroundConfig. Esegui baseline sul PC attuale, profiling e prova prolungata con durata registrata; distingui misure Canvas/CSS e target30fps da prestazioni reali. Aggiorna roadmap, stato, istruzioni ed evidenze prima di concludere. Non dichiarare prove TV, deploy o funzioni privilegiate non eseguite e non anticipare2.10.
