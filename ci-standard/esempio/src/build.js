"use strict";

const { copyFile, mkdir } = require("node:fs/promises");
const path = require("node:path");

async function build(root = process.cwd()) {
  const dist = path.join(root, "dist");
  await mkdir(dist, { recursive: true });
  await copyFile(path.join(root, "src", "index.html"), path.join(dist, "index.html"));
  return path.join("dist", "index.html");
}

module.exports = { build };
