import { notFound } from "next/navigation";
import { createAdminClient } from "@/lib/supabase/admin";
import DisclaimerBanner from "@/components/DisclaimerBanner";
import PublicGiftList from "@/components/PublicGiftList";
import RsvpForm from "@/components/RsvpForm";
import DecorativeBlobs from "@/components/DecorativeBlobs";
import FloatingBear from "@/components/FloatingBear";
import InvitationCard from "@/components/InvitationCard";
import {
  formatInvitationTime,
  invitationTemplateId,
  isGeneratedInvitationUrl,
} from "@/lib/invitation";

export const dynamic = "force-dynamic";

export default async function EventPage({
  params,
}: {
  params: { slug: string };
}) {
  const supabase = createAdminClient();

  const { data: event } = await supabase
    .from("baby_events")
    .select(
      "id, baby_name, event_date, event_time, location, host_names, message, ask_party_size, location_map_url, drive_url, invitation_image_url, invitation_template_id"
    )
    .eq("slug", params.slug)
    .maybeSingle();

  if (!event) notFound();

  const { data: gifts } = await supabase
    .from("baby_gifts")
    .select("id, event_id, name, category, notes, is_custom, max_quantity, created_at")
    .eq("event_id", event.id)
    .order("category");

  const giftIds = (gifts ?? []).map((g) => g.id);
  const { data: claims } =
    giftIds.length > 0
      ? await supabase.from("baby_claims").select("gift_id").in("gift_id", giftIds)
      : { data: [] };
  const claimCounts = new Map<string, number>();
  for (const c of claims ?? []) {
    claimCounts.set(c.gift_id, (claimCounts.get(c.gift_id) ?? 0) + 1);
  }

  const giftsWithClaim = (gifts ?? []).map((g) => ({
    ...g,
    claimed: (claimCounts.get(g.id) ?? 0) > 0,
    claimedCount: claimCounts.get(g.id) ?? 0,
  }));

  const templateId = invitationTemplateId(
    event.invitation_image_url,
    event.invitation_template_id
  );
  const generatedInvitation = isGeneratedInvitationUrl(event.invitation_image_url);

  const formattedDate = event.event_date
    ? new Date(event.event_date + "T00:00:00").toLocaleDateString("es-AR", {
        weekday: "long",
        day: "numeric",
        month: "long",
        year: "numeric",
      })
    : null;
  const prettyDate = formattedDate
    ? formattedDate.charAt(0).toUpperCase() + formattedDate.slice(1)
    : null;
  const formattedTime = formatInvitationTime(event.event_time);

  return (
    <main className="mx-auto max-w-2xl px-6 py-14">
      <DecorativeBlobs />
      <div className="relative isolate text-center">
        <FloatingBear
          variant="bear"
          motion="float"
          className="absolute left-0 top-2 z-0 h-20 w-20 opacity-80 sm:left-2 sm:h-24 sm:w-24"
        />
        <FloatingBear
          variant="fox"
          motion="float-delay"
          className="absolute right-0 top-4 z-0 h-24 w-24 opacity-80 sm:right-2 sm:h-28 sm:w-28"
        />

        <div className="relative z-10">
          <span className="text-xs font-medium uppercase tracking-[0.22em] text-sage-600">
            Baby Shower
          </span>
          <h1 className="mt-3 font-serif text-3xl leading-tight text-ink-900 sm:text-4xl">
            {event.baby_name
              ? `¡Vamos a recibir a ${event.baby_name}!`
              : "¡Estamos por ser familia!"}
          </h1>

          <div className="mx-auto mt-6 max-w-md rounded-[1.4rem] border border-sage-200/70 bg-gradient-to-b from-cream-50/95 via-white/80 to-sage-50/70 px-5 py-5 shadow-[0_12px_40px_-24px_rgba(70,90,60,0.45)] backdrop-blur-sm">
            {prettyDate ? (
              <p className="font-serif text-xl leading-snug text-ink-900 sm:text-2xl">
                {prettyDate}
              </p>
            ) : null}
            {formattedTime ? (
              <p className="mt-2 text-sm font-semibold tracking-[0.14em] text-sage-700 uppercase">
                {formattedTime}
              </p>
            ) : null}
            {event.location ? (
              <p className="mt-3 border-t border-sage-200/80 pt-3 font-serif text-base text-ink-800">
                {event.location}
              </p>
            ) : null}
            {event.host_names ? (
              <p className="mt-3 text-sm text-ink-700">
                Con mucho cariño,{" "}
                <span className="font-medium text-ink-900">{event.host_names}</span>
              </p>
            ) : null}
            {event.message ? (
              <p className="mt-3 text-sm italic leading-relaxed text-ink-800">
                “{event.message}”
              </p>
            ) : null}
          </div>

          {(event.location_map_url || event.drive_url) && (
            <div className="mt-5 flex flex-wrap items-center justify-center gap-3">
              {event.location_map_url && (
                <a
                  href={event.location_map_url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="rounded-lg border border-ink-900/15 bg-white/70 px-4 py-2 text-xs font-medium text-ink-800 transition hover:bg-white sm:text-sm"
                >
                  Ver ubicación en el mapa
                </a>
              )}
              {event.drive_url && (
                <a
                  href={event.drive_url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="rounded-lg border border-ink-900/15 bg-white/70 px-4 py-2 text-xs font-medium text-ink-800 transition hover:bg-white sm:text-sm"
                >
                  Ver / subir fotos
                </a>
              )}
            </div>
          )}
        </div>
      </div>

      <div className="mt-10 space-y-8">
        {generatedInvitation && event.invitation_image_url && (
          <img
            src={event.invitation_image_url}
            alt="Invitación"
            className="mx-auto w-full max-w-2xl rounded-xl2 border border-ink-900/10 object-cover shadow-sm"
          />
        )}
        {!generatedInvitation && templateId && (
          <InvitationCard
            templateId={templateId}
            babyName={event.baby_name}
            eventDate={event.event_date}
            eventTime={event.event_time}
            location={event.location}
            className="mx-auto max-w-2xl border border-ink-900/10"
          />
        )}
        {!generatedInvitation && !templateId && event.invitation_image_url && (
          <img
            src={event.invitation_image_url}
            alt="Invitación"
            className="mx-auto w-full max-w-2xl rounded-xl2 border border-ink-900/10 object-cover shadow-sm"
          />
        )}
        <RsvpForm slug={params.slug} askPartySize={event.ask_party_size} />
        <DisclaimerBanner />
        <PublicGiftList slug={params.slug} gifts={giftsWithClaim} />
      </div>
    </main>
  );
}
