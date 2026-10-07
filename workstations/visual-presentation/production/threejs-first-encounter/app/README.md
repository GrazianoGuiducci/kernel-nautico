# Presentazione 3D e demo locale

Richiede Node.js 22 o successivo e npm. Dalla cartella di questo file:

```sh
npm ci --ignore-scripts --no-audit --no-fund
npm run assets
npm test
npm run build
npm start
```

Apri http://127.0.0.1:8876/?public=1. La build è autonoma nel browser e conserva
le licenze dei componenti terzi. Il modello 3D è verificato per digest e
attribuito in public/MODEL_NOTICE.md.

La presentazione illustra il ciclo nautico; la demo conserva dati nel browser
e permette scambi espliciti tramite file. Usa esempi condivisibili. Nessun
modello AI viene chiamato dalla demo. Le fonti incluse nella build sono legate
alla revisione locale; una nuova revisione richiede una nuova qualificazione.
