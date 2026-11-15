import assert from "node:assert/strict";
import fs from "node:fs/promises";
import os from "node:os";
import path from "node:path";
import { test } from "node:test";
import { fileURLToPath } from "node:url";

import { build } from "../src/build.ts";
import { main, run } from "../src/cli.ts";
import { controlla, esegui, percorsoSicuro } from "../src/seo-check.ts";

const PAGINA: string = path.join(path.dirname(fileURLToPath(import.meta.url)), "..", "src", "index.html");

async function cartella(): Promise<string> {
  const radice: string = await fs.mkdtemp(path.join(os.tmpdir(), "esempio-"));
  await fs.mkdir(path.join(radice, "src"));
  await fs.copyFile(PAGINA, path.join(radice, "src", "index.html"));
  return radice;
}

test("la pagina di esempio passa il controllo SEO", async () => {
  assert.deepEqual(controlla(await fs.readFile(PAGINA, "utf8")), []);
});

test("una pagina senza title viene segnalata", () => {
  assert.ok(controlla('<html lang="it"><h1>x</h1></html>').length > 0);
});

test("una pagina senza h1 viene segnalata", () => {
  assert.ok(controlla("<html></html>").includes("serve esattamente un h1"));
});

test("un percorso fuori dalla cartella di lavoro viene rifiutato", () => {
  assert.throws(() => percorsoSicuro("../segreto.html", "/lavoro"));
  assert.throws(() => percorsoSicuro("/etc/passwd", "/lavoro"));
  assert.match(percorsoSicuro("dist/index.html", "/lavoro"), /dist.index\.html$/u);
});

test("build copia la pagina in dist e il controllo la accetta", async () => {
  const radice: string = await cartella();
  assert.equal(await build(radice), path.join("dist", "index.html"));
  assert.deepEqual(await esegui(path.join("dist", "index.html"), radice), {
    codice: 0,
    messaggio: "seo:check ok",
  });
});

test("esegui segnala gli errori con codice 1", async () => {
  const radice: string = await cartella();
  await fs.writeFile(path.join(radice, "vuota.html"), "<html></html>");
  const { codice, messaggio } = await esegui("vuota.html", radice);
  assert.equal(codice, 1);
  assert.match(messaggio, /manca lang/u);
});

test("la riga di comando esegue build e seo:check", async () => {
  const radice: string = await cartella();
  const precedente: string = process.cwd();
  const righe: string[] = [];
  const out = { log: (riga: string) => righe.push(riga), error: (riga: string) => righe.push(riga) };
  process.chdir(radice);
  try {
    assert.equal(await main(["build"], out), 0);
    assert.equal(await main(["seo", path.join("dist", "index.html")], out), 0);
    await fs.writeFile("vuota.html", "<html></html>");
    assert.equal(await main(["seo", "vuota.html"], out), 1);
  } finally {
    process.chdir(precedente);
  }
  assert.equal(righe[0], `build: ${path.join("dist", "index.html")}`);
  assert.equal(righe[1], "seo:check ok");
});

test("run imposta il codice di uscita del processo", async () => {
  const radice: string = await cartella();
  const precedente: string = process.cwd();
  process.chdir(radice);
  try {
    await run(["build"]);
    assert.equal(process.exitCode, 0);
  } finally {
    process.chdir(precedente);
    process.exitCode = undefined;
  }
});

test("senza argomento il controllo SEO fallisce leggendo la cartella di lavoro", async () => {
  const radice: string = await cartella();
  const precedente: string = process.cwd();
  process.chdir(radice);
  try {
    await assert.rejects(main(["seo"], { log: () => undefined, error: () => undefined }));
  } finally {
    process.chdir(precedente);
  }
});
