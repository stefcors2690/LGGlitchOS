# START HERE — StefCors GL1tCh 0S

Aggiornato:2026-11-11. Punto di ingresso per qualsiasi IDE o PC: la continuità è nel repository, non nella chat.

## Stato corrente

- Fasi0–3 e4.1–4.3 completate; **4.4 COMPLETATA**, versione **0.4.3** installata e avviata sulla G5, nessuna release/commit/push.
- IPK artifacts/com.stefcors.glitchos_0.4.3_all.ipk generato/validato e installato; [guida](webos/README.md), [rapporto4.4](docs/verification/phase-4.4/report.md). Inspector reale: Chrome132.0.6834.207/FHD/DPR1 e tre campi getSystemInfo riusciti. Telecomando/uscita LG/riapertura/idle e risveglio confermati; taratura finale accettata. **Prossima5.1 — Catalogo applicazioni**, non avviata, da verificare con API pubbliche e fallback, senza dedurre permessi dal getSystemInfo.
- Solo runtime TV, anche Demo: overlay Canvas1600×900,179 gocce/32 particelle,30fps; browser Balanced invariato208/40/FHD. PNG originale/CSS/logo invariati.179 test/check/package/verify/CLI e regressioni Edge1080p/4K superati; equilibrio fluidità/dettaglio0.4.3 accettato dall'utente. Campione130s/idle45% e ripresa registrati, senza certificare GPU/UI fps/latency/WCAG.
- Scelta utente4.3: adapter webOS di default sul TV riconosciuto dal runtime LG, Demo opzionale dal footer, browser ancora Demo. Lettura sistema pubblica8s/cancel/retry; capability app/HDMI/domotica indisponibili con motivo fino alla fase5, Continua a guardare sempre Demo. Back461 chiude il dialogo e poi platformBack dalla Home; nessuna modifica Home/autostart. Riapertura fisica provata, pressione lunga/suspend lungo/riavvio TV non provati.
- Accesso reale4.1 al target locale glitch-g5: OLED55G56LS.DPIQLJP, firmware43.21.96, SDK11.2.0; menu webOS26/11.2.0-3711. CLI3.2.6 e associazione già preparati su questo PC: non rifare pairing se valido. [Inventario4.1](docs/webos/PHASE_4_1.md).
- Letture piattaforma con caricamento, errore/vuoto e Riprova da D-pad; scadenza10s, risultati tardivi ignorati, capability motivate e nessun comando duplicato o falso successo. Offline segnalato dal browser senza bloccare la Demo locale; fixture tecnica `/scripts/fixtures/platform-states.html` solo dev.
- Dopo 2 minuti senza input: opacità al 45% e pausa sfondo/logo. Il primo input ripristina la luminosità ed esegue la propria azione; focus conservato, reduced motion e visibilità prioritari. Nessun comando alla luminosità hardware.
- Home unica con brand/orologio, rail e tre widget Demo. Nessun menu superiore o controllo movimento per l'utente.
- Dialoghi informativi Demo per avvio app e Riprendi: Home inerte, Back/Escape/OK/Chiudi torna all'origine; secondo Back agisce sulla Home. HDMI/domotica inline, fallback inline se dialogo nativo assente.
- Pointer e D-pad condividono il focus: movimento seleziona, click/tap attivano, hover fermo non ruba focus. Simulatore dev-only con ?remoteDebug=1, poi **Telecomando · test**; frecce/OK/Back anche nel modale, input sintetici. Non incluso in produzione.
- Motore React/TypeScript/Canvas con PNG originale, pioggia, nebbia, neon/ologramma localizzati e particelle; veicoli opzionali non montati.
- Profili presenti anche in produzione: **Balanced attivo**, con la taratura TV dedicata sopra accettata in4.4. Solo il pannello è escluso dalla produzione.
- Pannello tecnico: `npm run dev`, URL Vite con `?backgroundDebug=1`, poi **Sfondo · debug**. Modifiche solo di sessione; riduzione movimento di sistema e pagina nascosta prevalgono.
- Verifica4.4:179 test/25file, lint/typecheck/build/IPK/CLI e Edge HTTP/file:// con bridge sintetico1080p/4K OK, runtimeErrors vuoto. Sul G5 reale: install/update/launch, lettura runtime/viewport/dati, idle con stop e primo input fisico, metriche/screenshot e riscontri utente. Limiti e tentativi corretti nel rapporto, nessuna prova hardware prolungata o disinstallazione/downgrade.

## Ordine di lettura

1. `AGENTS.md`: regole, autorizzazioni e limiti.
2. `PROJECT_STATUS.md`: stato verificato, decisioni e prossima attività.
3. [Trasferimento e ripresa su un altro PC](docs/HANDOFF.md): installazione, asset, comandi portabili, mappa dei file e punto di ripresa5.1.
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

> Leggi START_HERE.md, AGENTS.md, PROJECT_STATUS.md, docs/HANDOFF.md, PROJECT_SPEC.md, ROADMAP.md, webos/README.md e rapporto4.4. Preserva il lavoro locale4.1–4.4; fase4 completata,0.4.3 installata/collaudata sulla G5. Riprendi solo5.1 — Catalogo applicazioni: API pubbliche e permessi verificati, icone autentiche e fallback se assenti; non dedurre supporto da SSH/getSystemInfo. Taratura TV1600×900/179/32/30fps accettata da preservare, browser Balanced invariato. Target glitch-g5 già associato su questo PC; niente pairing/reinstallazione senza necessità, nuovi deploy richiedono istruzione esplicita. Distingui Inspector/feedback fisico/bridge sintetico; niente Home/autostart/root o5.2 anticipata. Aggiorna evidenze/versioni/documenti; niente credenziali o endpoint in Git.
