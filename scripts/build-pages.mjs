import fs from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { build } from "vite";

const repository = fileURLToPath(new URL("../", import.meta.url));
const output = path.join(repository, ".build");
await build({ configFile: path.join(repository, "site/vite.config.ts") });
await fs.access(path.join(output, "index.html"));

// Only replace generated assets after the complete build succeeds.
await fs.rm(path.join(repository, "assets"), { recursive: true, force: true });
for (const file of await fs.readdir(output)) {
  await fs.cp(path.join(output, file), path.join(repository, file), { recursive: true });
}
await fs.writeFile(path.join(repository, ".nojekyll"), "");
console.log("GitHub Pages files are ready at the repository root for /MyPortfolio/.");
