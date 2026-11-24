# Roadmap

Stato al 2026-11-23. I requisiti di fondo sono in [SPEC.md](SPEC.md).

1. Versioni di CodeQL, Lighthouse CI e Semgrep allineate tra workflow, guide e
   avvisi il 2026-11-23 (CodeQL v4.39.4, `@lhci/cli` 0.16.1, Semgrep 1.186.0).
2. Decidere se eseguire `.stylelintrc.json` in un workflow o rimuoverlo: nessun
workflow lo usa.
3. Far arrivare la copertura a SonarCloud con `npm run coverage` per
`ci-standard/esempio`.
4. Adottare `ci-standard` e `codeql-standard` con SHA fissato in tutti i
repository Node e in quelli
   con analisi CodeQL.
5. Tenere la tabella dei progetti pubblici del profilo uguale all'elenco reale
dei repository.
