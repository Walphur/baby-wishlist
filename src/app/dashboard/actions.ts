"use server";

import { revalidatePath } from "next/cache";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { createAdminClient } from "@/lib/supabase/admin";
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
import { generateAndStoreInvitation } from "@/lib/openai-invitation";
import { isAdminEmail } from "@/lib/admin";

const MAX_TEXT = 200;
const MAX_MESSAGE = 500;

function clean(value: FormDataEntryValue | null, maxLen: number) {
  const text = String(value ?? "").trim();
  if (!text) return null;
  return text.slice(0, maxLen);
}

function cleanTime(value: FormDataEntryValue | null) {
  const text = String(value ?? "").trim();
  const match = text.match(/^(\d{1,2}):(\d{2})/);
  if (!match) return null;
  return `${match[1].padStart(2, "0")}:${match[2]}:00`;
}

function templateFromForm(formData: FormData) {
  const template = String(formData.get("invitation_template") ?? "").trim();
  if (template === "custom") return "custom" as const;
  if (getInvitationTemplate(template)) return template;
  return null;
}

async function resolveInvitationFields(
  formData: FormData,
  eventId: string,
  fields: {
    baby_name: string | null;
    event_date: string | null;
    event_time: string | null;
    location: string | null;
  },
  previous?: {
    baby_name: string | null;
    event_date: string | null;
    event_time: string | null;
    location: string | null;
    invitation_template_id: string | null;
    invitation_image_url: string | null;
  } | null
) {
  const templateChoice = templateFromForm(formData);

  if (templateChoice === "custom") {
    return {
      invitation_template_id: null as string | null,
      invitation_image_url: clean(formData.get("invitation_image_url"), 500),
    };
  }

  if (!templateChoice) {
    return {
      invitation_template_id: null as string | null,
      invitation_image_url: null as string | null,
    };
  }

  const forceRegenerate = formData.get("regenerate_invitation") === "on";

  const sameInvitePayload =
    !forceRegenerate &&
    previous &&
    previous.invitation_template_id === templateChoice &&
    (previous.baby_name ?? null) === fields.baby_name &&
    (previous.event_date ?? null) === fields.event_date &&
    normalizeTimeValue(previous.event_time) === normalizeTimeValue(fields.event_time) &&
    (previous.location ?? null) === fields.location &&
    Boolean(previous.invitation_image_url);

  if (sameInvitePayload) {
    return {
      invitation_template_id: templateChoice,
      invitation_image_url: previous.invitation_image_url,
    };
  }

  const generated = await generateAndStoreInvitation({
    eventId,
    templateId: templateChoice,
    babyName: fields.baby_name,
    eventDate: fields.event_date,
    eventTime: fields.event_time,
    location: fields.location,
  });

  return {
    invitation_template_id: templateChoice,
    invitation_image_url:
      generated ?? `${INVITATION_TEMPLATE_PREFIX}${templateChoice}`,
  };
}

function normalizeTimeValue(value: string | null | undefined) {
  if (!value) return null;
  const match = String(value).match(/^(\d{1,2}):(\d{2})/);
  if (!match) return null;
  return `${match[1].padStart(2, "0")}:${match[2]}:00`;
}

export async function createEvent(formData: FormData) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) redirect("/login");

  const baby_name = clean(formData.get("baby_name"), 100);
  const event_date = clean(formData.get("event_date"), 20);
  const event_time = cleanTime(formData.get("event_time"));
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
      event_time,
      location,
      host_names,
      message,
    })
    .select("id")
    .single();

  if (error || !event) {
    throw new Error(error?.message ?? "No se pudo crear el evento");
  }

  const invitation = await resolveInvitationFields(formData, event.id, {
    baby_name,
    event_date,
    event_time,
    location,
  });

  await supabase
    .from("baby_events")
    .update({
      invitation_image_url: invitation.invitation_image_url,
      invitation_template_id: invitation.invitation_template_id,
      updated_at: new Date().toISOString(),
    })
    .eq("id", event.id);

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
  const event_time = cleanTime(formData.get("event_time"));
  const location = clean(formData.get("location"), MAX_TEXT);
  const host_names = clean(formData.get("host_names"), MAX_TEXT);
  const message = clean(formData.get("message"), MAX_MESSAGE);
  const location_map_url = clean(formData.get("location_map_url"), 500);
  const drive_url = clean(formData.get("drive_url"), 500);
  const ask_party_size = formData.get("ask_party_size") === "on";
  const guest_list_reveal_days = Math.min(
    Math.max(Number(formData.get("guest_list_reveal_days") ?? 14) || 14, 0),
    365
  );

  await requireEventAccess(user, eventId);

  const { data: previous } = await supabase
    .from("baby_events")
    .select(
      "baby_name, event_date, event_time, location, invitation_template_id, invitation_image_url, slug"
    )
    .eq("id", eventId)
    .maybeSingle();

  const invitation = await resolveInvitationFields(
    formData,
    eventId,
    {
      baby_name,
      event_date,
      event_time,
      location,
    },
    previous
  );

  await supabase
    .from("baby_events")
    .update({
      baby_name,
      event_date,
      event_time,
      location,
      host_names,
      message,
      location_map_url,
      drive_url,
      invitation_image_url: invitation.invitation_image_url,
      invitation_template_id: invitation.invitation_template_id,
      ask_party_size,
      guest_list_reveal_days,
      updated_at: new Date().toISOString(),
    })
    .eq("id", eventId);

  revalidatePath("/dashboard");
  revalidatePath("/dashboard/perfil");
  if (previous?.slug) revalidatePath(`/e/${previous.slug}`);
  redirect("/dashboard/perfil?saved=1");
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

/** Liberar reservas de un regalo (solo organizador / admin). */
export async function clearGiftClaims(giftId: string) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) redirect("/login");

  const { data: gift } = await supabase
    .from("baby_gifts")
    .select("id, event_id")
    .eq("id", giftId)
    .maybeSingle();
  if (!gift) return;

  const isAdmin = isAdminEmail(user.email);
  if (!isAdmin) {
    await requireEventAccess(user, gift.event_id);
  }

  const admin = createAdminClient();
  await admin.from("baby_claims").delete().eq("gift_id", giftId);

  revalidatePath("/dashboard/regalos");
  const { data: event } = await admin
    .from("baby_events")
    .select("slug")
    .eq("id", gift.event_id)
    .maybeSingle();
  if (event?.slug) revalidatePath(`/e/${event.slug}`);
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
