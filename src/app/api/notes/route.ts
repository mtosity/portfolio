import { NextResponse } from "next/server";

export const revalidate = 3600; // revalidate every hour

export async function GET() {
  try {
    const res = await fetch("https://mtosity.leaflet.pub/json", {
      next: { revalidate: 3600 },
    });

    if (!res.ok) {
      return NextResponse.json(
        { error: "Failed to fetch notes" },
        { status: 502 }
      );
    }

    const data = await res.json();
    return NextResponse.json(data);
  } catch {
    return NextResponse.json(
      { error: "Failed to fetch notes" },
      { status: 500 }
    );
  }
}
