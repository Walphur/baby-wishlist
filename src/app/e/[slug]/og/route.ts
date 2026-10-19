import { readFile } from "fs/promises";
import path from "path";
import sharp from "sharp";
import { createAdminClient } from "@/lib/supabase/admin";
import { isGeneratedInvitationUrl } from "@/lib/invitation";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const OG_WIDTH = 1200;
const OG_HEIGHT = 630;
const CREAM = { r: 250, g: 246, b: 238, alpha: 1 };

async function loadBear(origin: string) {
  try {
    return await readFile(path.join(process.cwd(), "public", "brand", "bear.png"));
  } catch {
    return loadRemote(new URL("/brand/bear.png", origin).toString());
  }
}

async function loadRemote(url: string) {
  try {
    const res = await fetch(url, { cache: "no-store" });
    if (!res.ok) return null;
    return Buffer.from(await res.arrayBuffer());
  } catch {
    return null;
  }
}

async function renderCard(source: Buffer) {
  const background = await sharp(source)
    .resize(OG_WIDTH, OG_HEIGHT, { fit: "cover" })
    .blur(28)
    .modulate({ brightness: 1.05, saturation: 0.8 })
    .toBuffer();

  const card = await sharp(source)
    .resize(OG_WIDTH - 80, OG_HEIGHT - 60, { fit: "inside" })
    .toBuffer();

  return sharp(background)
    .composite([{ input: card, gravity: "center" }])
    .jpeg({ quality: 82 })
    .toBuffer();
}

async function renderBear(source: Buffer) {
  const bear = await sharp(source)
    .resize(OG_HEIGHT - 120, OG_HEIGHT - 120, { fit: "inside" })
    .toBuffer();

  return sharp({
    create: { width: OG_WIDTH, height: OG_HEIGHT, channels: 4, background: CREAM },
  })
    .composite([{ input: bear, gravity: "center" }])
    .jpeg({ quality: 85 })
    .toBuffer();
}

export async function GET(req: Request, { params }: { params: { slug: string } }) {
  const supabase = createAdminClient();
  const { data: event } = await supabase
    .from("baby_events")
    .select("invitation_image_url")
    .eq("slug", params.slug)
    .maybeSingle();

  let image: Buffer | null = null;

  if (event && isGeneratedInvitationUrl(event.invitation_image_url)) {
    const source = await loadRemote(event.invitation_image_url as string);
    if (source) {
      image = await renderCard(source).catch(() => null);
    }
  }

  if (!image) {
    const bear = await loadBear(req.url);
    if (!bear) return Response.redirect(new URL("/brand/bear.png", req.url), 302);
    image = await renderBear(bear);
  }

  return new Response(new Uint8Array(image), {
    headers: {
      "Content-Type": "image/jpeg",
      "Cache-Control": "public, max-age=3600, s-maxage=86400, stale-while-revalidate=604800",
    },
  });
}
