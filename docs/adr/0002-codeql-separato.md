# 0002 - CodeQL in un workflow separato

Stato: accettata

## Decisione
`codeql-standard.yml` è separato da `ci-standard.yml`.

## Motivo
CodeQL richiede il permesso `security-events: write`, mentre la CI standard lavora con `contents: read`:
separarli mantiene i permessi minimi per chi non usa CodeQL.
