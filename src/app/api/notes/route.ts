import { NextResponse } from "next/server";

// Keep the notes board close to the live Leaflet dashboard. A long window
// (it used to be 1 hour) meant freshly published notes were missing for up
// to an hour; 60s bounds the staleness while still avoiding hammering Leaflet.
export const revalidate = 60;

const DID = "did:plc:zm6336ksoxchtw6n5zon7t6r";

interface FeedItem {
  id: string;
  url: string;
  title: string;
  content_html: string;
  summary?: string;
  date_modified: string;
}

interface PlcService {
  id: string;
  serviceEndpoint: string;
}

// Notes whose body lives in the record's `description` (rather than rich
// content blocks) come through Leaflet's /json feed only as `summary`. That
// feed is CDN-cached on Leaflet's side (s-maxage=300, swr=3600), so edits can
// show stale text for a while even though the live Leaflet page is updated.
// The PDS repo reflects edits immediately, so we read descriptions straight
// from it and overlay them onto the feed for an always-fresh fallback body.
async function fetchFreshDescriptions(): Promise<Record<string, string>> {
  try {
    const plcRes = await fetch(`https://plc.directory/${DID}`, {
      next: { revalidate: 86400 },
    });
    if (!plcRes.ok) return {};
    const plcDoc: { service?: PlcService[] } = await plcRes.json();
    const pds = plcDoc.service?.find(
      (s) => s.id === "#atproto_pds"
    )?.serviceEndpoint;
    if (!pds) return {};

    const descriptions: Record<string, string> = {};
    let cursor: string | undefined;
    do {
      const url = new URL(`${pds}/xrpc/com.atproto.repo.listRecords`);
      url.searchParams.set("repo", DID);
      url.searchParams.set("collection", "site.standard.document");
      url.searchParams.set("limit", "100");
      if (cursor) url.searchParams.set("cursor", cursor);

      const res = await fetch(url, { next: { revalidate: 60 } });
      if (!res.ok) break;
      const data: {
        records?: { uri: string; value?: { description?: string } }[];
        cursor?: string;
      } = await res.json();

      for (const rec of data.records ?? []) {
        const rkey = rec.uri.split("/").pop();
        if (rkey && typeof rec.value?.description === "string") {
          descriptions[rkey] = rec.value.description;
        }
      }
      cursor = data.records?.length ? data.cursor : undefined;
    } while (cursor);

    return descriptions;
  } catch {
    return {};
  }
}

function rkeyFromUrl(u: string): string | undefined {
  return u.split("/").filter(Boolean).pop();
}

export async function GET() {
  try {
    const res = await fetch("https://mtosity.leaflet.pub/json", {
      next: { revalidate: 60 },
    });

    if (!res.ok) {
      // Don't let a transient Leaflet failure get cached as the response.
      return NextResponse.json(
        { error: "Failed to fetch notes" },
        { status: 502, headers: { "Cache-Control": "no-store" } }
      );
    }

    const data = await res.json();

    // Guard against an unexpected shape so the client never renders a
    // partial/empty board that looks like "missing posts".
    if (!data || !Array.isArray(data.items)) {
      return NextResponse.json(
        { error: "Unexpected feed shape" },
        { status: 502, headers: { "Cache-Control": "no-store" } }
      );
    }

    // Overlay fresh descriptions from the PDS so edited bodies show up
    // immediately instead of waiting on Leaflet's feed cache.
    const descriptions = await fetchFreshDescriptions();
    if (Object.keys(descriptions).length > 0) {
      data.items = (data.items as FeedItem[]).map((item) => {
        const rkey = rkeyFromUrl(item.url || item.id || "");
        const fresh = rkey ? descriptions[rkey] : undefined;
        return fresh ? { ...item, summary: fresh } : item;
      });
    }

    return NextResponse.json(data);
  } catch {
    return NextResponse.json(
      { error: "Failed to fetch notes" },
      { status: 500, headers: { "Cache-Control": "no-store" } }
    );
  }
}
