// News in One Image — 19 November 2026.
// Copies the pre-built front page (entry.png) into the output directory.
// Node 22, stdlib only, no network, fully deterministic: same input bytes
// in, same output bytes out, every run.
import { copyFileSync, mkdirSync, readdirSync, rmSync, statSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const here = dirname(fileURLToPath(import.meta.url));
const outDir = process.env.MAKEFUN_OUTPUT_DIR ?? "/output";

// Create the output dir if needed, then empty its CONTENTS only.
// Never delete the output dir itself: on the grader it may be a mount.
mkdirSync(outDir, { recursive: true });
for (const name of readdirSync(outDir)) {
  rmSync(join(outDir, name), { recursive: true, force: true });
}

const src = join(here, "entry.png");
const dst = join(outDir, "entry.png");

// Fail loudly (non-zero exit) if the source image is missing, instead of
// writing a partial output. Also enforce the bounty cap: at most 1 MiB.
if (!statSync(src, { throwIfNoEntry: false })) {
  console.error(`missing source image: ${src}`);
  process.exit(1);
}
if (statSync(src).size > 1048576) {
  console.error(`source image exceeds the 1 MiB cap: ${statSync(src).size} bytes`);
  process.exit(1);
}
copyFileSync(src, dst);

const bytes = statSync(dst).size;
console.log(`wrote ${dst} (${bytes} bytes)`);
