"use strict";

const { readFile } = require("node:fs/promises");
const path = require("node:path");

const REGOLE = [
  [/<html[^>]*\blang="[^"]+"/iu, "manca lang su <html>"],
  [/<title>[^<]{10,70}<\/title>/iu, "title assente o lunghezza fuori da 10-70"],
  [
    /<meta\s+name="description"\s+content="[^"]{50,160}"/iu,
    "meta description assente o lunghezza fuori da 50-160",
  ],
  [/<link\s+rel="canonical"\s+href="https?:\/\/[^"]+"/iu, "manca il link canonical"],
];

function percorsoSicuro(argomento, base = process.cwd()) {
  const percorso = path.resolve(base, argomento);
  const rel = path.relative(base, percorso);
  if (rel.startsWith("..") || path.isAbsolute(rel)) {
    throw new Error("percorso fuori dalla cartella di lavoro");
  }
  return percorso;
}

function controlla(html) {
  const errori = REGOLE.filter(([regola]) => !regola.test(html)).map(([, messaggio]) => messaggio);
  const titoli = html.match(/<h1[\s>]/giu) ?? [];
  if (titoli.length !== 1) {
    errori.push("serve esattamente un h1");
  }
  return errori;
}

async function esegui(argomento, base = process.cwd()) {
  const errori = controlla(await readFile(percorsoSicuro(argomento, base), "utf8"));
  return { codice: errori.length === 0 ? 0 : 1, messaggio: errori.length === 0 ? "seo:check ok" : errori.join("\n") };
}

module.exports = { controlla, esegui, percorsoSicuro };
