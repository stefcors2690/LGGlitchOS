# Verifica 1.3 — Rail applicazioni demo

Data: 2026-11-09. Build Vite, Chrome locale headless; nessuna prova su LG G5. Riferimenti confrontati: 00_brand_home.png per branding, 01_home_approved.png per layout, background.png come sfondo effettivo.

## Funzionamento e verifiche

- Unico MockPlatformAdapter creato in App.tsx, condiviso con il rail. Catalogo ampliato a sette app generiche; nessuna dichiarazione di app installate sul TV.
- AppRail resta montato durante il cambio sezione; visibile in Home/App, nascosto altrove. Selezione e feedback conservati.
- Tab/focus selezionano, Enter/Space o click richiedono un avvio demo. Feedback live esplicito: nessuna applicazione reale aperta. Blocco chiamate concorrenti, distinzione loading/error/empty, motivo di avvio non supportato e gestione Promise rifiutate.
- `npm run check`: lint senza warning, typecheck, 37 test e build riusciti. Sei nuovi test sul flusso catalogo/avvio: successi demo, discovery/capability assenti, errore catalogo/rejection, catalogo vuoto e lancio fallito/rejection.
- Chrome: avvio mediante Enter e focus conservato; selezione della quarta card conservata cambiando sezione; sette card presenti.
- 1080p e 4K senza overflow; 390×844 senza overflow orizzontale e scroll verticale previsto. Overflow iniziale del root grid su finestra stretta corretto con colonna minmax(0,1fr); scroll confinato al rail.
- Verifiche precedenti di header, clock, immagine, pause, reduced motion, visibilitychange emulato e navette ancora superate.

## Confronto visivo con i riferimenti

- Rimossi dalla vista in Home il grande titolo e il testo promozionale che coprivano la città; titolo mantenuto accessibile.
- Rail nella fascia centrale-bassa (~54% altezza della superficie TV), card larghe e basse con spaziature regolari. La geometria scala proporzionalmente a 4K.
- Cornici smussate a doppio contorno, superfici blu/cyan con variazioni magenta, selezione sollevata leggermente e glow magenta. Il focus tastiera usa il contorno interno cyan, evitando tagli da parte del contenitore scroll.
- Originali simboli neutri al posto dei marchi: i loghi dei servizi del mockup non sono disponibili con provenienza verificata. Le card mostrano sempre Demo. Non si dichiarano autentici loghi che non lo sono.
- Differenze residue: mockup con rail parzialmente fuori schermo ai lati e card selezionata più grande; implementazione con sette card interamente accessibili e proporzioni vicine ma non identiche. Header/brand canonico hanno trattamento diverso dalla concept art; widget inferiori restano strutturali, senza artwork o contenuti reali. Controllo pausa e feedback demo sono elementi aggiuntivi necessari alla preview. Meteo non presente.

Non si dichiara fedeltà completa del risultato Home. Il rail converge alla geometria e al trattamento visivo approvati; i dettagli restanti sono esplicitati per la prosecuzione, senza introdurre marchi imitati o dati fittizi come reali.

## Evidenze

- [Home 1080p](shell-1920x1080.png)
- [Home 4K](shell-3840x2160.png)
- [Finestra stretta](shell-390x844.png)
- [Avvio simulato e focus](launch-demo-1920x1080.png)
- [Altra sezione](settings-1920x1080.png)
- [Misure e risultati](shell-metrics.json)

Screenshot TV ispezionati e confrontati con references 00/01; acquisizioni con reduced motion. La selezione iniziale è Cinema demo, mentre il focus appare dopo un’azione di tastiera. Il fotogramma navette mantiene la verifica della fase 1.1.

## Riproduzione e limiti

`npm run build`, poi `npm run preview -- --host 127.0.0.1 --port 5187 --strictPort`; in un secondo terminale `node scripts/verify-shell.mjs` con Chrome locale. Destinazione predefinita: questa cartella. CHROME_PATH, SHELL_URL e VERIFY_OUTPUT configurabili.

Errori/capability/empty sono verificati nei test di flusso; il browser collauda lo scenario demo predefinito. Nessuna integrazione webOS, nuova dipendenza o persistenza su reload. Focus manager D-pad completo in 1.4; nessuna prestazione su hardware o leggibilità da divano certificata. Prossima microfase: 1.4.
