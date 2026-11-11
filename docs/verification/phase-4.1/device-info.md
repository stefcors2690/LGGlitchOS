# 4.1 — Evidenza di accesso e inventario TV

Data: **2026-11-11**. Target locale: **glitch-g5**. CLI **3.2.6**, Node24.22.2, Windows. Indirizzo e chiave restano nella configurazione locale, non nel repository.

L'utente ha eseguito getkey nel proprio terminale. Successivamente è stata eseguita con approvazione la lettura:

```powershell
ares-device --device glitch-g5 --system-info
```

**Exit0**, connessione autenticata e informazioni restituite dal dispositivo. Estratto selezionato dell'output:

```text
modelName : OLED55G56LS.DPIQLJP
sdkVersion : 11.2.0
firmwareVersion : 43.21.96
```

Il modello base OLED55G56LS e il firmware coincidono con i dati comunicati dall'utente. La voce del menu dichiarata era **webOS26 / 11.2.0-3711**: la CLI conferma sdkVersion11.2.0, non riporta il suffisso build3711 in questo campo. Developer Mode/Key Server attivi e999h59m residui erano dichiarazioni utente, non misure aggiornate da questo comando.

Precedentemente: target registrato con utente prisoner/porta9922, default emulatore preservato; test TCP9922=True. Il successo di system-info conferma ora anche l'accesso effettivo, oltre alla raggiungibilità TCP.

Questa è una **verifica reale di accesso/inventario**, non un collaudo della nostra app sulla TV. Nessun IPK installato, app avviata, modifica firmware o rimappatura; nessun permesso runtime del futuro adapter provato. Matrice/fonti e procedura riproducibile in [dossier4.1](../../webos/PHASE_4_1.md). Nessun test browser/unitario ripetuto per questo aggiornamento documentale.
