# 0001 - Azioni fissate per SHA

Stato: accettata

## Decisione

Ogni azione di terze parti nei workflow è fissata per SHA di commit, con la
versione in commento.
Dependabot (ecosistema `github-actions`) propone gli aggiornamenti.

## Conseguenze

I repository chiamanti fissano a loro volta il workflow riusabile per SHA;
aggiornare gli SHA è un
passo esplicito ([docs/ci-riusabile.md](../ci-riusabile.md)).
