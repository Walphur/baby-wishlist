import { notFound } from "next/navigation";
import { createAdminClient } from "@/lib/supabase/admin";
import DisclaimerBanner from "@/components/DisclaimerBanner";
import PublicGiftList from "@/components/PublicGiftList";
import RsvpForm from "@/components/RsvpForm";
import DecorativeBlobs from "@/components/DecorativeBlobs";
import FloatingBear from "@/components/FloatingBear";

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
      "id, baby_name, event_date, location, host_names, message, ask_party_size, location_map_url, drive_url, invitation_image_url"
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

  const formattedDate = event.event_date
    ? new Date(event.event_date + "T00:00:00").toLocaleDateString("es-AR", {
        day: "numeric",
        month: "long",
        year: "numeric",
      })
    : null;

  return (
    <main className="mx-auto max-w-2xl px-6 py-14">
      <DecorativeBlobs />
      <div className="relative text-center">
        <FloatingBear
          variant="bear"
          motion="float"
          className="absolute left-2 top-0 h-16 w-16 sm:h-20 sm:w-20"
        />
        <FloatingBear
          variant="fox"
          motion="float-delay"
          className="absolute right-2 top-2 h-20 w-20 sm:h-24 sm:w-24"
        />
        <span className="text-xs font-medium uppercase tracking-widest text-sage-600">
          Baby Shower
        </span>
        <h1 className="mt-3 font-serif text-3xl text-ink-900 sm:text-4xl">
          {event.baby_name
            ? `¡Vamos a recibir a ${event.baby_name}!`
            : "¡Estamos por ser familia!"}
        </h1>
        <p className="mt-3 text-sm text-ink-700">
          {[formattedDate, event.location].filter(Boolean).join(" · ")}
        </p>
        {event.host_names && (
          <p className="mt-1 text-sm text-ink-700">
            Con mucho cariño, {event.host_names}
          </p>
        )}
        {event.message && (
          <p className="mx-auto mt-4 max-w-md text-sm italic text-ink-800">
            “{event.message}”
          </p>
        )}
        {(event.location_map_url || event.drive_url) && (
          <div className="mt-4 flex flex-wrap items-center justify-center gap-3">
            {event.location_map_url && (
              <a
                href={event.location_map_url}
                target="_blank"
                rel="noopener noreferrer"
                className="rounded-lg border border-ink-900/15 bg-white/70 px-4 py-2 text-xs font-medium text-ink-800 transition hover:bg-white sm:text-sm"
              >
                📍 Ver ubicación en el mapa
              </a>
            )}
            {event.drive_url && (
              <a
                href={event.drive_url}
                target="_blank"
                rel="noopener noreferrer"
                className="rounded-lg border border-ink-900/15 bg-white/70 px-4 py-2 text-xs font-medium text-ink-800 transition hover:bg-white sm:text-sm"
              >
                📷 Ver / subir fotos
              </a>
            )}
          </div>
        )}
      </div>

      <div className="mt-10 space-y-8">
        {event.invitation_image_url && (
          <img
            src={event.invitation_image_url}
            alt="Invitación"
            className="mx-auto w-full max-w-md rounded-xl2 border border-ink-900/10 object-cover shadow-sm"
          />
        )}
        <RsvpForm slug={params.slug} askPartySize={event.ask_party_size} />
        <DisclaimerBanner />
        <PublicGiftList slug={params.slug} gifts={giftsWithClaim} />
      </div>
    </main>
  );
}
