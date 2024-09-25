import fs from "fs/promises";
import path from "path";
import { fileURLToPath } from "url";
import { JSDOM } from "jsdom";
import consumeIndex from "../lib/consumeIndex.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const SOURCES = {
  ps1: {
    "ntsc-j": "https://psxdatacenter.com/jlist.html",
    "ntsc-uc": "https://psxdatacenter.com/ulist.html",
    pal: "https://psxdatacenter.com/plist.html",
  },
  ps2: {
    "ntsc-j": "https://psxdatacenter.com/psx2/jlist2.html",
    "ntsc-uc": "https://psxdatacenter.com/psx2/ulist2.html",
    pal: "https://psxdatacenter.com/psx2/plist2.html",
  },
  psp: {
    "ntsc-j": "https://psxdatacenter.com/psp/jlist.html",
    "ntsc-uc": "https://psxdatacenter.com/psp/ulist.html",
    pal: "https://psxdatacenter.com/psp/plist.html",
  },
};

async function processGameDetails(gameUrl) {
  console.log(`Fetching details for ${gameUrl}...`);
  const dom = await JSDOM.fromURL(gameUrl);
  const document = dom.window.document;

  const gameDetails = {};

  // Extract cover image link
  const coverImg = document.querySelector("td.sectional > img");
  if (coverImg) {
    gameDetails.cover = new URL(coverImg.src, gameUrl).href;
  }

  // Extract other details (examples)
  gameDetails.officialTitle = document
    .querySelector('td[style*="Official Title"] + td')
    ?.textContent.trim();
  gameDetails.developer = document
    .querySelector('td[style*="Developer"] + td')
    ?.textContent.trim();
  gameDetails.publisher = document
    .querySelector('td[style*="Publisher"] + td')
    ?.textContent.trim();
  gameDetails.releaseDate = document
    .querySelector('td[style*="Date Released"] + td')
    ?.textContent.trim();

  return gameDetails;
}

async function processPlatform(platform, platformRegions) {
  console.log(`processing platform '${platform}'...`);

  for (const [region, url] of Object.entries(platformRegions)) {
    console.log(`fetching and parsing '${url}'...`);

    try {
      const dom = await JSDOM.fromURL(url);
      const index = consumeIndex(dom.window.document);

      // Process each game in the index
      for (const game of index) {
        if (game.link) {
          const gameDetails = await processGameDetails(game.link);
          Object.assign(game, gameDetails);
        }
      }

      const outputFile = path.join(__dirname, "..", platform, `${region}.json`);
      console.log(`writing to '${outputFile}'...`);

      await fs.mkdir(path.dirname(outputFile), { recursive: true });
      await fs.writeFile(outputFile, JSON.stringify(index, null, 2));
    } catch (error) {
      console.error(`error processing ${platform}/${region}`, error);
    }
  }
}

async function main() {
  try {
    for (const [platform, platformRegions] of Object.entries(SOURCES)) {
      await processPlatform(platform, platformRegions);
    }
    console.log("done!");
  } catch (error) {
    console.error(error);
  }
}

main();
