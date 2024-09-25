import fs from "fs/promises";
import path from "path";
import { fileURLToPath } from "url";
import { JSDOM } from "jsdom";
import consumeIndex from "../lib/consumeIndex.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const SOURCES = {
  ps1: {
    Japan: "https://psxdatacenter.com/jlist.html",
    America: "https://psxdatacenter.com/ulist.html",
    Europe: "https://psxdatacenter.com/plist.html",
  },
  ps2: {
    Japan: "https://psxdatacenter.com/psx2/jlist2.html",
    America: "https://psxdatacenter.com/psx2/ulist2.html",
    Europe: "https://psxdatacenter.com/psx2/plist2.html",
  },
  psp: {
    Japan: "https://psxdatacenter.com/psp/jlist.html",
    America: "https://psxdatacenter.com/psp/ulist.html",
    Europe: "https://psxdatacenter.com/psp/plist.html",
  },
};

async function processInParallel(
  items,
  processFunction,
  concurrency = 5,
  delayMs = 1000
) {
  const chunks = [];
  for (let i = 0; i < items.length; i += concurrency) {
    chunks.push(items.slice(i, i + concurrency));
  }

  for (const chunk of chunks) {
    const chunkPromises = chunk.map(processFunction);
    await Promise.all(chunkPromises);

    // Add a delay between chunks to avoid overwhelming the server
    await new Promise((resolve) => setTimeout(resolve, delayMs));
  }
}

async function processGameDetails(game) {
  if (!game.link) return game;

  console.log(`Fetching game details for '${game.link}'...`);
  try {
    const dom = await JSDOM.fromURL(game.link);
    const document = dom.window.document;

    // Extract cover image link
    const coverImg = document.querySelector("td.sectional > img");
    if (coverImg) {
      game.cover = new URL(coverImg.src, game.link).href;
    }

    // Extract other details
    game.officialTitle = document
      .querySelector('td[style*="Official Title"] + td')
      ?.textContent.trim();
    game.developer = document
      .querySelector('td[style*="Developer"] + td')
      ?.textContent.trim();
    game.publisher = document
      .querySelector('td[style*="Publisher"] + td')
      ?.textContent.trim();
    game.releaseDate = document
      .querySelector('td[style*="Date Released"] + td')
      ?.textContent.trim();

    return game;
  } catch (error) {
    console.error(`Error processing '${game.link}':`, error.message);
    return game;
  }
}

async function saveGameData(platform, region, game) {
  const gameIds = Array.isArray(game.id) ? game.id : [game.id];
  for (const id of gameIds) {
    const outputFile = path.join(
      __dirname,
      "..",
      "data",
      platform,
      region,
      `${id}.json`
    );
    await fs.mkdir(path.dirname(outputFile), { recursive: true });
    await fs.writeFile(outputFile, JSON.stringify(game, null, 2));
  }
}

async function processPlatform(platform, platformRegions) {
  console.log(`Processing platform '${platform}'...`);

  for (const [region, url] of Object.entries(platformRegions)) {
    console.log(`Fetching and parsing '${url}'...`);

    try {
      const dom = await JSDOM.fromURL(url);
      const index = consumeIndex(dom.window.document);

      await processInParallel(
        index,
        async (game) => {
          const processedGame = await processGameDetails(game);
          await saveGameData(platform, region, processedGame);
        },
        10, // 10 requests at a time
        300 // 300ms delay between requests
      );

      console.log(`Finished processing ${platform}/${region}`);
    } catch (error) {
      console.error(`Error processing '${platform}/${region}':`, error.message);
    }
  }
}

async function main() {
  try {
    for (const [platform, platformRegions] of Object.entries(SOURCES)) {
      await processPlatform(platform, platformRegions);
    }
    console.log("Done!");
  } catch (error) {
    console.error(error);
  }
}

main();
