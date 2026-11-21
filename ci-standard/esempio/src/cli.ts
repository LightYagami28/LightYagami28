"use strict";

import build from "./build.ts";
import { run as runCheck } from "./seo-check.ts";

interface output {
  readonly "error": (line: string) => void;
  readonly "log": (line: string) => void;
}

export const main: (args: readonly string[], out?: output) => Promise<number> = async (
  args: readonly string[],
  out: output = console,
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

export const start: (argv?: readonly string[]) => Promise<void> = async (
  argv: readonly string[] = process.argv.slice(1),
): Promise<void> => {

  const code: number = await main(argv);
  process.exitCode = code;
};

export type { output };
