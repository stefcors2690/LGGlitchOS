# Verifica 2.3 — Nebbia atmosferica

Data: 2026-11-09. Milestone 2 parte A completata, parte B neon ancora da fare. Ambiente Chrome headless/macOS, nessuna prova G5.

## Implementazione

FogLayer con due veli originali a gradienti radiali trasparenti, tinte cyan/magenta, clipping dal 42% della scena verso il basso, sotto scrim e UI. CSS transform/opacity, nessun blur/filtro/blend, immagine esterna, Canvas o RAF JS aggiuntivo. Veli estesi oltre i bordi e cicli ease-in-out alternate/alternate-reverse; semiperiodi default 120/170s. Opacità contenitore 0.175 al default density 35, ulteriormente attenuata da alpha e opacità dei veli.

Config fog.enabled/density/speed indipendente: off o density zero non montano layer; speed zero mantiene statico con durata finita. Config globale disabled non monta nebbia. Policy animated=false pausa CSS quando pagina nascosta, riprendendo dalla fase corrente; reduced motion globale disabilita animazioni e può ricreare il ciclo al ritorno. Nessun controllo utente reintrodotto. Vecchia city-fog non montata, pioggia/PNG preservati.

## Verifiche

- npm run check: lint senza warning, typecheck, 99 test e build OK. Quattro nuovi casi per densità/timing, disattivazione, statico e semantica non interattiva. Lint rieseguito dopo modifica script.
- Chrome: Home 1080p/4K/mobile, navigazione D-pad/OK/Back e focus durante effetti invariati; pioggia e fallback Canvas/immagine preservati.
- Un solo layer nebbia, nessuna city-fog duplicata, pointer-events none e filter none confermati. Timeline avanza e matrici del transform coincidono ai due lati del cambio ciclo (campionamento a ±1ms, senza attendere un ciclo reale).
- Visibilità emulata: veli pausati e timeline ferma entro tolleranza 40ms su osservazione 150ms; resume e reduced motion live verificati.
- Prima prova browser influenzata dal play() manuale della verifica del ciclo, che sovrascriveva il controllo CSS: corretta la prova ripristinando solo currentTime, quindi collaudo completo rieseguito con successo.
- Screenshot rain-1920x1080.png e rain-3840x2160.png includono ora pioggia e nebbia; il secondo ha pixel fisici 7680×4320 per DPR2, con viewport logico 3840×2160 e Canvas pioggia sempre max Full HD. Misure in shell-metrics.json.
- git diff --check OK; asset originale preservato. Nessuna misura 30fps o compatibilità webOS dichiarata.

## Confronto visivo

Ispezionati screenshot attivi 1080p/4K e confrontati con references/00_brand_home.png e 01_home_approved.png. Conservati città, camera, crop e disposizione rail/widget; velo inferiore tenue con tinte neon, senza nebbia sull'header o perdita di leggibilità delle card. Nessuna modifica al PNG né simulazione di oggetti incorporati in movimento. Lo screenshot congela una fase, la timeline documenta il movimento.

Differenze residue note: header/menu modificati su richiesta, marchio canonico differente dal concept, fallback app e dati widget Demo; neon localizzati/ologramma/particelle non implementati. Nessuna fedeltà completa dichiarata. Densità resta calibrabile nel contratto centrale; pannello tecnico solo nella futura 2.8.

## Ripresa e limiti

Prossima 2.4 — Neon e illuminazione localizzata per completare milestone 2. Stop/resume visibilità è emulato, non lifecycle TV. Cicli completi campionati matematicamente, non prova prolungata di minuti sul dispositivo. Profilazione/stabilità prolungata in 2.9–2.10, G5 quando disponibile. Nessuna dipendenza nuova.
