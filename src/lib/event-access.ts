import "server-only";

import { cookies } from "next/headers";
import type { User } from "@supabase/supabase-js";
import { createClient } from "@/lib/supabase/server";
import { createAdminClient } from "@/lib/supabase/admin";
import type { EventRow } from "@/lib/types";

const EVENT_COOKIE = "bw_event";

export type EventRole = "owner" | "organizer";

export type AccessibleEvent = EventRow & { role: EventRole };

function userEmail(user: User) {
  return (user.email ?? "").trim().toLowerCase();
}

export async function linkOrganizerInvites(user: User) {
  const email = userEmail(user);
  if (!email) return;

  const admin = createAdminClient();
  await admin
    .from("baby_event_members")
    .update({ user_id: user.id })
    .eq("email", email)
    .is("user_id", null);
}

export async function listAccessibleEvents(user: User): Promise<AccessibleEvent[]> {
  await linkOrganizerInvites(user);

  const supabase = await createClient();
  const email = userEmail(user);
  const byId = new Map<string, AccessibleEvent>();

  const { data: owned } = await supabase
    .from("baby_events")
    .select("*")
    .eq("user_id", user.id);
  for (const event of owned ?? []) {
    byId.set(event.id, { ...(event as EventRow), role: "owner" });
  }

  const { data: memberships } = await supabase
    .from("baby_event_members")
    .select("event_id")
    .or(`user_id.eq.${user.id},email.eq.${email}`);

  const memberIds = [...new Set((memberships ?? []).map((row) => row.event_id))].filter(
    (id) => !byId.has(id)
  );

  if (memberIds.length > 0) {
    const { data: shared } = await supabase
      .from("baby_events")
      .select("*")
      .in("id", memberIds);
    for (const event of shared ?? []) {
      byId.set(event.id, { ...(event as EventRow), role: "organizer" });
    }
  }

  return [...byId.values()].sort((a, b) => a.created_at.localeCompare(b.created_at));
}

export async function getAccessibleEvent(
  user: User,
  eventId?: string | null
): Promise<AccessibleEvent | null> {
  const events = await listAccessibleEvents(user);
  if (events.length === 0) return null;
  const cookieId = eventId ?? (await cookies()).get(EVENT_COOKIE)?.value;
  if (cookieId) {
    const match = events.find((event) => event.id === cookieId);
    if (match) return match;
  }
  return events.find((event) => event.role === "owner") ?? events[0];
}

export async function requireEventAccess(user: User, eventId: string) {
  const event = await getAccessibleEvent(user, eventId);
  if (!event || event.id !== eventId) {
    throw new Error("No autorizado");
  }
  return event;
}

export async function requireEventOwner(user: User, eventId: string) {
  const event = await requireEventAccess(user, eventId);
  if (event.role !== "owner") {
    throw new Error("Solo quien creó la lista puede hacer esto");
  }
  return event;
}
