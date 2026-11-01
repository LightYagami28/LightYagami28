import process from "node:process";
import { readFile } from "node:fs/promises";
import { isAbsolute, relative, resolve } from "node:path";

const FUORI_CARTELLA = "percorso fuori dalla cartella di lavoro";

/**
 * Risolve un percorso e rifiuta quelli fuori dalla cartella di base.
 * @param {string} argomento percorso dato dall'utente
 * @param {string} [base] cartella di base (default: cartella corrente)
 * @returns {string} percorso assoluto
 */
const percorsoSicuro = (argomento, base) => {
  const radice = base ?? process.cwd();
  const percorso = resolve(radice, argomento);
  const rel = relative(radice, percorso);
  if (rel.startsWith("..") || isAbsolute(rel)) {
    throw new Error(FUORI_CARTELLA);
  }
  return percorso;
};

/**
 * Controlla i requisiti SEO minimi di una pagina.
 * @param {string} html contenuto della pagina
 * @returns {string[]} errori trovati
 */
const controlla = (html) => {
  const errori = [];
  if (!/<html[^>]*\blang="[^"]+"/iu.test(html)) {
    errori.push("manca lang su <html>");
  }
  if (!/<title>[^<]{10,70}<\/title>/iu.test(html)) {
    errori.push("title assente o lunghezza fuori da 10-70");
  }
  if (!/<meta\s+name="description"\s+content="[^"]{50,160}"/iu.test(html)) {
    errori.push("meta description assente o lunghezza fuori da 50-160");
  }
  if (!/<link\s+rel="canonical"\s+href="https?:\/\/[^"]+"/iu.test(html)) {
    errori.push("manca il link canonical");
  }
  if ((html.match(/<h1[\s>]/giu) ?? []).length !== 1) {
    errori.push("serve esattamente un h1");
  }
  return errori;
};

const [, , argomento] = process.argv;
if (argomento) {
  const errori = controlla(await readFile(percorsoSicuro(argomento), "utf8"));
  if (errori.length > 0) {
    console.error(errori.join("\n"));
    process.exitCode = 1;
  } else {
    console.log("seo:check ok");
  }
}

export { controlla, percorsoSicuro };
