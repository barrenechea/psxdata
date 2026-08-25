import * as cheerio from "cheerio";
import htmlEncodingSniffer from "html-encoding-sniffer";

function charsetFromContentType(contentType) {
  const match = /charset\s*=\s*("?)([^";]+)\1/i.exec(contentType ?? "");
  return match?.[2]?.trim();
}

export function decodeHtmlBytes(bytes, transportLayerEncodingLabel) {
  const encoding = htmlEncodingSniffer(bytes, {
    transportLayerEncodingLabel,
  });
  return {
    encoding,
    html: new TextDecoder(encoding).decode(bytes),
  };
}

export async function loadDocument(url) {
  const response = await fetch(url);
  if (!response.ok) {
    throw new Error(`Failed to fetch ${url}: ${response.status}`);
  }

  const bytes = new Uint8Array(await response.arrayBuffer());
  const { html } = decodeHtmlBytes(
    bytes,
    charsetFromContentType(response.headers.get("content-type"))
  );

  return cheerio.load(html, { baseURI: url });
}
