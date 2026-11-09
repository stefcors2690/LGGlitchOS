# Home unica — modifica richiesta durante debug browser

Menu superiore rimosso su richiesta utente; header contiene logo canonico e clock. Funzioni sempre montate nella Home, preferenze movimento in details/summary, Escape richiude e torna alla prima app. Nessuna nuova API o dipendenza.

Verifiche: npm run check (lint/typecheck/test/build); script Chrome corrente verifica assenza menu, layout 1080p/4K/mobile, primo input al rail, cambio ingresso e switch domotico da tastiera, apertura preferenze, navigazione ai controlli e chiusura con Back, persistenza dopo reload. Screenshot e shell-metrics.json nella stessa cartella. Il primo giro del nuovo script non generava correttamente Enter nativo: corretto l'evento CDP e rieseguito con esito positivo.

Screenshot Home 1080p e 4K ispezionati e confrontati con riferimenti 00/01: città e disposizione rail/tre widget preservate, spazio superiore liberato dal menu come nuova eccezione esplicita ai concept. Controlli movimento restano discreti sopra la scena. Restano differenze documentate di cornici/header e marchi demo; nessuna fedeltà completa dichiarata. Preferenze aperte possono coprire parte della città; non è un dialogo modale e la navigazione Home resta disponibile.

Il vecchio scripts/verify-shell-sections-legacy.mjs è solo storico e non deve essere usato per accettare la UI corrente. Le vecchie evidenze motion/logo restano nei rapporti 1.8; il nuovo script copre i percorsi one-page. Hardware, Console/Network dell'utente e leggibilità da divano non dichiarati verificati.
