import { test } from "node:test";
import assert from "node:assert/strict";
import { normalizeUrl, youtubeId, tiktokId, videoSource, isEmail, isPhone, whatsappHref } from "../../src/lib/bio/urls.ts";
import { usernameProblem, normalizeUsername } from "../../src/lib/bio/username.ts";
import { emptyDoc, newBlock, parseDoc, safeParseDoc, LIMITS } from "../../src/lib/bio/schema.ts";
import { publishIssues, isLive } from "../../src/lib/bio/validate.ts";
import { resolveEmbed } from "../../src/lib/bio/embeds.ts";
import { detectPlatform } from "../../src/lib/bio/social.ts";
import { TEMPLATES } from "../../src/lib/bio/templates.ts";

test("normalizeUrl accepts public http(s) and rejects dangerous schemes and private hosts", () => {
  assert.equal(normalizeUrl("example.com/menu"), "https://example.com/menu");
  for (const bad of ["javascript:alert(1)", "data:text/html,x", "file:///etc/passwd", "http://localhost:3000", "http://127.0.0.1", "http://10.0.0.5", "http://192.168.1.1", "http://169.254.169.254/latest", "https://user:pw@example.com", "ftp://example.com", "notaurl", ""]) {
    assert.equal(normalizeUrl(bad), null, bad);
  }
});

test("embed/video id parsing", () => {
  assert.equal(youtubeId("https://youtu.be/dQw4w9WgXcQ"), "dQw4w9WgXcQ");
  assert.equal(youtubeId("https://www.youtube.com/watch?v=dQw4w9WgXcQ&t=3"), "dQw4w9WgXcQ");
  assert.equal(youtubeId("https://youtube.com/shorts/abcDEF12345"), "abcDEF12345");
  assert.equal(youtubeId("https://vimeo.com/1"), null);
  assert.equal(tiktokId("https://www.tiktok.com/@a/video/7234567890123456789"), "7234567890123456789");
  assert.deepEqual(videoSource("https://vimeo.com/76979871"), { kind: "vimeo", id: "76979871" });
  assert.equal(resolveEmbed("https://open.spotify.com/track/abc123")?.provider, "Spotify");
  assert.equal(resolveEmbed("https://evil.example/embed"), null);
});

test("contact helpers", () => {
  assert.ok(isEmail("a@b.co"));
  assert.ok(!isEmail("a@b"));
  assert.ok(isPhone("+1 (305) 555-0100"));
  assert.ok(!isPhone("12"));
  assert.equal(whatsappHref("+1 305 555 0100", "hi there"), "https://wa.me/13055550100?text=hi%20there");
  assert.equal(detectPlatform("instagram.com/foo"), "instagram");
  assert.equal(detectPlatform("https://x.com/foo"), "x");
  assert.equal(detectPlatform("me@example.com"), "email");
});

test("username rules", () => {
  assert.equal(normalizeUsername("@MiamiBakery"), "miamibakery");
  assert.equal(usernameProblem("miamibakery"), null);
  assert.equal(usernameProblem("ab"), "At least 3 characters");
  assert.equal(usernameProblem("admin"), "That name is reserved");
  assert.equal(usernameProblem("dashboard"), "That name is reserved");
  assert.ok(usernameProblem("-bad"));
  assert.ok(usernameProblem("a..b"));
  assert.ok(usernameProblem("has space"));
  assert.equal(usernameProblem("creativo.studio"), null);
});

test("schema fills defaults and enforces limits", () => {
  const d = emptyDoc();
  assert.equal(d.theme.button.style, "fill");
  const tooMany = { blocks: Array.from({ length: LIMITS.blocks + 1 }, (_, i) => ({ id: `b${i}`, type: "text" })) };
  assert.equal(safeParseDoc(tooMany).success, false);
  assert.equal(safeParseDoc({ blocks: [{ id: "x", type: "image", src: "javascript:alert(1)" }] }).success, false);
  assert.equal(safeParseDoc({ theme: { text: "red" } }).success, false);
});

test("publishIssues flags broken content; isLive honours hidden + schedule", () => {
  const d = parseDoc({ profile: { name: "A" }, blocks: [{ id: "l", type: "link", title: "x", url: "javascript:x" }, { id: "e", type: "email", email: "nope" }] });
  assert.deepEqual(publishIssues(d).map((i) => i.blockId), ["l", "e"]);
  const now = new Date("2026-06-01T00:00:00Z");
  assert.equal(isLive(newBlock("link", "a", { schedule: { start: "2026-07-01T00:00:00Z", end: "" } }), now), false);
  assert.equal(isLive(newBlock("link", "a", { schedule: { start: "", end: "2026-05-01T00:00:00Z" } }), now), false);
  assert.equal(isLive(newBlock("link", "a", { hidden: true }), now), false);
  assert.equal(isLive(newBlock("link", "a"), now), true);
});

test("template library: 15+ templates, every category, all valid", () => {
  assert.ok(TEMPLATES.length >= 15);
  assert.equal(new Set(TEMPLATES.map((t) => t.category)).size, 15);
  for (const t of TEMPLATES) {
    assert.ok(safeParseDoc(t.doc).success, t.id);
    const ids = t.doc.blocks.map((b) => b.id);
    assert.equal(new Set(ids).size, ids.length, `duplicate block id in ${t.id}`);
  }
});
