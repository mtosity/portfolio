import { NextResponse } from "next/server";

// Keep the notes board close to the live Leaflet dashboard. A long window
// (it used to be 1 hour) meant freshly published notes were missing for up
// to an hour; 60s bounds the staleness while still avoiding hammering Leaflet.
export const revalidate = 60;

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

    return NextResponse.json(data);
  } catch {
    return NextResponse.json(
      { error: "Failed to fetch notes" },
      { status: 500, headers: { "Cache-Control": "no-store" } }
    );
  }
}
