# Seconda calibrazione nebbia

Feedback utente: pioggia visibile, nebbia ancora troppo tenue. Modificato solo fog.density da 35 a 65; opacità contenitore .5525 anziché .2975. Invariati gradienti, velocità, posizione, layer e pioggia.

npm run check: 99 test, lint/typecheck/build OK. Script Chrome corrente eseguito con VERIFY_OUTPUT dedicato; screenshot e misure in questa cartella. Screenshot 1080p/4K confrontati con la calibrazione precedente: velo inferiore più evidente e widget leggibili. La resa finale resta da confermare nella preview utente. Nessuna nuova dipendenza o fase iniziata, prossima 2.4 invariata.

Collaudo Chrome completato con successo, inclusa pausa/ripresa: il test attende ora due frame per l’assestamento CSS prima del campionamento. git diff --check OK.
