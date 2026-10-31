import { test } from "node:test";
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { controlla } from "../src/seo-check.mjs";

test("la pagina di esempio passa il controllo SEO", () => {
  assert.deepEqual(controlla(readFileSync("src/index.html", "utf8")), []);
});

test("una pagina senza title viene segnalata", () => {
  assert.ok(controlla('<html lang="it"><h1>x</h1></html>').length > 0);
});
