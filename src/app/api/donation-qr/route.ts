import { NextResponse } from "next/server";
import QRCode from "qrcode";
import { MP_DONATION_URL } from "@/lib/donation";

export async function GET() {
  if (!MP_DONATION_URL) {
    return NextResponse.json({ error: "missing donation url" }, { status: 404 });
  }

  const svg = await QRCode.toString(MP_DONATION_URL, {
    type: "svg",
    margin: 2,
    width: 280,
    color: { dark: "#2B2822", light: "#FFFEFC" },
  });

  return new NextResponse(svg, {
    headers: {
      "Content-Type": "image/svg+xml; charset=utf-8",
      "Cache-Control": "public, max-age=86400",
    },
  });
}
