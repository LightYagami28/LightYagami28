import { readFileSync } from "node:fs";

export function controlla(html) {
  const errori = [];
  if (!/<html[^>]*\blang="[^"]+"/i.test(html)) errori.push("manca lang su <html>");
  if (!/<title>[^<]{10,70}<\/title>/i.test(html)) errori.push("title assente o lunghezza fuori da 10-70");
  if (!/<meta\s+name="description"\s+content="[^"]{50,160}"/i.test(html)) errori.push("meta description assente o lunghezza fuori da 50-160");
  if (!/<link\s+rel="canonical"\s+href="https?:\/\/[^"]+"/i.test(html)) errori.push("manca il link canonical");
  if ((html.match(/<h1[\s>]/gi) || []).length !== 1) errori.push("serve esattamente un h1");
  return errori;
}

if (process.argv[2]) {
  const errori = controlla(readFileSync(process.argv[2], "utf8"));
  if (errori.length) {
    console.error(errori.join("\n"));
    process.exit(1);
  }
  console.log("seo:check ok");
}
