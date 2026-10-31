import { mkdirSync, copyFileSync } from "node:fs";

mkdirSync("dist", { recursive: true });
copyFileSync("src/index.html", "dist/index.html");
console.log("build: dist/index.html");
