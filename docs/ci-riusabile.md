# Guida alla CI standard riusabile

I workflow vivono in `.github/workflows/` di questo repository e si richiamano da qualsiasi altro repo con `workflow_call`. Panoramica e tabella degli SHA: [ci-standard/README.md](../ci-standard/README.md).

## Workflow disponibili

| File | Scopo |
| --- | --- |
| `ci-standard.yml` | `npm ci`, lint, test, build, `seo:check`, `npm audit`, Lighthouse CI, axe, revisione dipendenze (solo PR) |
| `codeql-standard.yml` | Analisi CodeQL (richiede `security-events: write`) |
| `ci-standard-prova.yml` | Prova di entrambi sul progetto `ci-standard/esempio` |

Gli script npm assenti vengono saltati (`--if-present`).

## Adozione in un repo

1. Copia `ci-standard/modelli/ci.yml` in `.github/workflows/ci.yml`.
2. Sostituisci `<SHA>` con lo SHA completo del commit approvato di questo repo (`git ls-remote https://github.com/LightYagami28/LightYagami28 refs/heads/main`). Non usare `@main`: il riferimento per SHA rende la CI riproducibile.
3. Copia `ci-standard/modelli/dependabot.yml` in `.github/dependabot.yml`.
4. Per Lighthouse copia `ci-standard/modelli/lighthouserc.json` nel progetto e imposta `staticDistDir` sulla cartella del build.
5. Serve `package-lock.json` (cache npm e `npm ci`).

## Input di `ci-standard.yml`

| Input | Default | Significato |
| --- | --- | --- |
| `working-directory` | `.` | Cartella del progetto Node |
| `node-version` | `22` | Versione di Node |
| `ignore-scripts` | `true` | `npm ci --ignore-scripts`; `false` se il build ne ha bisogno |
| `audit-level` | `high` | Soglia di `npm audit --omit=dev`; vuoto per saltare |
| `run-lighthouse` | `false` | Esegue Lighthouse CI |
| `lighthouse-config` | `lighthouserc.json` | Configurazione, relativa a `working-directory` |
| `axe-dir` | vuoto | Cartella statica da servire e controllare con axe; vuoto per saltare |
| `axe-paths` | `/` | Percorsi da controllare, separati da spazio |
| `run-dependency-review` | `false` | Revisione dipendenze sulle PR (non disponibile sui privati del piano Free) |

`codeql-standard.yml`: `languages` (default `javascript-typescript`, separati da virgola), `build-mode` (default `none`).

## Esempi d'uso

Sito statico (Lighthouse e axe):

```yaml
jobs:
  ci:
    uses: LightYagami28/LightYagami28/.github/workflows/ci-standard.yml@<SHA>
    with:
      run-lighthouse: true
      axe-dir: dist
      axe-paths: "/ /info.html"
      run-dependency-review: ${{ !github.event.repository.private }}
```

Progetto Node in una sottocartella:

```yaml
jobs:
  ci:
    uses: LightYagami28/LightYagami28/.github/workflows/ci-standard.yml@<SHA>
    with:
      working-directory: bot
      node-version: "22"
      audit-level: moderate
```

Solo CodeQL su un repo Python, per esempio `bot-lite-downloader` o `TgDesktop-multi-account`:

```yaml
jobs:
  codeql:
    uses: LightYagami28/LightYagami28/.github/workflows/codeql-standard.yml@<SHA>
    permissions:
      contents: read
      actions: read
      security-events: write
    with:
      languages: python
```

Per `edex-ui` si usa `languages: javascript-typescript`. Per `TGbotPHP` (PHP) CodeQL non ha un analizzatore: restano i workflow già presenti nel repo.

## Aggiornare gli SHA

Per ogni azione: `gh api repos/<azione>/commits/<tag> --jq .sha`, poi aggiorna SHA e commento della versione sulla stessa riga. Dependabot (`github-actions`) propone gli aggiornamenti.

## Prova

La prova gira su ogni PR di questo repo tramite `ci-standard-prova.yml` sul progetto `ci-standard/esempio`.
