"use server";

import { revalidatePath } from "next/cache";
import { createAdminClient } from "@/lib/supabase/admin";
import { isAlreadyHaveGift } from "@/lib/gift-status";
import { isClothingPickerGift } from "@/lib/clothing";

const MAX_NAME_LEN = 120;
const MAX_NOTE_LEN = 200;

export type ClaimResult = { ok: boolean; message: string };
export type RsvpResult = { ok: boolean; message: string };

async function loadGiftForClaim(slug: string, giftId: string) {
  const supabase = createAdminClient();
  const withFlag = await supabase
    .from("baby_gifts")
    .select("id, name, max_quantity, notes, already_have, baby_events!inner(slug)")
    .eq("id", giftId)
    .eq("baby_events.slug", slug)
    .maybeSingle();

  if (!withFlag.error) return withFlag.data;

  const fallback = await supabase
    .from("baby_gifts")
    .select("id, name, max_quantity, notes, baby_events!inner(slug)")
    .eq("id", giftId)
    .eq("baby_events.slug", slug)
    .maybeSingle();

  return fallback.data ? { ...fallback.data, already_have: false } : null;
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

/**
 * Confirma asistencia y, si va, reserva los regalos que eligió (podía marcar/desmarcar libremente).
 */
export async function confirmGuestChoices(
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
  const selectedRaw = String(formData.get("selected_gift_ids") ?? "");
  const clothingRaw = String(formData.get("clothing_choices") ?? "");

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

  const { error: rsvpError } = await supabase.from("baby_rsvps").upsert(
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

  if (rsvpError) {
    return { ok: false, message: "No se pudo guardar tu confirmación, probá de nuevo." };
  }

  const broughtLabels: string[] = [];

  if (attending) {
    const giftIds = selectedRaw
      .split(",")
      .map((id) => id.trim())
      .filter(Boolean)
      .slice(0, 30);

    for (const giftId of giftIds) {
      const gift = await loadGiftForClaim(slug, giftId);
      if (!gift || isAlreadyHaveGift(gift) || isClothingPickerGift(gift)) continue;

      if (gift.max_quantity) {
        const { count } = await supabase
          .from("baby_claims")
          .select("id", { count: "exact", head: true })
          .eq("gift_id", giftId);
        if ((count ?? 0) >= gift.max_quantity) continue;
        await supabase.from("baby_claims").insert({ gift_id: giftId });
        broughtLabels.push(gift.name);
        continue;
      }

      const { data: existingClaim } = await supabase
        .from("baby_claims")
        .select("id")
        .eq("gift_id", giftId)
        .maybeSingle();
      if (existingClaim) continue;

      await supabase.from("baby_claims").insert({ gift_id: giftId });
      broughtLabels.push(gift.name);
    }

    let clothingChoices: string[] = [];
    try {
      const parsed = JSON.parse(clothingRaw || "[]");
      if (Array.isArray(parsed)) {
        clothingChoices = parsed
          .map((item) => String(item ?? "").trim())
          .filter(Boolean)
          .slice(0, 10);
      }
    } catch {
      clothingChoices = [];
    }

    for (const label of clothingChoices) {
      const { data: inserted } = await supabase
        .from("baby_gifts")
        .insert({
          event_id: event.id,
          name: label.slice(0, MAX_NAME_LEN),
          category: "Ropa",
          notes: null,
          is_custom: true,
          max_quantity: null,
        })
        .select("id")
        .single();
      if (inserted?.id) {
        await supabase.from("baby_claims").insert({ gift_id: inserted.id });
        broughtLabels.push(label);
      }
    }
  }

  revalidatePath(`/e/${slug}`);

  if (!attending) {
    return { ok: true, message: "Gracias por avisar, ¡te vamos a extrañar!" };
  }

  if (broughtLabels.length === 0) {
    return {
      ok: true,
      message: "¡Gracias por confirmar que vas! Te esperamos.",
    };
  }

  return {
    ok: true,
    message: `Confirmaste que vas. Regalos anotados: ${broughtLabels.join("; ")}.`,
  };
}

/** Compat: el formulario nuevo usa confirmGuestChoices. */
export async function submitRsvp(slug: string, formData: FormData): Promise<RsvpResult> {
  return confirmGuestChoices(slug, formData);
}
