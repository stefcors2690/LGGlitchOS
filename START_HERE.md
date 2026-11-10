# START HERE — StefCors GL1tCh 0S

Aggiornato:2026-11-10. Punto di ingresso per qualsiasi IDE o PC: la continuità è nel repository, non nella chat.

## Stato corrente

- Fasi0–3 chiuse nel browser, con i limiti hardware/accessibilità documentati. Versione locale **0.3.4**, non pubblicata.
- Prossima microfase: **4.1 — Inventario dispositivo e fattibilità SDK**, ancora da iniziare. Prima acquisire modello, firmware/webOS reali e stato Developer Mode; nessun packaging o accesso privilegiato già verificato.
- Letture piattaforma con caricamento, errore/vuoto e Riprova da D-pad; scadenza10s, risultati tardivi ignorati, capability motivate e nessun comando duplicato o falso successo. Offline segnalato dal browser senza bloccare la Demo locale; fixture tecnica `/scripts/fixtures/platform-states.html` solo dev.
- Dopo 2 minuti senza input: opacità al 45% e pausa sfondo/logo. Il primo input ripristina la luminosità ed esegue la propria azione; focus conservato, reduced motion e visibilità prioritari. Nessun comando alla luminosità hardware.
- Home unica con brand/orologio, rail e tre widget Demo. Nessun menu superiore o controllo movimento per l'utente.
- Dialoghi informativi Demo per avvio app e Riprendi: Home inerte, Back/Escape/OK/Chiudi torna all'origine; secondo Back agisce sulla Home. HDMI/domotica inline, fallback inline se dialogo nativo assente.
- Pointer e D-pad condividono il focus: movimento seleziona, click/tap attivano, hover fermo non ruba focus. Simulatore dev-only con ?remoteDebug=1, poi **Telecomando · test**; frecce/OK/Back anche nel modale, input sintetici. Non incluso in produzione.
- Motore React/TypeScript/Canvas con PNG originale, pioggia, nebbia, neon/ologramma localizzati e particelle; veicoli opzionali non montati.
- Profili presenti anche in produzione: **Balanced attivo**; profilo/tarature finali saranno scelti dopo prove TV. Solo il pannello è escluso dalla produzione.
- Pannello tecnico: `npm run dev`, URL Vite con `?backgroundDebug=1`, poi **Sfondo · debug**. Modifiche solo di sessione; riduzione movimento di sistema e pagina nascosta prevalgono.
- Ultima verifica3.5 su Windows/Edge157:156 test unitari e lint/typecheck/build; DOM/AX,14 azioni da D-pad, Tab/inverso, dialoghi/focus1080p/4K e regressioni superati. Due attese idle reali e5min animati:29,99–30,01draw/s, risorse stabili, runtimeErrors vuoto. Screenshot ispezionati; [rapporto3.5](docs/verification/phase-3.5/report.md). Nessuna certificazione WCAG/screen reader/GPU/G5 o piena fedeltà; prove CDP/DOM distinte da hardware reale.

## Ordine di lettura

1. `AGENTS.md`: regole, autorizzazioni e limiti.
2. `PROJECT_STATUS.md`: stato verificato, decisioni e prossima attività.
3. [Trasferimento e ripresa su un altro PC](docs/HANDOFF.md): installazione, asset, comandi portabili, mappa dei file e punto di ripresa4.1.
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

> Leggi START_HERE.md, AGENTS.md, PROJECT_STATUS.md, docs/HANDOFF.md, PROJECT_SPEC.md, ROADMAP.md e docs/verification/phase-3.5/report.md. Verifica codice e Git preservando modifiche locali. Fasi0–3 completate nel browser, versione0.3.4; riprendi solo4.1 — Inventario dispositivo e fattibilità SDK. Prima acquisisci modello, firmware/webOS reali e stato Developer Mode; verifica fonti ufficiali aggiornate e prepara matrice capability/permessi. Non inventare dati TV, non anticipare packaging4.2, API4.3 o privilegi. Prima delle modifiche dichiara file e criteri. Preserva Home unica, mock/Demo, pointer/D-pad/simulatore dev-only, dialoghi/focus, fallback/retry/timeout letture10s, offline locale, idle2min/45%, sistema reduced motion/visibilità, brand, PNG, tarature e Balanced. Aggiorna documenti/evidenze; nessuna compatibilità G5, piena fedeltà, deploy, sostituzione Home o privilegio impliciti.
