import assert from "node:assert/strict";
import fs from "node:fs/promises";
import path from "node:path";
import { test } from "node:test";

import {build} from "../src/build.ts";
import {main, start} from "../src/cli.ts";
import {check, escapeHtml, run, safePath} from "../src/seo-check.ts";

// Le fixture sono file letterali nel repo: i test non costruiscono percorsi
// a partire da input dell'utente né da directory temporanee.

test("la pagina di esempio passa il controllo SEO", async () => {
  assert.deepEqual(check(await fs.readFile("src/index.html", "utf8")), []);
});

test("una pagina senza title viene segnalata", () => {
  assert.ok(check('<html lang="it"><h1>x</h1></html>').length > 0);
});

test("una pagina senza h1 viene segnalata", () => {
  assert.ok(check("<html></html>").includes("serve esattamente un h1"));
});

test("escapeHtml codifica tutti i caratteri speciali", () => {
  assert.equal(escapeHtml(`&<>"'`), "&amp;&lt;&gt;&quot;&#39;");
  assert.equal(escapeHtml("a & b & c < x > y \"z'"), "a &amp; b &amp; c &lt; x &gt; y &quot;z&#39;");
});

test("un percorso fuori dalla cartella di lavoro viene rifiutato", () => {
  assert.throws(() => safePath("../segreto.html", "/lavoro"));
  assert.throws(() => safePath("/etc/passwd", "/lavoro"));
  assert.match(safePath("dist/index.html", "/lavoro"), /dist.index\.html$/u);
});

test("build copia la pagina in dist e il controllo la accetta", async () => {
  assert.equal(await build("test/fixtures"), path.join("dist", "index.html"));
  assert.deepEqual(await run(path.join("dist", "index.html"), "test/fixtures"), {
    code: 0,
    message: "seo:check ok",
  });
});

test("esegui segnala gli errori con code 1", async () => {
  const {code, message} = await run("vuota.html", "test/fixtures");
  assert.equal(code, 1);
  assert.match(message, /meta description/u);
});

test("la riga di comando esegue build e seo:check", async () => {
  const precedente: string = process.cwd();
  const righe: string[] = [];
  const out = { log: (riga: string) => righe.push(riga), error: (riga: string) => righe.push(riga) };
  process.chdir("test/fixtures");
  try {
    assert.equal(await main(["build"], out), 0);
    assert.equal(await main(["seo", path.join("dist", "index.html")], out), 0);
    assert.equal(await main(["seo", "vuota.html"], out), 1);
  } finally {
    process.chdir(precedente);
  }
  assert.equal(righe[0], `build: ${path.join("dist", "index.html")}`);
  assert.equal(righe[1], "seo:check ok");
});

test("start imposta il codice di uscita del processo", async () => {
  const precedente: string = process.cwd();
  process.chdir("test/fixtures");
  try {
    await start(["build"]);
    assert.equal(process.exitCode, 0);
  } finally {
    process.chdir(precedente);
    process.exitCode = undefined;
  }
});

test("senza argomento il controllo SEO fallisce leggendo la cartella di lavoro", async () => {
  const precedente: string = process.cwd();
  process.chdir("test/fixtures");
  try {
    await assert.rejects(main(["seo"], { log: () => undefined, error: () => undefined }));
  } finally {
    process.chdir(precedente);
  }
});
