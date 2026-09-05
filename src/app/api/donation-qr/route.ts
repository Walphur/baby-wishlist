import { NextResponse } from "next/server";
import QRCode from "qrcode";
import { MP_DONATION_ALIAS } from "@/lib/donation";

export async function GET() {
  if (!MP_DONATION_ALIAS) {
    return NextResponse.json({ error: "missing donation alias" }, { status: 404 });
  }

  const svg = await QRCode.toString(MP_DONATION_ALIAS, {
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
