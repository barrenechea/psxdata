import { test } from "node:test";
import assert from "node:assert/strict";
import path from "path";
import { fileURLToPath } from "url";
import { readFile } from "fs/promises";
import { JSDOM } from "jsdom";
import consumeIndex from "./consumeIndex.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

test("consumeIndex produces expected output under JSDOM", async (t) => {
  const html = await readFile(
    path.join(__dirname, "__fixtures__", "ps1.html"),
    "utf8"
  );
  const dom = new JSDOM(html, { url: "https://test-psxdata" });

  const result = consumeIndex(dom.window.document);

  // Instead of using snapshot testing, we'll make some specific assertions
  assert.equal(result.length, 17, "Should have 17 items");

  // Test the first item
  assert.deepEqual(
    result[0],
    {
      discs: 6,
      id: [
        "SLUS-01224",
        "SLUS-01252",
        "SLUS-01253",
        "SLUS-01254",
        "SLUS-01255",
        "SLUS-01256",
      ],
      includes: [
        "Arc The Lad - Arc The Lad II - Arc The Lad III (2 Discs)",
        "Arc The Lad - Monster Tournament - Battle Arena & Arc The Lad - The Making Of Disc",
      ],
      languages: ["en"],
      link: "https://test-psxdata/games/U/A/SLUS-01224.html",
      title: "ARC THE LAD COLLECTION",
    },
    "First item should match expected structure"
  );

  // Test a single-disc game
  const crashBandicoot = result.find(
    (game) => game.title === "CRASH BANDICOOT"
  );
  assert.deepEqual(
    crashBandicoot,
    {
      discs: 1,
      id: "SCES-00344",
      languages: ["en"],
      link: "https://test-psxdata/games/P/C/SCES-00344.html",
      title: "CRASH BANDICOOT",
    },
    "CRASH BANDICOOT should have correct structure"
  );
});
