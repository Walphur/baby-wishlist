"use server";

import { revalidatePath } from "next/cache";
import { createAdminClient } from "@/lib/supabase/admin";

const MAX_NAME_LEN = 120;
const MAX_NOTE_LEN = 200;

export type ClaimResult = { ok: boolean; message: string };

// Regalos sin max_quantity: solo una persona puede llevarlo (checkbox).
export async function toggleClaim(slug: string, giftId: string): Promise<ClaimResult> {
  if (!giftId) return { ok: false, message: "Regalo inválido." };
  const supabase = createAdminClient();

  // Defensa en profundidad: el regalo tiene que pertenecer al evento del slug.
  const { data: gift } = await supabase
    .from("baby_gifts")
    .select("id, name, max_quantity, baby_events!inner(slug)")
    .eq("id", giftId)
    .eq("baby_events.slug", slug)
    .maybeSingle();

  if (!gift) return { ok: false, message: "No encontramos ese regalo." };

  const { data: existingClaim } = await supabase
    .from("baby_claims")
    .select("id")
    .eq("gift_id", giftId)
    .maybeSingle();

  let message: string;
  if (existingClaim) {
    await supabase.from("baby_claims").delete().eq("id", existingClaim.id);
    message = `Listo, ya no vas a llevar "${gift.name}".`;
  } else {
    await supabase.from("baby_claims").insert({ gift_id: giftId });
    message = `¡Genial! Anotamos que vas a llevar: ${gift.name}`;
  }

  revalidatePath(`/e/${slug}`);
  return { ok: true, message };
}

// Regalos con max_quantity (pañales, ropa, etc.): varias personas pueden sumarse.
export async function addClaim(slug: string, giftId: string): Promise<ClaimResult> {
  if (!giftId) return { ok: false, message: "Regalo inválido." };
  const supabase = createAdminClient();

  const { data: gift } = await supabase
    .from("baby_gifts")
    .select("id, name, max_quantity, baby_events!inner(slug)")
    .eq("id", giftId)
    .eq("baby_events.slug", slug)
    .maybeSingle();

  if (!gift) return { ok: false, message: "No encontramos ese regalo." };

  const { count } = await supabase
    .from("baby_claims")
    .select("id", { count: "exact", head: true })
    .eq("gift_id", giftId);

  if (gift.max_quantity && (count ?? 0) >= gift.max_quantity) {
    return { ok: false, message: "Ya se completó la cantidad para este regalo, ¡gracias!" };
  }

  await supabase.from("baby_claims").insert({ gift_id: giftId });
  revalidatePath(`/e/${slug}`);
  return { ok: true, message: `¡Genial! Sumaste que vas a llevar: ${gift.name}` };
}

export async function removeClaim(slug: string, giftId: string): Promise<ClaimResult> {
  if (!giftId) return { ok: false, message: "Regalo inválido." };
  const supabase = createAdminClient();

  const { data: gift } = await supabase
    .from("baby_gifts")
    .select("id, name, baby_events!inner(slug)")
    .eq("id", giftId)
    .eq("baby_events.slug", slug)
    .maybeSingle();

  if (!gift) return { ok: false, message: "No encontramos ese regalo." };

  const { data: existingClaim } = await supabase
    .from("baby_claims")
    .select("id")
    .eq("gift_id", giftId)
    .limit(1)
    .maybeSingle();

  if (!existingClaim) {
    return { ok: false, message: "No hay reservas para quitar en este regalo." };
  }

  await supabase.from("baby_claims").delete().eq("id", existingClaim.id);
  revalidatePath(`/e/${slug}`);
  return { ok: true, message: `Listo, sacamos un aporte de "${gift.name}".` };
}

export async function addGuestGift(slug: string, formData: FormData) {
  const name = String(formData.get("name") ?? "").trim().slice(0, MAX_NAME_LEN);
  const notes =
    String(formData.get("notes") ?? "").trim().slice(0, MAX_NOTE_LEN) || null;
  if (!name) return;

  const supabase = createAdminClient();
  const { data: event } = await supabase
    .from("baby_events")
    .select("id")
    .eq("slug", slug)
    .maybeSingle();
  if (!event) return;

  await supabase
    .from("baby_gifts")
    .insert({ event_id: event.id, name, notes, category: "Agregado por invitados", is_custom: true });

  revalidatePath(`/e/${slug}`);
}

export type RsvpResult = { ok: boolean; message: string };

export async function submitRsvp(
  slug: string,
  formData: FormData
): Promise<RsvpResult> {
  const guest_name = String(formData.get("guest_name") ?? "").trim().slice(0, MAX_NAME_LEN);
  const attendingValue = String(formData.get("attending") ?? "yes");
  const attending = attendingValue === "yes";
  const partySizeRaw = Number(formData.get("party_size") ?? 1);
  const party_size = attending
    ? Math.min(Math.max(Math.round(partySizeRaw) || 1, 1), 20)
    : 0;
  const note = String(formData.get("note") ?? "").trim().slice(0, MAX_NOTE_LEN) || null;

  if (!guest_name) {
    return { ok: false, message: "Contanos tu nombre para confirmar." };
  }

  const supabase = createAdminClient();
  const { data: event } = await supabase
    .from("baby_events")
    .select("id")
    .eq("slug", slug)
    .maybeSingle();
  if (!event) {
    return { ok: false, message: "No encontramos este evento." };
  }

  const { error } = await supabase.from("baby_rsvps").upsert(
    {
      event_id: event.id,
      guest_name,
      attending,
      party_size,
      note,
      updated_at: new Date().toISOString(),
    },
    { onConflict: "event_id,guest_name" }
  );

  if (error) {
    return { ok: false, message: "No se pudo guardar tu confirmación, probá de nuevo." };
  }

  revalidatePath(`/e/${slug}`);
  return {
    ok: true,
    message: attending
      ? "¡Gracias por confirmar! Te esperamos."
      : "Gracias por avisar, ¡te vamos a extrañar!",
  };
}
