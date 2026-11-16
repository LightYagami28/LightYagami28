# Architettura

```text
.github/workflows/  ci-standard.yml, codeql-standard.yml (workflow_call)
                    ci-standard-prova.yml, semgrep.yml, sonarcloud.yml
.github/dependabot.yml
ci-standard/        README.md, modelli/ (da copiare), esempio/ (progetto Node di prova)
docs/               ci-riusabile.md (guida), index.html, WelcomeGuard/ (pagine statiche)
```

## Flusso

Un repository chiamante ha un `ci.yml` che richiama `ci-standard.yml@<SHA>`. Il job `build` esegue
`npm ci --ignore-scripts`, lint, test, build, `seo:check`, `npm audit --omit=dev`, Lighthouse CI e axe;
gli script npm assenti sono saltati. Il job `dependency-review` gira solo sulle pull request se
abilitato. `codeql-standard.yml` è separato perché richiede `security-events: write`.
`ci-standard-prova.yml` richiama entrambi in locale su `ci-standard/esempio`.

Maggiori dettagli in [SPEC.md](SPEC.md).
