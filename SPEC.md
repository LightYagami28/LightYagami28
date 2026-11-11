# SPEC

## Obiettivo

Questo repository è finito quando il profilo GitHub elenca i progetti pubblici reali e i workflow riusabili `ci-standard` e `codeql-standard` sono usati, con SHA fissato, dai repo Node e dai repo con analisi CodeQL, con documentazione allineata ai file e senza avvisi.

## Stato attuale verificato

Letto dai file il 2026-11-11.

| Elemento | Stato | File |
| --- | --- | --- |
| Profilo con tabella di 7 progetti pubblici | presente | `README.md` |
| Workflow `ci-standard` (`workflow_call`) | presente | `.github/workflows/ci-standard.yml` |
| Workflow `codeql-standard` (`workflow_call`) | presente | `.github/workflows/codeql-standard.yml` |
| Prova dei due workflow su un progetto di esempio | presente, scatta su PR e push su `main` che toccano `ci-standard/**` o i workflow | `.github/workflows/ci-standard-prova.yml`, `ci-standard/esempio/` |
| Semgrep | presente, immagine fissata per digest | `.github/workflows/semgrep.yml` |
| SonarCloud | presente, progetto `LightYagami28_LightYagami28`, sorgenti `docs`; salta l'analisi se manca `SONAR_TOKEN` (PR da fork e Dependabot) | `.github/workflows/sonarcloud.yml`, `sonar-project.properties` |
| Dependabot | solo ecosistema `github-actions`, settimanale | `.github/dependabot.yml` |
| Modelli per i repo chiamanti | `ci.yml`, `dependabot.yml`, `lighthouserc.json` | `ci-standard/modelli/` |
| Pagine statiche | `docs/index.html`, `docs/WelcomeGuard/` (info, privacy, termini, CSS) | `docs/` |
| Commit firmati | documentato | `VERIFIED.md` |

Versioni lette dai workflow:

