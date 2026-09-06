import "server-only";

import { readFile } from "fs/promises";
import path from "path";
import sharp from "sharp";
import { createAdminClient } from "@/lib/supabase/admin";
import {
  formatInvitationDate,
  formatInvitationTime,
  getInvitationTemplate,
} from "@/lib/invitation";

const OPENAI_MODEL = process.env.OPENAI_IMAGE_MODEL?.trim() || "gpt-image-1";

export type InvitationGenerateInput = {
  eventId: string;
  templateId: string;
  babyName?: string | null;
  eventDate?: string | null;
  eventTime?: string | null;
  location?: string | null;
};

function buildPrompt(input: InvitationGenerateInput) {
  const name = input.babyName?.trim() || "";
  const date = formatInvitationDate(input.eventDate);
  const time = formatInvitationTime(input.eventTime);
  const location = input.location?.trim() || "";

  const lines = [
    name ? `Nombre del bebé: ${name}` : null,
    date ? `Fecha: ${date}` : null,
    time ? `Hora: ${time}` : null,
    location ? `Lugar: ${location}` : null,
  ].filter(Boolean);

  return [
    "Edit this baby shower invitation card.",
    "Keep the exact same illustration, layout, colors, decorations and existing printed phrases.",
    "Only fill the blank text areas / placeholder lines with the event details below.",
    "Match the card's typography style (script/serif/sans) and colors already used on the design.",
    "Do not invent extra decorations. Do not translate the existing Spanish phrases.",
    "Write the new text in Spanish exactly as provided.",
    "If a field is missing, leave that area empty.",
    "",
    ...lines,
  ].join("\n");
}

async function templatePngBuffer(templateId: string) {
  const template = getInvitationTemplate(templateId);
  if (!template) throw new Error("Plantilla inválida");

  const filePath = path.join(process.cwd(), "public", template.src.replace(/^\//, ""));
  const raw = await readFile(filePath);
  return sharp(raw).png().toBuffer();
}

/**
 * Genera la invitación con OpenAI Images Edit y la sube a Storage.
 * Devuelve la URL pública, o null si no hay API key / falla (fallback a overlay).
 */
export async function generateAndStoreInvitation(
  input: InvitationGenerateInput
): Promise<string | null> {
  const apiKey = process.env.OPENAI_API_KEY?.trim();
  if (!apiKey) return null;
  if (!getInvitationTemplate(input.templateId)) return null;

  try {
    const png = await templatePngBuffer(input.templateId);
    const form = new FormData();
    form.append("model", OPENAI_MODEL);
    form.append("prompt", buildPrompt(input));
    form.append("size", "1536x1024");
    form.append("quality", "medium");
    form.append(
      "image",
      new Blob([new Uint8Array(png)], { type: "image/png" }),
      `template-${input.templateId}.png`
    );

    const response = await fetch("https://api.openai.com/v1/images/edits", {
      method: "POST",
      headers: { Authorization: `Bearer ${apiKey}` },
      body: form,
    });

    if (!response.ok) {
      const detail = await response.text().catch(() => "");
      console.error("OpenAI invitation edit failed", response.status, detail.slice(0, 400));
      return null;
    }

    const payload = (await response.json()) as {
      data?: Array<{ b64_json?: string; url?: string }>;
    };
    const b64 = payload.data?.[0]?.b64_json;
    let bytes: Buffer | null = null;
    if (b64) {
      bytes = Buffer.from(b64, "base64");
    } else if (payload.data?.[0]?.url) {
      const imageRes = await fetch(payload.data[0].url);
      if (imageRes.ok) bytes = Buffer.from(await imageRes.arrayBuffer());
    }
    if (!bytes) return null;

    const admin = createAdminClient();
    const objectPath = `${input.eventId}/${Date.now()}.png`;
    const { error: uploadError } = await admin.storage
      .from("invitations")
      .upload(objectPath, bytes, {
        contentType: "image/png",
        upsert: true,
      });
    if (uploadError) {
      console.error("Invitation upload failed", uploadError.message);
      return null;
    }

    const { data } = admin.storage.from("invitations").getPublicUrl(objectPath);
    return data.publicUrl || null;
  } catch (error) {
    console.error("generateAndStoreInvitation", error);
    return null;
  }
}
