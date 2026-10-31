# SPEC

## Scopo
Repository del profilo GitHub e sede dei workflow CI riusabili usati dagli altri repository.

## Funzionalità
- Profilo (`README.md`) con elenco dei progetti pubblici.
- Workflow riusabili `ci-standard` e `codeql-standard`, con modelli copiabili.
- Scansione Semgrep sul repo (`semgrep.yml`).
- Pagine statiche in `docs/` (raccolta bot, WelcomeGuard).

## Architettura
```
.github/workflows/  ci-standard.yml, codeql-standard.yml (workflow_call), ci-standard-prova.yml, semgrep.yml
.github/dependabot.yml
ci-standard/        README, modelli/ (ci.yml, dependabot.yml, lighthouserc.json), esempio/ (progetto di prova)
docs/               ci-riusabile.md, pagine statiche
```

## Flusso
Un repo chiamante definisce `.github/workflows/ci.yml` che richiama `ci-standard.yml@<SHA>`. Il job `build` esegue installazione, lint, test, build, SEO, audit, Lighthouse, axe; il job `dependency-review` gira solo sulle PR se abilitato. `ci-standard-prova.yml` valida i workflow su `ci-standard/esempio`.

## Interfacce
Input dei workflow: vedi [docs/ci-riusabile.md](docs/ci-riusabile.md). Nessun segreto richiesto; permessi di default `contents: read`.

## Stack (verificato il 2026-10-31)
| Componente | Versione |
| --- | --- |
| actions/checkout | v7.0.1 |
| actions/setup-node | v7.1.0 |
| actions/upload-artifact | v7.0.2 |
| actions/dependency-review-action | v5.0.0 |
| github/codeql-action | v4.39.1 |
| Semgrep (immagine) | 1.183.0 |
| @lhci/cli | 0.15.1 |
| @axe-core/cli | 4.14.0 |
| Node (default) | 22 |

Tutte le azioni sono fissate per SHA con il tag nel commento.

## Sicurezza
Permessi minimi per workflow, `persist-credentials: false`, `timeout-minutes` su ogni job, `npm ci --ignore-scripts` di default, strumenti npx a versione fissa, riferimenti a questo repo per SHA, CodeQL e Semgrep attivi.

## Limiti noti
- Solo progetti Node con `package-lock.json`.
- Revisione dipendenze non disponibile sui repo privati del piano Free; CodeQL sui privati richiede GitHub Code Security.
- CodeQL non copre PHP.
- Il check Codacy delle PR richiede l'autorizzazione dell'app da parte del proprietario.

## Roadmap
- Esempio d'uso reale in almeno un repo pubblico Node.
- Variante per progetti Python.
