"use strict";

const { build } = require("./build");
const { esegui } = require("./seo-check");

async function main(args, out = console) {
  const [comando, argomento] = args;
  if (comando === "build") {
    out.log(`build: ${await build()}`);
    return 0;
  }
  const { codice, messaggio } = await esegui(argomento);
  (codice === 0 ? out.log : out.error)(messaggio);
  return codice;
}

async function run(argv = process.argv.slice(1)) {
  process.exitCode = await main(argv);
}

module.exports = { main, run };
