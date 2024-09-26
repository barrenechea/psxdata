import fs from "fs/promises";
import path from "path";
import { fileURLToPath } from "url";
import { JSDOM } from "jsdom";
import consumeIndex from "./lib/consumeIndex.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const SOURCES = {
  PS1: {
    Japan: "https://psxdatacenter.com/jlist.html",
    America: "https://psxdatacenter.com/ulist.html",
    Europe: "https://psxdatacenter.com/plist.html",
  },
  PS2: {
    Japan: "https://psxdatacenter.com/psx2/jlist2.html",
    America: "https://psxdatacenter.com/psx2/ulist2.html",
    Europe: "https://psxdatacenter.com/psx2/plist2.html",
  },
  PSP: {
    Japan: "https://psxdatacenter.com/psp/jlist.html",
    America: "https://psxdatacenter.com/psp/ulist.html",
    Europe: "https://psxdatacenter.com/psp/plist.html",
  },
};

async function processInParallel(
  items,
  processFunction,
  concurrency = 20,
  delayMs = 300
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

async function downloadCover(url, platform, region, gameId) {
  const response = await fetch(url);
  if (!response.ok) {
    throw new Error(`Failed to download cover: ${response.status}`);
  }

  const ext = path.extname(url);
  const filePath = path.join(
    __dirname,
    "dist",
    platform,
    region,
    "covers",
    `${gameId}${ext}`
  );

  await fs.mkdir(path.dirname(filePath), { recursive: true });
  const buffer = await response.arrayBuffer();
  await fs.writeFile(filePath, Buffer.from(buffer));

  return filePath;
}

async function processGameDetails(game, platform, region, single) {
  if (!game.link) return game;

  let coverDownloaded = false;

  try {
    const dom = await JSDOM.fromURL(game.link);
    const document = dom.window.document;

    // Extract cover image link
    const coverImg = document.querySelector("td.sectional > img");
    if (coverImg) {
      game.cover = new URL(coverImg.src, game.link).href;
      try {
        const gameId = Array.isArray(game.id) ? game.id[0] : game.id;
        await downloadCover(
          game.cover,
          !single ? platform : "",
          region,
          gameId
        );
        coverDownloaded = true;
      } catch (error) {
        // Silently handle the error, cover download status will remain false
      }
    }

    // Extract other details
    const detailsTable = document.getElementById("table4");
    if (detailsTable) {
      const rows = detailsTable.querySelectorAll("tr");
      rows.forEach((row) => {
        const cells = row.querySelectorAll("td");
        if (cells.length >= 2) {
          const label = cells[0].textContent.trim();
          const value = cells[1].textContent.trim();

          switch (label) {
            case "Official Title":
              game.officialTitle = value;
              break;
            case "Common Title":
              game.commonTitle = value;
              break;
            case "Region":
              game.region = value;
              break;
            case "Genre / Style":
              game.genre = value.replace(/^\s*&nbsp;/, "").trim();
              break;
            case "Developer":
              // Remove trailing dot
              game.developer = value.replace(/\.$/, "");
              break;
            case "Publisher":
              // Remove trailing dot
              game.publisher = value.replace(/\.$/, "");
              break;
            case "Date Released":
              game.releaseDate = value;
              break;
          }
        }
      });
    }

    // Extract game description
    const descriptionTable = document.getElementById("table16");
    if (descriptionTable) {
      const descriptionCell = descriptionTable.querySelector("td");
      if (descriptionCell) {
        game.description = descriptionCell.textContent.trim();
      }
    }

    console.log(
      `Successfully fetched data for ${game.title}${
        coverDownloaded ? " (cover downloaded)" : ""
      }`
    );

    return game;
  } catch (error) {
    console.error(`Error processing '${game.title}':`, error.message);
    return game;
  }
}

async function saveGameData(platform, region, game) {
  const gameIds = Array.isArray(game.id) ? game.id : [game.id];
  for (const id of gameIds) {
    const outputFile = path.join(
      __dirname,
      "dist",
      platform,
      region,
      `${id}.json`
    );
    await fs.mkdir(path.dirname(outputFile), { recursive: true });
    await fs.writeFile(outputFile, JSON.stringify(game, null, 2));
  }
}

async function processPlatform(platform, platformRegions, single) {
  console.log(`Processing platform '${platform}'...`);

  for (const [region, url] of Object.entries(platformRegions)) {
    console.log(`Fetching and parsing '${url}'...`);

    try {
      const dom = await JSDOM.fromURL(url);
      const index = consumeIndex(dom.window.document);

      await processInParallel(index, async (game) => {
        const processedGame = await processGameDetails(
          game,
          platform,
          region,
          single
        );
        await saveGameData(!single ? platform : "", region, processedGame);
      });

      console.log(`Finished processing ${platform}/${region}`);
    } catch (error) {
      console.error(`Error processing '${platform}/${region}':`, error.message);
    }
  }
}

async function generateIndexHtml(single) {
  const distDir = path.join(__dirname, "dist");
  let content =
    "<html><head><title>PlayStation DataCenter Index</title></head><body><h1>PlayStation DataCenter Index</h1>";

  const platforms = single ? [""] : await fs.readdir(distDir);

  for (const platform of platforms) {
    if (platform) {
      content += `<h2>${platform}</h2>`;
    }
    const platformDir = path.join(distDir, platform);

    const regions = await fs.readdir(platformDir);
    for (const region of regions) {
      content += `<h3>${region}</h3><ul>`;
      const regionDir = path.join(platformDir, region);

      const files = await fs.readdir(regionDir);
      for (const file of files) {
        if (file.endsWith(".json")) {
          const relativePath = path
            .join(platform, region, file)
            .replace(/\\/g, "/");
          content += `<li><a href="${relativePath}">${file}</a></li>`;
        }
      }

      content += "</ul>";
    }
  }

  content += "</body></html>";

  await fs.writeFile(path.join(distDir, "index.html"), content);
  console.log("Generated index.html");
}

async function main() {
  try {
    const platform = process.argv[2]?.toUpperCase();

    if (platform && !["PS1", "PS2", "PSP"].includes(platform)) {
      console.error("Invalid platform. Please use PS1, PS2, or PSP.");
      process.exit(1);
    }

    const platformsToProcess = platform
      ? { [platform]: SOURCES[platform] }
      : SOURCES;

    for (const [currentPlatform, platformRegions] of Object.entries(
      platformsToProcess
    )) {
      await processPlatform(currentPlatform, platformRegions, !!platform);
    }
    await generateIndexHtml(!!platform);
    console.log("Done!");
  } catch (error) {
    console.error(error);
  }
}

main();
