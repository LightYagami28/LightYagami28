# Roadmap

Stato al 2026-11-16. I requisiti di fondo sono in [SPEC.md](SPEC.md).

1. Allineare `ci-standard/README.md` alle versioni realmente usate dai workflow
(CodeQL v4.39.3):
   oggi elenca la v4.39.1.
2. Decidere se eseguire `.stylelintrc.json` in un workflow o rimuoverlo: nessun
workflow lo usa.
3. Far arrivare la copertura a SonarCloud con `npm run coverage` per
`ci-standard/esempio`.
4. Adottare `ci-standard` e `codeql-standard` con SHA fissato in tutti i
repository Node e in quelli
   con analisi CodeQL.
5. Tenere la tabella dei progetti pubblici del profilo uguale all'elenco reale
dei repository.
