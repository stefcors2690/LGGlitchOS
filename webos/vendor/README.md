# Libreria LG ufficiale

webOSTV.js **1.2.13**, 13.818 byte, file originale senza modifiche.
Fonte: https://webostv.developer.lge.com/assets/library/webOSTVjs-1.2.13.zip
Scaricato 2026-11-11 dalla pagina ufficiale LG webOSTV.js Introduction.
SHA256 JS: `2e83e028aef8651ef0b79b25a70c7ebc076a36781486a68623634bc0c2162670`.

Licenza Apache 2.0 inclusa integralmente in LICENSE-2.0.txt e nel pacchetto generato.
Si distribuisce solo webOSTV.js, non webOSTV-dev.js. Nessuna modifica al codice LG.
Il runtime viene caricato localmente solo nella build webOS, prima dell'app;
la build browser ordinaria non lo include. Usiamo esclusivamente service.request,
platform.tv e platformBack; non deviceInfo(), che richiederebbe gruppi ACG aggiuntivi.
