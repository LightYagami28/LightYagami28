"use strict";

import { copyFile, mkdir } from "node:fs/promises";
import path from "node:path";

// Copia la pagina di esempio in dist e ne restituisce il percorso relativo.
const build = async (root: string = process.cwd()): Promise<string> => {
  const distribution: string = path.join(root, "dist");
  const page: string = path.join("dist", "index.html");
  await mkdir(distribution, { recursive: true });
  await copyFile(path.join(root, "src", "index.html"), path.join(root, page));
  return page;
};

export default build;
