"use server";

import { revalidatePath } from "next/cache";
import { createAdminClient } from "@/lib/supabase/admin";

const MAX_NAME_LEN = 120;
const MAX_NOTE_LEN = 200;

export async function toggleClaim(slug: string, giftId: string) {
  if (!giftId) return;
  const supabase = createAdminClient();

  // Defensa en profundidad: el regalo tiene que pertenecer al evento del slug.
  const { data: gift } = await supabase
    .from("baby_gifts")
    .select("id, baby_events!inner(slug)")
    .eq("id", giftId)
    .eq("baby_events.slug", slug)
    .maybeSingle();

  if (!gift) return;

  const { data: existingClaim } = await supabase
    .from("baby_claims")
    .select("id")
    .eq("gift_id", giftId)
    .maybeSingle();

  if (existingClaim) {
    await supabase.from("baby_claims").delete().eq("id", existingClaim.id);
  } else {
    await supabase.from("baby_claims").insert({ gift_id: giftId });
  }

  revalidatePath(`/e/${slug}`);
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
