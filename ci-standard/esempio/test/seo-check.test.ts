"use strict";

import { test } from "node:test";
import assert from "node:assert/strict";
import fs from "node:fs/promises";
import path from "node:path";

import type { Outcome } from "../src/seo-check.ts";
import { check, escapeHtml, run, safePath } from "../src/seo-check.ts";
import { main, start } from "../src/cli.ts";
import build from "../src/build.ts";

// Le fixture sono file letterali nel repo: nessun percorso deriva da input
// Dell'utente o da directory temporanee.

const zero: number = 0;
const one: number = 1;

test("la pagina di esempio passa il controllo SEO", (): Promise<void> =>
  fs.readFile("src/index.html", "utf8").then((page: string): void => {
    assert.deepEqual(check(page), []);
  }));

test("una pagina senza title viene segnalata", (): Promise<void> =>
  fs.readFile("test/fixtures/senza-title.txt", "utf8").then((page: string): void => {
    assert.ok(check(page).length > zero);
  }));

test("una pagina senza h1 viene segnalata", (): void => {
  assert.ok(check("<html></html>").includes("serve esattamente un h1"));
});

test("escapeHtml codifica tutti i caratteri speciali", (): void => {
  assert.equal(escapeHtml("&<>\"'"), "&amp;&lt;&gt;&quot;&#39;");
  assert.equal(escapeHtml("a & b & c < x > y \"z'"), "a &amp; b &amp; c &lt; x &gt; y &quot;z&#39;");
});

test("un percorso fuori dalla cartella di lavoro viene rifiutato", (): void => {
  assert.throws(() => safePath("../segreto.html", "/lavoro"));
  assert.throws(() => safePath("/etc/passwd", "/lavoro"));
  assert.match(safePath("dist/index.html", "/lavoro"), /dist.index\.html$/u);
});

test("build copia la pagina in dist", (): Promise<void> =>
  build("test/fixtures").then((page: string): void => {
    assert.equal(page, path.join("dist", "index.html"));
  }));

test("il controllo SEO accetta la pagina generata", (): Promise<void> =>
  run(path.join("dist", "index.html"), "test/fixtures").then((result: Outcome): void => {
    assert.deepEqual(result, { "code": zero, "message": "seo:check ok" });
  }));

test("esegui segnala gli errori con code 1", (): Promise<void> =>
  run("vuota.html", "test/fixtures").then((result: Outcome): void => {
    assert.equal(result.code, one);
    assert.match(result.message, /meta description/u);
  }));

test("la riga di comando esegue build e seo:check", (): Promise<void> => {
  const precedente: string = process.cwd();
  const righe: string[] = [];
  const out: { error: (riga: string) => void; log: (riga: string) => void } = {
    "error": (riga: string): void => {
      righe.push(riga);
    },
    "log": (riga: string): void => {
      righe.push(riga);
    }
  };
  process.chdir("test/fixtures");
  return main(["build"], out)
    .then((code: number): Promise<number> => {
      assert.equal(code, zero);
      return main(["seo", path.join("dist", "index.html")], out);
    })
    .then((code: number): Promise<number> => {
      assert.equal(code, zero);
      return main(["seo", "vuota.html"], out);
    })
    .then((code: number): void => {
      assert.equal(code, one);
      assert.equal(righe[zero], `build: ${path.join("dist", "index.html")}`);
      assert.equal(righe[one], "seo:check ok");
    })
    .finally((): void => {
      process.chdir(precedente);
    });
});

test("start imposta il codice di uscita del processo", (): Promise<void> => {
  const precedente: string = process.cwd();
  process.chdir("test/fixtures");
  return start(["build"])
    .then((): void => {
      assert.equal(process.exitCode, zero);
    })
    .finally((): void => {
      process.chdir(precedente);
      process.exitCode = zero;
    });
});

test("senza argomento il controllo SEO fallisce", (): Promise<void> => {
  const precedente: string = process.cwd();
  const righe: string[] = [];
  const out: { error: (riga: string) => void; log: (riga: string) => void } = {
    "error": (riga: string): void => {
      righe.push(riga);
    },
    "log": (riga: string): void => {
      righe.push(riga);
    }
  };
  process.chdir("test/fixtures");
  return assert.rejects(main(["seo"], out)).finally((): void => {
    process.chdir(precedente);
  });
});
