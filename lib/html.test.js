import { test } from "node:test";
import assert from "node:assert/strict";
import { decodeHtmlBytes } from "./html.js";

test("decodes windows-1252 HTML (default when no charset is declared)", () => {
  const html = "<title>EINHÄNDER</title>";
  const bytes = Uint8Array.from(Buffer.from(html, "latin1"));
  const decoded = decodeHtmlBytes(bytes);

  assert.equal(decoded.encoding, "windows-1252");
  assert.equal(decoded.html, html);
});

test("decodes UTF-16LE HTML from a BOM", () => {
  const html = "<title>パラサイトイヴ</title>";
  const bytes = new Uint8Array(Buffer.from(`\uFEFF${html}`, "utf16le"));
  const decoded = decodeHtmlBytes(bytes);

  assert.match(decoded.encoding, /utf-16/i);
  assert.ok(decoded.html.includes("パラサイトイヴ"));
});

test("honors a meta charset declaration", () => {
  const html =
    '<meta charset="utf-8"><title>リッジレーサー</title>';
  const bytes = new TextEncoder().encode(html);
  const decoded = decodeHtmlBytes(bytes);

  assert.equal(decoded.encoding, "UTF-8");
  assert.ok(decoded.html.includes("リッジレーサー"));
});
