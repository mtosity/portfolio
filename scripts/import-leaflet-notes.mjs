import { randomUUID } from "crypto";
import { neon } from "@neondatabase/serverless";
import { loadEnv, dbUrl } from "./_env.mjs";

loadEnv();
const sql = neon(dbUrl());

const FEED_URL = "https://mtosity.leaflet.pub/json";
const DID = "did:plc:zm6336ksoxchtw6n5zon7t6r";

function slugify(title) {
  return (title || "")
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9\s-]/g, "")
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-")
    .replace(/^-|-$/g, "");
}

function htmlHasText(html) {
  return (html || "").replace(/<[^>]+>/g, "").replace(/&nbsp;/g, " ").trim().length > 0;
}

function escapeHtml(s) {
  return s.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
}

function textToHtml(text) {
  return (text || "")
    .split(/\n{2,}/)
    .map((p) => `<p>${escapeHtml(p).replace(/\n/g, "<br>")}</p>`)
    .join("");
}

function deriveSummary(html, max = 200) {
  const text = html
    .replace(/<[^>]+>/g, " ")
    .replace(/&nbsp;/g, " ")
    .replace(/&amp;/g, "&")
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">")
    .replace(/\s+/g, " ")
    .trim();
  return text.length > max ? text.slice(0, max).trimEnd() + "…" : text;
}

function rkeyFromUrl(u) {
  return (u || "").split("/").filter(Boolean).pop();
}

// Fresh bodies for description-only notes, straight from the PDS repo.
async function fetchDescriptions() {
  try {
    const plc = await (await fetch(`https://plc.directory/${DID}`)).json();
    const pds = plc.service?.find((s) => s.id === "#atproto_pds")?.serviceEndpoint;
    if (!pds) return {};
    const map = {};
    let cursor;
    do {
      const url = new URL(`${pds}/xrpc/com.atproto.repo.listRecords`);
      url.searchParams.set("repo", DID);
      url.searchParams.set("collection", "site.standard.document");
      url.searchParams.set("limit", "100");
      if (cursor) url.searchParams.set("cursor", cursor);
      const data = await (await fetch(url)).json();
      for (const rec of data.records ?? []) {
        const rkey = rec.uri.split("/").pop();
        if (rkey && typeof rec.value?.description === "string") {
          map[rkey] = rec.value.description;
        }
      }
      cursor = data.records?.length ? data.cursor : undefined;
    } while (cursor);
    return map;
  } catch {
    return {};
  }
}

async function main() {
  console.log("Fetching Leaflet feed…");
  const feed = await (await fetch(FEED_URL)).json();
  const items = Array.isArray(feed.items) ? feed.items : [];
  console.log(`  ${items.length} notes in feed`);

  console.log("Fetching fresh descriptions from PDS…");
  const descriptions = await fetchDescriptions();

  let inserted = 0;
  let skipped = 0;
  const usedSlugs = new Set();

  // Insert oldest-first so chronological ties stay stable.
  for (const item of [...items].reverse()) {
    const rkey = rkeyFromUrl(item.url || item.id || "");
    let bodyHtml = item.content_html || "";
    if (!htmlHasText(bodyHtml)) {
      const fresh = (rkey && descriptions[rkey]) || item.summary || "";
      bodyHtml = textToHtml(fresh);
    }

    const title = (item.title || "Untitled").trim();
    let slug = slugify(title) || "note";
    let n = 1;
    while (usedSlugs.has(slug)) {
      n += 1;
      slug = `${slugify(title) || "note"}-${n}`;
    }
    usedSlugs.add(slug);

    const id = randomUUID();
    const summary = deriveSummary(bodyHtml);
    const createdAt = item.date_modified
      ? new Date(item.date_modified).toISOString()
      : new Date().toISOString();

    const res = await sql`
      INSERT INTO notes (id, slug, title, body_html, summary, published, created_at, updated_at)
      VALUES (${id}, ${slug}, ${title}, ${bodyHtml}, ${summary}, TRUE, ${createdAt}, ${createdAt})
      ON CONFLICT (slug) DO NOTHING
      RETURNING id
    `;
    if (res.length > 0) inserted += 1;
    else skipped += 1;
  }

  console.log(`✓ imported ${inserted} notes (${skipped} skipped as existing)`);
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