| Componente | Versione | Dove |
| --- | --- | --- |
| actions/checkout | v7.0.1 | tutti i workflow |
| actions/setup-node | v7.1.0 | `ci-standard.yml` |
| actions/upload-artifact | v7.0.2 | `ci-standard.yml` |
| actions/dependency-review-action | v5.0.0 | `ci-standard.yml` |
| github/codeql-action (init, analyze) | v4.39.3 | `codeql-standard.yml` |
| SonarSource/sonarqube-scan-action | v8.4.1 | `sonarcloud.yml` |
| Semgrep (immagine) | 1.183.0 | `semgrep.yml` |
| @lhci/cli | 0.15.1 | `ci-standard.yml` |
| @axe-core/cli | 4.14.0 | `ci-standard.yml` |
| Node (default dell'input) | 26 | `ci-standard.yml` |

Incongruenze trovate:

- `ci-standard/README.md` elenca `github/codeql-action` v4.39.1 (SHA `9b32540...`); i workflow usano v4.39.3 (`33d7b85...`). Da allineare (requisito 6).
- `sonar.sources=docs` misura solo HTML e CSS; il codice di `ci-standard/esempio/src` non è in analisi (requisito 8).
- `.stylelintrc.json` è presente ma nessun `package.json` o workflow lo esegue.

## Architettura

```text
.github/workflows/  ci-standard.yml, codeql-standard.yml (workflow_call)
                    ci-standard-prova.yml, semgrep.yml, sonarcloud.yml
.github/dependabot.yml
ci-standard/        README.md, modelli/ (da copiare), esempio/ (progetto Node di prova)
docs/               ci-riusabile.md (guida), index.html, WelcomeGuard/ (pagine statiche)
```

Flusso. Un repo chiamante ha `.github/workflows/ci.yml` che richiama `ci-standard.yml@<SHA>`. Il job `build` esegue `npm ci --ignore-scripts`, lint, test, build, `seo:check`, `npm audit --omit=dev`, Lighthouse CI e axe; gli script npm assenti sono saltati (`--if-present`). Il job `dependency-review` gira solo sulle PR se abilitato. `codeql-standard.yml` è separato perché richiede `security-events: write`. `ci-standard-prova.yml` richiama entrambi in locale (`./.github/workflows/...`) su `ci-standard/esempio`.

Dati: nessuno. I workflow riusabili non richiedono segreti e hanno permessi di default `contents: read`.

## Requisiti funzionali

1. Il profilo (`README.md`) elenca ogni repo pubblico dell'account con link, linguaggio e una riga di descrizione. Accettazione: `gh repo list LightYagami28 --visibility public --json name -q '.[].name'` coincide con i nomi della tabella.
2. `ci-standard.yml` accetta gli input documentati in `docs/ci-riusabile.md`: `working-directory`, `node-version`, `audit-level`, `run-lighthouse`, `lighthouse-config`, `axe-dir`, `axe-paths`, `run-dependency-review`. Accettazione: ogni input del YAML compare nella tabella della guida e viceversa.
3. `codeql-standard.yml` accetta `languages` e `build-mode`. Accettazione: il job `codeql` di `Prova CI standard` termina verde.
4. Ogni azione è fissata per SHA completo con il tag nel commento. Accettazione: `grep -rhoE 'uses: [^ ]+' .github ci-standard/modelli | grep -vE '@[0-9a-f]{40}|uses: \./'` non produce righe (tranne il segnaposto `<SHA>` nei modelli).
5. I modelli in `ci-standard/modelli/` funzionano sostituendo solo `<SHA>`. Accettazione: copiati in un repo di prova, la CI parte senza modifiche ulteriori.
6. Le versioni indicate in `ci-standard/README.md`, in `docs/ci-riusabile.md` e in questo file coincidono con i workflow. Accettazione: `git grep -n 'codeql-action'` mostra ovunque la stessa versione e lo stesso SHA.
7. `docs/WelcomeGuard/privacypolicy.html` e `termsofservice.html` esistono e sono raggiungibili da `info.html`. Accettazione: i link relativi in `info.html` puntano a file presenti.
8. Il codice di `ci-standard/esempio/src` è coperto da test al 100% e analizzato da SonarCloud. Accettazione: `node --test --experimental-test-coverage` mostra 100% e SonarCloud riporta coverage 100% su quei file (oggi da confermare).

## Requisiti non funzionali

- Sicurezza: permessi minimi per workflow, `persist-credentials: false` su ogni checkout, `timeout-minutes` su ogni job, `npm ci --ignore-scripts` sempre, strumenti globali npm a versione fissa e senza script, riferimento a questo repo per SHA, CodeQL e Semgrep attivi. Nessun segreto nei file.
- Accessibilità: le pagine in `docs/` rispettano WCAG 2.2 AA (contrasto, `lang`, titoli, focus visibile). Esito attuale di axe: da confermare.
- Privacy: `privacypolicy.html` descrive i dati trattati dal bot WelcomeGuard; contenuto legale da confermare con il proprietario. Nessun dato personale di terzi nel repo.
- Qualità: coverage 100% sul codice misurato, SonarCloud A/A/A e hotspot A, zero avvisi in build e test, dipendenze e azioni all'ultima versione (Dependabot attivo sulle azioni).
- Repo pubblico: nessun dato personale di clienti o lettori in file, workflow o SPEC.

## Roadmap

1. Allineare `ci-standard/README.md` (SHA e versione di `codeql-action`) ai workflow.
2. Estendere Dependabot a `npm` in `ci-standard/esempio` e verificare che la prova resti verde.
3. Portare `ci-standard/esempio/src` sotto Sonar con coverage 100%.
4. Adottare `ci-standard.yml` in almeno un repo pubblico Node, con SHA fissato.
5. Aggiungere la variante per progetti Python (versione Python, lint, test, audit).
6. Ricontrollare la tabella del profilo contro `gh repo list`.

## Fuori ambito

- Progetti non Node nel workflow `ci-standard` (oggi richiede `package-lock.json`).
- CodeQL su PHP (non supportato dall'analizzatore).
- Contenuto dei repo chiamanti.

## Decisioni aperte per il proprietario

- Includere `ci-standard/esempio` nell'analisi SonarCloud o mantenere solo `docs`.
- Repo privati del piano Free: revisione dipendenze e CodeQL restano disattivati, o si attiva GitHub Code Security.
- Autorizzare l'app Codacy per il check sulle PR (stato attuale da confermare).
- `.stylelintrc.json`: aggiungere uno script di lint o rimuovere il file.

## Come verificare

```bash
cd ci-standard/esempio
npm ci --ignore-scripts && npm run lint && npm test && npm run build && npm run seo:check
cd ../..
grep -rhoE 'uses: [^ ]+' .github | grep -vE '@[0-9a-f]{40}|uses: \./'
gh pr checks <numero> -R LightYagami28/LightYagami28
```

In CI girano `Prova CI standard`, `CodeQL standard`, `Semgrep` e `SonarCloud`.
