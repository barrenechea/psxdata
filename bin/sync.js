import fs from "fs-extra";
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

async function processPlatform(platform, platformRegions) {
  console.log(`processing platform '${platform}'...`);

  for (const [region, url] of Object.entries(platformRegions)) {
    console.log(`fetching and parsing '${url}'...`);

    try {
      const dom = await JSDOM.fromURL(url);
      const index = consumeIndex(dom.window.document);

      const outputFile = path.join(__dirname, "..", platform, `${region}.json`);
      console.log(`writing to '${outputFile}'...`);

      await fs.outputJson(outputFile, index, { spaces: 2 });
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
