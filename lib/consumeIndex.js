import LANGUAGE_MAP from "./languages.js";

export default function consumeIndex(page, baseUrl) {
  return page(".sectiontable tr")
    .toArray()
    .filter((row) => page(row).children().length)
    .map((rowEl) => {
      const row = page(rowEl);
      const data = {};

      data.id = row
        .find(".col2, .col6")
        .first()
        .contents()
        .toArray()
        .filter((node) => node.type === "text")
        .map((node) => page(node).text().trim())
        .filter((text) => text);

      const discs = data.id.length;

      if (data.id.length === 1) {
        data.id = data.id.shift();
      }

      const titleColumn = row.find(".col3, .col7").first();

      data.title = titleColumn
        .contents()
        .first()
        .text()
        .replace(/\[\s*\d DISCS\s*\]\]?/g, "")
        .replace(/^[\s-]+|[\s-]+$/g, "");

      titleColumn.find("> span > u").each((_, headingEl) => {
        const heading = page(headingEl);
        const headingTitle = heading
          .text()
          .toLowerCase()
          .replace(/^\s*|[\:\s]*$/g, "");

        const headingDetailEntries = heading
          .next()
          .contents()
          .toArray()
          .filter((node) => node.type === "text")
          .map((node) => page(node).text().replace(/[\s\n]+/g, " ").trim());

        if (headingDetailEntries.length === 1) {
          data[headingTitle] = headingDetailEntries.shift();
        } else if (headingDetailEntries.length > 1) {
          data[headingTitle] = headingDetailEntries;
        }
      });

      data.discs = discs;

      const languages = row.find(".col4, .col8").first().text().match(/\w+/g);
      if (languages) {
        data.languages = languages.map(
          (language) => LANGUAGE_MAP[language.toLowerCase()] || language
        );
      }

      const link = row.find(".col1 a[href], .col5 a[href]").first();
      if (link.length) {
        data.link = new URL(link.attr("href"), baseUrl).href;
      }

      return data;
    });
}
