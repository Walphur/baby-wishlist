import { notFound } from "next/navigation";
import { createAdminClient } from "@/lib/supabase/admin";
import DisclaimerBanner from "@/components/DisclaimerBanner";
import PublicGiftList from "@/components/PublicGiftList";
import RsvpForm from "@/components/RsvpForm";

export const dynamic = "force-dynamic";

export default async function EventPage({
  params,
}: {
  params: { slug: string };
}) {
  const supabase = createAdminClient();

  const { data: event } = await supabase
    .from("baby_events")
    .select("id, baby_name, event_date, location, host_names, message")
    .eq("slug", params.slug)
    .maybeSingle();

  if (!event) notFound();

  const { data: gifts } = await supabase
    .from("baby_gifts")
    .select("id, event_id, name, category, notes, is_custom, created_at")
    .eq("event_id", event.id)
    .order("category");

  const giftIds = (gifts ?? []).map((g) => g.id);
  const { data: claims } =
    giftIds.length > 0
      ? await supabase.from("baby_claims").select("gift_id").in("gift_id", giftIds)
      : { data: [] };
  const claimedIds = new Set((claims ?? []).map((c) => c.gift_id));

  const giftsWithClaim = (gifts ?? []).map((g) => ({
    ...g,
    claimed: claimedIds.has(g.id),
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
      <div className="text-center">
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
      </div>

      <div className="mt-10 space-y-8">
        <RsvpForm slug={params.slug} />
        <DisclaimerBanner />
        <PublicGiftList slug={params.slug} gifts={giftsWithClaim} />
      </div>
    </main>
  );
}
