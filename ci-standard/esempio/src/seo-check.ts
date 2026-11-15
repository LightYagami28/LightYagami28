import { readFile } from "node:fs/promises";
import path from "node:path";

type Regola = readonly [RegExp, string];

export interface Esito {
  codice: number;
  messaggio: string;
}

const REGOLE: readonly Regola[] = [
  [/<html[^>]*\blang="[^"]+"/iu, "manca lang su <html>"],
  [/<title>[^<]{10,70}<\/title>/iu, "title assente o lunghezza fuori da 10-70"],
  [
    /<meta\s+name="description"\s+content="[^"]{50,160}"/iu,
    "meta description assente o lunghezza fuori da 50-160",
  ],
  [/<link\s+rel="canonical"\s+href="https?:\/\/[^"]+"/iu, "manca il link canonical"],
];

export function percorsoSicuro(argomento: string, base: string = process.cwd()): string {
  const percorso: string = path.resolve(base, argomento);
  const rel: string = path.relative(base, percorso);
  if (rel.startsWith("..") || path.isAbsolute(rel)) {
    throw new Error("percorso fuori dalla cartella di lavoro");
  }
  return percorso;
}

export function controlla(html: string): string[] {
  const errori: string[] = REGOLE.filter(([regola]) => !regola.test(html)).map(
    ([, messaggio]) => messaggio,
  );
  const titoli: RegExpMatchArray | [] = html.match(/<h1[\s>]/giu) ?? [];
  if (titoli.length !== 1) {
    errori.push("serve esattamente un h1");
  }
  return errori;
}

export async function esegui(argomento: string, base: string = process.cwd()): Promise<Esito> {
  const errori: string[] = controlla(await readFile(percorsoSicuro(argomento, base), "utf8"));
  if (errori.length === 0) {
    return { codice: 0, messaggio: "seo:check ok" };
  }
  return { codice: 1, messaggio: errori.join("\n") };
}
