import "server-only";

import { createAdminClient } from "@/lib/supabase/admin";
import {
  INVITATION_UPLOAD_ACCEPT,
  MAX_INVITATION_UPLOAD_BYTES,
  MAX_INVITATION_UPLOAD_MB,
} from "@/lib/invitation";

const ALLOWED_TYPES = new Set(
  INVITATION_UPLOAD_ACCEPT.split(",").map((t) => t.trim())
);

export type InvitationUploadResult =
  | { ok: true; url: string }
  | { ok: false; error: string };

export async function uploadUserInvitationImage(
  eventId: string,
  file: File
): Promise<InvitationUploadResult> {
  if (!file || file.size <= 0) {
    return { ok: false, error: "Elegí una imagen para subir." };
  }
  if (file.size > MAX_INVITATION_UPLOAD_BYTES) {
    return {
      ok: false,
      error: `La imagen pesa demasiado. Máximo ${MAX_INVITATION_UPLOAD_MB} MB.`,
    };
  }
  if (!ALLOWED_TYPES.has(file.type)) {
    return {
      ok: false,
      error: "Formato no válido. Usá JPG, PNG o WebP.",
    };
  }

  const ext =
    file.type === "image/png"
      ? "png"
      : file.type === "image/webp"
        ? "webp"
        : "jpg";

  const bytes = Buffer.from(await file.arrayBuffer());
  const objectPath = `${eventId}/custom-${Date.now()}.${ext}`;
  const admin = createAdminClient();

  const { error: uploadError } = await admin.storage
    .from("invitations")
    .upload(objectPath, bytes, {
      contentType: file.type,
      upsert: true,
    });

  if (uploadError) {
    console.error("uploadUserInvitationImage", uploadError.message);
    return { ok: false, error: "No se pudo subir la imagen. Probá de nuevo." };
  }

  const { data } = admin.storage.from("invitations").getPublicUrl(objectPath);
  if (!data.publicUrl) {
    return { ok: false, error: "No se pudo obtener el link de la imagen." };
  }

  return { ok: true, url: data.publicUrl };
}

export async function deleteEventInvitationFiles(eventId: string) {
  const admin = createAdminClient();
  const { data: listed } = await admin.storage.from("invitations").list(eventId);
  if (!listed?.length) return;
  const paths = listed.map((item) => `${eventId}/${item.name}`);
  await admin.storage.from("invitations").remove(paths);
}
