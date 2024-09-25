import path from "path";
import { fileURLToPath } from "url";
import { JSDOM } from "jsdom";
import consumeIndex from "./consumeIndex.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

describe("consumeIndex", () => {
  it("produces expected output under JSDOM", async () => {
    const dom = await JSDOM.fromFile(
      path.join(__dirname, "__fixtures__", "ps1.html"),
      { url: "https://test-psxdata" }
    );

    expect(consumeIndex(dom.window.document)).toMatchSnapshot();
  });
});
