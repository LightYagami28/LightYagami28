"use strict";

import build from "./build.ts";
import { run as runCheck } from "./seo-check.ts";

export interface Output {
  error: (riga: string) => void;
  log: (riga: string) => void;
}

export const main = async (
  args: readonly string[],
  out: Output = console,
): Promise<number> => {
  const first: number = 0;
  const second: number = 1;
  if (args[first] === "build") {
    const page: string = await build();
    out.log(`build: ${page}`);
    return first;
  }
  const { code, message } = await runCheck(args[second] ?? "");
  if (code === first) {
    out.log(message);
  } else {
    out.error(message);
  }
  return code;
};

export const start = async (argv: readonly string[] = process.argv.slice(1)): Promise<void> => {
  const code: number = await main(argv);
  process.exitCode = code;
};
