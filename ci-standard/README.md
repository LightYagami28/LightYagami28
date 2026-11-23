# CI standard riusabile

Workflow riusabili per i repo di LightYagami28:

- `.github/workflows/ci-standard.yml`: `npm ci`, lint, test, build,
  `seo:check`, `npm audit` sulle dipendenze di produzione, Lighthouse CI
  (accessibilità con axe-core, SEO, best practice, prestazioni), axe sul
  sito statico, revisione delle dipendenze sulle PR.
- `.github/workflows/codeql-standard.yml`: CodeQL, separato perché richiede
  `security-events: write`.
- `.github/workflows/ci-standard-prova.yml`: prova dei due workflow sul
  progetto `ci-standard/esempio`.

Gli script npm mancanti vengono saltati (`--if-present`).

## Come si usa

1. Copia `modelli/ci.yml` in `.github/workflows/ci.yml` e sostituisci
   `<SHA>` con lo SHA completo del commit approvato di questo repo.
2. Copia `modelli/dependabot.yml` in `.github/dependabot.yml`.
3. Se usi Lighthouse, copia `modelli/lighthouserc.json` e imposta
   `staticDistDir` sulla cartella del build.
4. Repo privati sul piano Free: la revisione delle dipendenze non è
   disponibile; il modello la attiva solo sui repo pubblici. CodeQL sui
   privati richiede GitHub Code Security: togli il job `codeql` se non c'è.

## Regole

- Azioni fissate per SHA completo con la versione nel commento sulla
  stessa riga, così Dependabot le aggiorna.
- `permissions: contents: read` di default; permessi in più solo sul job
  che li usa.
- `persist-credentials: false` su ogni checkout, `timeout-minutes` su ogni
  job, `concurrency` nel chiamante.
- Cache npm tramite `actions/setup-node` (serve `package-lock.json`).
- `npm ci --ignore-scripts` sempre: il build non deve dipendere da script
  di installazione.
- Strumenti installati con versione fissata e senza script:
  `@lhci/cli@0.16.1`, `@axe-core/cli@4.14.0`.

## SHA delle azioni (verificati il 2026-11-23)

Comando: `gh api repos/<azione>/commits/<tag> --jq .sha` sui repo ufficiali.

| Azione | Tag | SHA |
| --- | --- | --- |
| actions/checkout | v7.0.1 | 3d3c42e5aac5ba805825da76410c181273ba90b1 |
| actions/setup-node | v7.1.0 | 949feb2413d6458794dcd2491c4babbbce0c15c1 |
| actions/upload-artifact | v7.0.2 | cf430e030ddbb5b0abf93d22962f4752f3646cd9 |
| actions/dependency-review-action | v5.0.1 | bbc44d14a204704ccc493733616cd1e93a0321ec |
| github/codeql-action (init, analyze) | v4.39.4 | 1bd86f2fdb4b86187fa4059f16f31a3202acc9ea |
