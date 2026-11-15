import { copyFile, mkdir } from "node:fs/promises";
import path from "node:path";

export async function build(root: string = process.cwd()): Promise<string> {
  const dist: string = path.join(root, "dist");
  await mkdir(dist, { recursive: true });
  await copyFile(path.join(root, "src", "index.html"), path.join(dist, "index.html"));
  return path.join("dist", "index.html");
}
