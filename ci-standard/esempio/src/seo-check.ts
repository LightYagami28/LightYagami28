"use strict";

import path from "node:path";
import { readFile } from "node:fs/promises";

// Simboli con significato speciale in un contesto HTML.
const htmlEntities: ReadonlyMap<string, string> = new Map([
  ["&", "&amp;"],
  ["<", "&lt;"],
  [">", "&gt;"],
  ["\"", "&quot;"],
  ["'", "&#39;"]
]);

const rules: readonly (readonly [RegExp, string])[] = [
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

const messages: Readonly<Record<string, string>> = {
  "h1": "serve esattamente un h1",
  "ok": "seo:check ok",
  "outside": "percorso fuori dalla cartella di lavoro"
};

const escapeHtml = (value: string): string =>
  value.replaceAll(/[&<>"']/gu, (character: string): string =>
    htmlEntities.get(character) ?? character);

const safePath = (argument: string, base: string = process.cwd()): string => {
  const resolved: string = path.resolve(base, argument);
  const relative: string = path.relative(base, resolved);
  if (relative.startsWith("..") || path.isAbsolute(relative)) {
    throw new Error(messages.outside);
  }
  return resolved;
};

const check = (page: string): string[] => {
  const exactHeadings: number = 1;
  const errors: string[] = rules.filter(([rule]) => !rule.test(page)).map(([, text]) => text);
  const headings: RegExpMatchArray | [] = page.match(/<h1[\s>]/giu) ?? [];
  if (headings.length !== exactHeadings) {
    errors.push(messages.h1);
  }
  return errors;
};

const run = async (argument: string, base: string = process.cwd()): Promise<outcome> => {
  const page: string = await readFile(safePath(argument, base), "utf8");
  const errors: string[] = check(page);
  const zero: number = 0;
  const one: number = 1;
  if (errors.length === zero) {
    return { "code": zero, "message": messages.ok };
  }
  return { "code": one, "message": errors.map(escapeHtml).join("\n") };
};

export { check, escapeHtml, run, safePath };
export type { outcome };
