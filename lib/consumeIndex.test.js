import { test } from "node:test";
import assert from "node:assert/strict";
import path from "path";
import { fileURLToPath } from "url";
import { readFile } from "fs/promises";
import * as cheerio from "cheerio";
import consumeIndex from "./consumeIndex.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

test("consumeIndex produces expected output", async () => {
  const html = await readFile(
    path.join(__dirname, "__fixtures__", "ps1.html"),
    "utf8"
  );
  const page = cheerio.load(html, { baseURI: "https://test-psxdata" });

  const result = consumeIndex(page, "https://test-psxdata");

  assert.equal(result.length, 17, "Should have 17 items");

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
