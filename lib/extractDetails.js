function applyDetail(game, label, value) {
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
      game.developer = value.replace(/\.$/, "");
      break;
    case "Publisher":
      game.publisher = value.replace(/\.$/, "");
      break;
    case "Date Released":
      game.releaseDate = value;
      break;
  }
}

export default function extractDetails(page, game) {
  const coverImg = page("td.sectional > img").first();
  if (coverImg.length) {
    const src = coverImg.attr("src");
    if (src) {
      game.cover = new URL(src, game.link).href;
    }
  }

  page("#table4 tr").each((_, row) => {
    const cells = page(row).find("td");
    if (cells.length >= 2) {
      applyDetail(game, cells.eq(0).text().trim(), cells.eq(1).text().trim());
    }
  });

  const descriptionCell = page("#table16 td").first();
  if (descriptionCell.length) {
    game.description = descriptionCell.text().trim();
  }

  return game;
}
