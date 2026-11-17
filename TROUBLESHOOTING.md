# Risoluzione dei problemi

## Il workflow chiamante non trova `ci-standard.yml`
Il riferimento deve essere `LightYagami28/LightYagami28/.github/workflows/ci-standard.yml@<SHA>` con
uno SHA esistente (vedi "Aggiornare gli SHA" in [docs/ci-riusabile.md](docs/ci-riusabile.md)).

## `npm ci` fallisce
Serve un `package-lock.json` coerente con il `package.json`. La CI esegue `npm ci --ignore-scripts`.

## `npm audit` blocca la pipeline
Il livello minimo è l'input `audit-level`: correggi la dipendenza o alza il livello consapevolmente.

## CodeQL non trova i permessi
Il chiamante deve concedere `security-events: write` al job che richiama `codeql-standard.yml`.

## L'analisi SonarCloud viene saltata
Succede se manca `SONAR_TOKEN` (pull request da fork e da Dependabot): comportamento voluto.
