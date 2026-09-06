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

  const details = [
    name ? `- Baby name (exact spelling): ${name}` : null,
    date ? `- Date (exact spelling): ${date}` : null,
    time ? `- Time (exact spelling): ${time}` : null,
    location ? `- Place / venue (exact spelling): ${location}` : null,
  ].filter(Boolean);

  return [
    "Task: minimal text overlay on an existing baby shower invitation.",
    "",
    "HARD RULES (do not break any):",
    "1. Keep the input image almost unchanged: same crop, same illustrations, same background, same colors, same decorations.",
    "2. Do NOT rewrite, move, resize, recolor, restyle, translate, or delete ANY text that is already printed on the card.",
    "3. Do NOT change headlines like “Baby Shower”, “MI BABY SHOWER”, thank-you lines, or any other existing phrase.",
    "4. Do NOT redesign the layout. Do NOT invent new illustrations, banners, lines, or ornaments.",
    "5. ONLY add the event details listed below into EMPTY blank areas / empty lines / clear white space meant for personalization.",
    "6. New text must use fonts, weight, size and colors similar to nearby existing typography on this same card.",
    "7. Copy the provided strings character-by-character. Correct Spanish spelling. No typos.",
    "8. If a field is missing, skip it. If space is tight, stack the new lines neatly without covering existing text or the illustration.",
    "9. Prefer placing new details in the blank middle/lower text region, never on top of the mascot art.",
    "",
    "Event details to add:",
    ...(details.length > 0 ? details : ["- (no details provided; leave blanks empty)"]),
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
    form.append("quality", "high");
    form.append("input_fidelity", "high");
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
      console.error("OpenAI invitation edit failed", response.status, detail.slice(0, 500));

      // Retry without input_fidelity if the model/API rejects it.
      if (detail.toLowerCase().includes("input_fidelity")) {
        return generateWithoutFidelity(input, png, apiKey);
      }
      return null;
    }

    return uploadInvitationPng(input.eventId, await readImageBytes(response));
  } catch (error) {
    console.error("generateAndStoreInvitation", error);
    return null;
  }
}

async function generateWithoutFidelity(
  input: InvitationGenerateInput,
  png: Buffer,
  apiKey: string
) {
  const form = new FormData();
  form.append("model", OPENAI_MODEL);
  form.append("prompt", buildPrompt(input));
  form.append("size", "1536x1024");
  form.append("quality", "high");
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
    console.error("OpenAI invitation retry failed", response.status, detail.slice(0, 400));
    return null;
  }

  return uploadInvitationPng(input.eventId, await readImageBytes(response));
}

async function readImageBytes(response: Response) {
  const payload = (await response.json()) as {
    data?: Array<{ b64_json?: string; url?: string }>;
  };
  const b64 = payload.data?.[0]?.b64_json;
  if (b64) return Buffer.from(b64, "base64");
  if (payload.data?.[0]?.url) {
    const imageRes = await fetch(payload.data[0].url);
    if (imageRes.ok) return Buffer.from(await imageRes.arrayBuffer());
  }
  return null;
}

async function uploadInvitationPng(eventId: string, bytes: Buffer | null) {
  if (!bytes) return null;

  const admin = createAdminClient();
  const objectPath = `${eventId}/${Date.now()}.png`;
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
}
