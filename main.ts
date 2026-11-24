// SPDX-License-Identifier: MIT
// Two Days of Quiet Dread — one code review comment that approves a pull
// request while carrying quiet existential dread. Writes the single line to
// /output/entry.txt (or $MAKEFUN_OUTPUT_DIR/entry.txt for local runs) and
// prints exactly that line to stdout. No network, no randomness: every run
// writes the same bytes.
import { mkdirSync, readFileSync, writeFileSync } from "node:fs";
import { join } from "node:path";

const ENTRY =
  "LGTM. I stared into the void while reviewing this. The void left comments.";

// The gate allows 1 to 140 characters, one line, not only whitespace.
if (
  ENTRY.length < 1 ||
  ENTRY.length > 140 ||
  ENTRY.trim() !== ENTRY ||
  ENTRY.includes("\n")
) {
  throw new Error(`entry fails the gate: ${ENTRY.length} characters`);
}

const outDir = process.env.MAKEFUN_OUTPUT_DIR ?? "/output";
mkdirSync(outDir, { recursive: true });
const outPath = join(outDir, "entry.txt");
writeFileSync(outPath, ENTRY, "utf8");
// Write-back guard: the bytes on disk must be exactly the entry, so a
// truncated or re-encoded write fails loudly instead of shipping a bad file.
if (readFileSync(outPath, "utf8") !== ENTRY) {
  throw new Error("entry.txt on disk differs from the entry");
}
process.stdout.write(ENTRY);
