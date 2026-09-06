"use server";

import { revalidatePath } from "next/cache";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { generateSlug } from "@/lib/slug";
import { DEFAULT_GIFTS } from "@/lib/default-gifts";
import {
  listAccessibleEvents,
  requireEventAccess,
  requireEventOwner,
} from "@/lib/event-access";
import {
  INVITATION_TEMPLATE_PREFIX,
  getInvitationTemplate,
} from "@/lib/invitation";

const MAX_TEXT = 200;
const MAX_MESSAGE = 500;

function clean(value: FormDataEntryValue | null, maxLen: number) {
  const text = String(value ?? "").trim();
  if (!text) return null;
  return text.slice(0, maxLen);
}

function invitationFromForm(formData: FormData) {
  const template = String(formData.get("invitation_template") ?? "").trim();
  if (template === "custom") {
    return clean(formData.get("invitation_image_url"), 500);
  }
  if (getInvitationTemplate(template)) {
    return `${INVITATION_TEMPLATE_PREFIX}${template}`;
  }
  return null;
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
  const invitation_image_url = invitationFromForm(formData);

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
      invitation_image_url,
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

export async function deleteEvent(eventId: string, formData: FormData) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) redirect("/login");

  await requireEventOwner(user, eventId);

  const confirm = String(formData.get("confirm") ?? "")
    .trim()
    .toUpperCase();
  if (confirm !== "ELIMINAR") return;

  const { error } = await supabase
    .from("baby_events")
    .delete()
    .eq("id", eventId)
    .eq("user_id", user.id);

  if (error) {
    throw new Error(error.message);
  }

  (await cookies()).delete("bw_event");
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
  const invitation_image_url = invitationFromForm(formData);
  const ask_party_size = formData.get("ask_party_size") === "on";
  const guest_list_reveal_days = Math.min(
    Math.max(Number(formData.get("guest_list_reveal_days") ?? 14) || 14, 0),
    365
  );

  await requireEventAccess(user, eventId);

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
    .eq("id", eventId);

  const { data: updated } = await supabase
    .from("baby_events")
    .select("slug")
    .eq("id", eventId)
    .maybeSingle();

  revalidatePath("/dashboard");
  revalidatePath("/dashboard/perfil");
  if (updated?.slug) revalidatePath(`/e/${updated.slug}`);
}

export async function resetDefaultGifts(eventId: string) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) redirect("/login");

  await requireEventAccess(user, eventId);

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

  await requireEventAccess(user, eventId);

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

export async function selectDashboardEvent(eventId: string) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) redirect("/login");

  await requireEventAccess(user, eventId);
  (await cookies()).set("bw_event", eventId, {
    path: "/",
    maxAge: 60 * 60 * 24 * 180,
  });
  revalidatePath("/dashboard");
}

export async function inviteOrganizer(eventId: string, formData: FormData) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) redirect("/login");

  await requireEventOwner(user, eventId);

  const email = String(formData.get("email") ?? "")
    .trim()
    .toLowerCase();
  if (!email || !email.includes("@") || email.length > 120) return;
  if (email === (user.email ?? "").toLowerCase()) return;

  const { error } = await supabase.from("baby_event_members").insert({
    event_id: eventId,
    email,
  });
  if (error && !error.message.toLowerCase().includes("duplicate")) {
    throw new Error(error.message);
  }

  revalidatePath("/dashboard/equipo");
}

export async function removeOrganizer(memberId: string) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) redirect("/login");

  const events = await listAccessibleEvents(user);
  const ownedIds = events.filter((event) => event.role === "owner").map((event) => event.id);
  if (ownedIds.length === 0) throw new Error("No autorizado");

  await supabase
    .from("baby_event_members")
    .delete()
    .eq("id", memberId)
    .in("event_id", ownedIds);

  revalidatePath("/dashboard/equipo");
}
