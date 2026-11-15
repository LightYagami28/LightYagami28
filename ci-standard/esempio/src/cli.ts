import { build } from "./build.ts";
import { esegui } from "./seo-check.ts";

interface Uscita {
  log(riga: string): void;
  error(riga: string): void;
}

export async function main(args: string[], out: Uscita = console): Promise<number> {
  const [comando, argomento] = args;
  if (comando === "build") {
    out.log(`build: ${await build()}`);
    return 0;
  }
  const { codice, messaggio } = await esegui(argomento ?? "");
  if (codice === 0) {
    out.log(messaggio);
  } else {
    out.error(messaggio);
  }
  return codice;
}

export async function run(argv: string[] = process.argv.slice(1)): Promise<void> {
  process.exitCode = await main(argv);
}
