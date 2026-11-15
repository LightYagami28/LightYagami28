"use strict";

const assert = require("node:assert/strict");
const fs = require("node:fs/promises");
const os = require("node:os");
const path = require("node:path");
const { test } = require("node:test");

const { build } = require("../src/build");
const { main, run } = require("../src/cli");
const { controlla, esegui, percorsoSicuro } = require("../src/seo-check");

const PAGINA = path.join(__dirname, "..", "src", "index.html");

async function cartella() {
  const radice = await fs.mkdtemp(path.join(os.tmpdir(), "esempio-"));
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
  const radice = await cartella();
  assert.equal(await build(radice), path.join("dist", "index.html"));
  assert.deepEqual(await esegui(path.join("dist", "index.html"), radice), {
    codice: 0,
    messaggio: "seo:check ok",
  });
});

test("esegui segnala gli errori con codice 1", async () => {
  const radice = await cartella();
  await fs.writeFile(path.join(radice, "vuota.html"), "<html></html>");
  const { codice, messaggio } = await esegui("vuota.html", radice);
  assert.equal(codice, 1);
  assert.match(messaggio, /manca lang/u);
});

test("la riga di comando esegue build e seo:check", async () => {
  const radice = await cartella();
  const precedente = process.cwd();
  const righe = [];
  const out = { log: (riga) => righe.push(riga), error: (riga) => righe.push(riga) };
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
  const radice = await cartella();
  const precedente = process.cwd();
  process.chdir(radice);
  try {
    await run(["build"]);
    assert.equal(process.exitCode, 0);
  } finally {
    process.chdir(precedente);
    process.exitCode = undefined;
  }
});
