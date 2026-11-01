import { copyFile, mkdir } from "node:fs/promises";

await mkdir("dist", { recursive: true });
await copyFile("src/index.html", "dist/index.html");
console.log("build: dist/index.html");
