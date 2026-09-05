"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { generateSlug } from "@/lib/slug";
import { DEFAULT_GIFTS } from "@/lib/default-gifts";

const MAX_TEXT = 200;
const MAX_MESSAGE = 500;

function clean(value: FormDataEntryValue | null, maxLen: number) {
  const text = String(value ?? "").trim();
  if (!text) return null;
  return text.slice(0, maxLen);
}

export async function createEvent(formData: FormData) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) redirect("/login");

  const baby_name = clean(formData.get("baby_name"), 100);
  const event_date = clean(formData.get("event_date"), 20);
  const location = clean(formData.get("location"), MAX_TEXT);
  const host_names = clean(formData.get("host_names"), MAX_TEXT);
  const message = clean(formData.get("message"), MAX_MESSAGE);

  let slug = generateSlug();
  for (let i = 0; i < 5; i++) {
    const { data: existing } = await supabase
      .from("baby_events")
      .select("id")
      .eq("slug", slug)
      .maybeSingle();
    if (!existing) break;
    slug = generateSlug();
  }

  const { data: event, error } = await supabase
    .from("baby_events")
    .insert({
      user_id: user.id,
      slug,
      baby_name,
      event_date,
      location,
      host_names,
      message,
    })
    .select("id")
    .single();

  if (error || !event) {
    throw new Error(error?.message ?? "No se pudo crear el evento");
  }

  const seedGifts = DEFAULT_GIFTS.map((g) => ({
    event_id: event.id,
    name: g.name,
    category: g.category,
    is_custom: false,
    max_quantity: g.maxQuantity ?? null,
  }));
  await supabase.from("baby_gifts").insert(seedGifts);

  revalidatePath("/dashboard");
  redirect("/dashboard");
}

export async function updateEvent(eventId: string, formData: FormData) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) redirect("/login");

  const baby_name = clean(formData.get("baby_name"), 100);
  const event_date = clean(formData.get("event_date"), 20);
  const location = clean(formData.get("location"), MAX_TEXT);
  const host_names = clean(formData.get("host_names"), MAX_TEXT);
  const message = clean(formData.get("message"), MAX_MESSAGE);
  const location_map_url = clean(formData.get("location_map_url"), 500);
  const drive_url = clean(formData.get("drive_url"), 500);
  const invitation_image_url = clean(formData.get("invitation_image_url"), 500);
  const ask_party_size = formData.get("ask_party_size") === "on";
  const guest_list_reveal_days = Math.min(
    Math.max(Number(formData.get("guest_list_reveal_days") ?? 14) || 14, 0),
    365
  );

  await supabase
    .from("baby_events")
    .update({
      baby_name,
      event_date,
      location,
      host_names,
      message,
      location_map_url,
      drive_url,
      invitation_image_url,
      ask_party_size,
      guest_list_reveal_days,
      updated_at: new Date().toISOString(),
    })
    .eq("id", eventId)
    .eq("user_id", user.id);

  revalidatePath("/dashboard");
  revalidatePath("/dashboard/perfil");
}

export async function resetDefaultGifts(eventId: string) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) redirect("/login");

  const { data: event } = await supabase
    .from("baby_events")
    .select("id")
    .eq("id", eventId)
    .eq("user_id", user.id)
    .maybeSingle();
  if (!event) throw new Error("No autorizado");

  await supabase.from("baby_gifts").delete().eq("event_id", eventId).eq("is_custom", false);

  const seedGifts = DEFAULT_GIFTS.map((g) => ({
    event_id: eventId,
    name: g.name,
    category: g.category,
    is_custom: false,
    max_quantity: g.maxQuantity ?? null,
  }));
  await supabase.from("baby_gifts").insert(seedGifts);

  revalidatePath("/dashboard/regalos");
}

export async function addOwnerGift(eventId: string, formData: FormData) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) redirect("/login");

  const name = clean(formData.get("name"), 120);
  const category = clean(formData.get("category"), 60);
  const maxQuantityRaw = Number(formData.get("max_quantity") ?? 0);
  const max_quantity = maxQuantityRaw > 1 ? Math.min(Math.round(maxQuantityRaw), 50) : null;
  if (!name) return;

  await supabase
    .from("baby_gifts")
    .insert({ event_id: eventId, name, category, is_custom: true, max_quantity });

  revalidatePath("/dashboard/regalos");
}

export async function deleteGift(giftId: string) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) redirect("/login");

  await supabase.from("baby_gifts").delete().eq("id", giftId);
  revalidatePath("/dashboard/regalos");
}

export async function deleteRsvp(rsvpId: string) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) redirect("/login");

  await supabase.from("baby_rsvps").delete().eq("id", rsvpId);
  revalidatePath("/dashboard/invitados");
}
