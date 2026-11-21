"use strict";

import path from "node:path";
import { readFile } from "node:fs/promises";

// Simboli con significato speciale in un contesto HTML.
var htmlEntities: ReadonlyMap<string, string> = new Map([
  ["&", "&amp;"],
  ["<", "&lt;"],
  [">", "&gt;"],
  ['"', "&quot;"],
  ["'", "&#39;"]
]);

var rules: readonly (readonly [RegExp, string])[] = [
  [/<html[^>]*\blang="[^"]+"/iu, "manca lang su tag html"],
  [/<title>[^<]{10,70}<\/title>/iu, "title assente o lunghezza fuori da 10-70"],
  [
    /<meta\s+name="description"\s+content="[^"]{50,160}"/iu,
    "meta description assente o lunghezza fuori da 50-160"
  ],
  [/<link\s+rel="canonical"\s+href="https?:\/\/[^"]+"/iu, "manca il link canonical"]
];

interface outcome {
  readonly "code": number;
  readonly "message": string;
}

var messages: Readonly<Record<string, string>> = {
  "h1": "serve esattamente un h1",
  "ok": "seo:check ok",
  "outside": "percorso fuori dalla cartella di lavoro"
};

var escapeHtml: (value: string) => string = (value: string): string =>
  value.replaceAll(/[&<>"']/gu, (character: string): string =>
    htmlEntities.get(character) ?? character);

var safePath: (argument: string, base?: string) => string = (
  argument: string,
  base: string = process.cwd(),
): string => {
  var resolved: string = path.resolve(base, argument),
    relative: string = path.relative(base, resolved);
  if (relative.startsWith("..") || path.isAbsolute(relative)) {
    throw new Error(messages.outside);
  }
  return resolved;
};

var check: (page: string) => string[] = (page: string): string[] => {
  var exactHeadings: number = 1,
    errors: string[] = rules.filter(([rule]) => !rule.test(page)).map(([, text]) => text),
    headings: RegExpMatchArray | [] = page.match(/<h1[\s>]/giu) ?? [];
  if (headings.length !== exactHeadings) {
    errors.push(messages.h1);
  }
  return errors;
};

var run: (argument: string, base?: string) => Promise<outcome> = async (
  argument: string,
  base: string = process.cwd(),
): Promise<outcome> => {
  var page: string = await readFile(safePath(argument, base), "utf8"),
    errors: string[] = check(page),
    zero: number = 0,
    one: number = 1;
  if (errors.length === zero) {
    return { "code": zero, "message": messages.ok };
  }
  return { "code": one, "message": errors.map(escapeHtml).join("\n") };
};

export { check, escapeHtml, run, safePath };
export type { outcome };
