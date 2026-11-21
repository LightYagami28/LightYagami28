---
tags: [codacy, qualita, analisi-statica]
aggiornato: 2026-11-21
---

# Codacy: stato analisi e falsi positivi

Data verifica: 2026-11-21. Analisi Codacy dell'organizzazione `gh/LightYagami28`,
repository `LightYagami28`, ramo `main` (commit `445084b`).

## Esito

| Livello | Prima | Dopo |
| --- | ---: | ---: |
| Error | 0 | 0 |
| Warning | 62 | 0 |
| Info | 170 | 4 |
| Security | 0 | 0 |
| **Totale** | **232** | **4** |

Le 4 issue residue sono falsi positivi dimostrati, descritti sotto. Nessuna di esse
è stata chiusa come "accepted"/"won't fix" e non sono state usate soppressioni
(`nosec`, `noqa`, `eslint-disable`, `sonar-ignore`, baseline, esclusioni in
`.codacy.yml`, `sonar-project.properties` o `socket.yml`).

## Falsi positivi documentati

### `ESLint_jsdoc_require-file-overview` — `ci-standard/esempio/package.json` e `package-lock.json`

Il rule JSDoc `require-file-overview` richiede un commento `/** @file ... */` all'inizio
del file. I due file sono manifest JSON secondo gli standard npm: la sintassi JSON non
ammette commenti, quindi aggiungere un blocco JSDoc li renderebbe non validi e
`npm ci` fallirebbe. Il rule viene applicato a file JSON per un errore di
configurazione dello scanner, non per un difetto del repository.

### `ESLint_filenames_match-regex` — `ci-standard/esempio/package-lock.json`

Il nome `package-lock.json` è imposto da npm: `npm ci` e `npm install` lo cercano
con questo nome esatto. Rinominarlo per soddisfare una convenzione di naming
romperebbe la riproducibilità delle dipendenze nella CI. Il file è generato, non
scritto a mano.

### `Lizard_file-nloc-minor` — `ci-standard/esempio/package-lock.json`

Il conteggio NLOC di Lizard (409 righe) tratta il lockfile generato come codice
sorgente. Un lockfile è un artefatto generato da npm: la sua lunghezza non è una
misura di complessità del codice e non è modificabile a mano senza rompere
l'integrità delle dipendenze.

## Verifiche

- `npm test` in `ci-standard/esempio`: 11 test passati, 0 falliti.
- `npm run lint` in `ci-standard/esempio`: `tsc --noEmit`, uscita 0.
- Configurazione strumenti allineata al progetto: `.eslintrc.json`, `.oxlintrc.json`,
  `.markdownlint.json`. Le regole attive sono quelle effettivamente usate dal codice.
