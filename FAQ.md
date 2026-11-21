# Domande frequenti

## Cos'è questo repository?

Il profilo pubblico di Light Yagami e la sede dei workflow GitHub Actions
riusabili `ci-standard` e
`codeql-standard`. Vedi [README.md](README.md).

## Come uso la CI standard in un altro repository?

Copia i modelli da `ci-standard/modelli/` e richiama il workflow con un SHA
fissato; gli input sono
elencati in [docs/ci-riusabile.md](docs/ci-riusabile.md).

## Perché gli script npm mancanti non fanno fallire la CI?

I passi usano `--if-present`: lint, test, build e `seo:check` si eseguono solo
se il `package.json` li
definisce.

## Servono segreti?

I workflow riusabili non richiedono segreti e hanno permessi di default
`contents: read`.
`codeql-standard` è separato perché richiede `security-events: write`.

## Con che licenza è distribuito?

Tutti i diritti riservati: vedi [LICENSE](LICENSE). Per un permesso scrivi
aprendo una discussione.

## Dove chiedo aiuto?

Nelle [Discussioni](https://github.com/LightYagami28/LightYagami28/discussions).
Per le
vulnerabilità vedi [SECURITY.md](SECURITY.md).
