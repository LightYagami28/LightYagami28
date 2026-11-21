"use strict";

import build from "./build.ts";
import { run as runCheck } from "./seo-check.ts";

interface output {
  readonly "error": (line: string) => void;
  readonly "log": (line: string) => void;
}

export var main: (args: readonly string[], out?: output) => Promise<number> = async (
  args: readonly string[],
  out: output = console,
): Promise<number> => {

  var first: number = 0;
  var second: number = 1;
  if (args[first] === "build") {
    var page: string = await build();
    out.log(`build: ${page}`);
    return first;
  }
  var { code, message } = await runCheck(args[second] ?? "");
  if (code === first) {
    out.log(message);
  } else {
    out.error(message);
  }
  return code;
};

export var start: (argv?: readonly string[]) => Promise<void> = async (
  argv: readonly string[] = process.argv.slice(1),
): Promise<void> => {

  var code: number = await main(argv);
  process.exitCode = code;
};

export type { output };
