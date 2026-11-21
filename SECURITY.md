# Security Policy

## Segnalare una vulnerabilità

Se trovi una vulnerabilità, non aprirla come issue pubblica. Scrivi a
**maule2703&#64;gmail.com** con:

- descrizione del problema,
- passi per riprodurlo,
- impatto stimato.

Risponderemo il prima possibile. Grazie per la segnalazione responsabile.

## Versioni supportate

Solo l'ultima versione pubblicata riceve correzioni di sicurezza.

## URL di rete: solo HTTPS

Tutto il codice che apre connessioni usa HTTPS. Unica eccezione intenzionale:
in `ci-standard/esempio/src/seo-check.ts` la regex di rilevamento del link
canonical `/https?:\/\/[^"]+/` accetta anche `http://`. È un pattern di
detection che **segnala** i canonical non sicuri: non effettua richieste di
rete e va lasciato invariato per poter intercettare anche i link HTTP.

## Messaggi del controllo SEO

Le regole di controllo (`RULES`, insieme di pattern e messaggi associati) sono
testo semplice e non contengono markup. Prima di
essere restituiti al chiamante passano da `escapeHtml`, che codifica `& < > " '`
in tutte le occorrenze: i risultati possono così essere mostrati in una pagina
senza interpretare i tag. Le dipendenze di sviluppo sono bloccate a versioni
esatte per evitare sostituzioni con versioni diverse.

## Fixture dei test

I test di `ci-standard/esempio` usano solo percorsi letterali (`src/index.html`,
`test/fixtures/...`). Le fixture sotto `test/fixtures/` servono esclusivamente
alle prove automatizzate e non fanno parte del codice di produzione.
