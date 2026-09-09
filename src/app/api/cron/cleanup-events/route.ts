import { NextResponse } from "next/server";
import { createAdminClient } from "@/lib/supabase/admin";
import { deleteEventInvitationFiles } from "@/lib/invitation-upload";

export const dynamic = "force-dynamic";
export const maxDuration = 60;

/** Días después del evento para borrar la lista y liberar espacio. */
const RETENTION_DAYS = 7;

function isAuthorized(request: Request) {
  const secret = process.env.CRON_SECRET?.trim();
  if (secret) {
    return request.headers.get("authorization") === `Bearer ${secret}`;
  }
  // En Vercel Cron llega este header cuando no hay CRON_SECRET.
  return request.headers.get("x-vercel-cron") === "1";
}

/**
 * Borra eventos cuyo día ya pasó hace RETENTION_DAYS (cascada: regalos,
 * reservas, RSVPs, miembros) y limpia imágenes de Storage.
 */
export async function GET(request: Request) {
  if (!isAuthorized(request)) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const cutoff = new Date();
  cutoff.setUTCHours(0, 0, 0, 0);
  cutoff.setUTCDate(cutoff.getUTCDate() - RETENTION_DAYS);
  const cutoffIso = cutoff.toISOString().slice(0, 10);

  const admin = createAdminClient();
  const { data: expired, error } = await admin
    .from("baby_events")
    .select("id, slug, event_date")
    .not("event_date", "is", null)
    .lt("event_date", cutoffIso);

  if (error) {
    console.error("cleanup-events list", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  const events = expired ?? [];
  let deleted = 0;
  const failures: string[] = [];

  for (const event of events) {
    try {
      await deleteEventInvitationFiles(event.id);
      const { error: deleteError } = await admin
        .from("baby_events")
        .delete()
        .eq("id", event.id);
      if (deleteError) {
        failures.push(`${event.id}: ${deleteError.message}`);
        continue;
      }
      deleted += 1;
    } catch (err) {
      failures.push(`${event.id}: ${err instanceof Error ? err.message : "error"}`);
    }
  }

  return NextResponse.json({
    ok: true,
    retentionDays: RETENTION_DAYS,
    cutoff: cutoffIso,
    found: events.length,
    deleted,
    failures,
  });
}
