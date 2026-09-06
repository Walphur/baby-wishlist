import { headers } from "next/headers";
import { createClient } from "@/lib/supabase/server";
import { createEvent, selectDashboardEvent } from "./actions";
import { getAccessibleEvent, listAccessibleEvents } from "@/lib/event-access";
import CopyLinkButton from "@/components/CopyLinkButton";
import InvitationCard from "@/components/InvitationCard";
import InvitationSetup from "@/components/InvitationSetup";
import SubmitButton from "@/components/SubmitButton";
import { invitationTemplateId, isGeneratedInvitationUrl, formatInvitationTime } from "@/lib/invitation";
import Link from "next/link";

export const maxDuration = 60;

export default async function DashboardPage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  const accessible = await listAccessibleEvents(user!);
  const event = await getAccessibleEvent(user!);

  if (!event) {
    return (
      <div className="max-w-2xl">
        <h1 className="font-serif text-2xl text-ink-900">
          ¡Bienvenido/a! Contanos sobre tu baby shower
        </h1>
        <p className="mt-2 text-sm text-ink-700">
          Con esto armamos tu página, la invitación y una lista base de regalos
          que después vas a poder editar.
        </p>
        <form action={createEvent} className="mt-6 space-y-4">
          <InvitationSetup />
          <Field
            label="Nombre de los papás / anfitriones"
            name="host_names"
            placeholder="Ej: Juan y Ana"
          />
          <Field
            label="Mensaje para tus invitados (opcional)"
            name="message"
            textarea
            placeholder="Ej: ¡Gracias por acompañarnos en este momento tan especial!"
          />
          <SubmitButton
            idleLabel="Crear mi lista"
            pendingLabel="Generando la imagen… esperá un momento"
            className="rounded-xl2 bg-ink-900 px-6 py-3 text-sm font-medium text-cream-50 transition hover:bg-ink-800 disabled:opacity-60"
          />
        </form>
      </div>
    );
  }

  const selectedTemplate = invitationTemplateId(
    event.invitation_image_url,
    event.invitation_template_id
  );
  const generatedInvitation = isGeneratedInvitationUrl(event.invitation_image_url);

  const host = (await headers()).get("host");
  const protocol = host?.includes("localhost") ? "http" : "https";
  const publicLink = `${protocol}://${host}/e/${event.slug}`;

  const { count: totalGifts } = await supabase
    .from("baby_gifts")
    .select("id", { count: "exact", head: true })
    .eq("event_id", event.id);

  const { data: gifts } = await supabase
    .from("baby_gifts")
    .select("id, name")
    .eq("event_id", event.id);
  const giftIds = (gifts ?? []).map((g) => g.id);
  const { data: claims } =
    giftIds.length > 0
      ? await supabase.from("baby_claims").select("gift_id").in("gift_id", giftIds)
      : { data: [] };
  const claimCounts = new Map<string, number>();
  for (const claim of claims ?? []) {
    claimCounts.set(claim.gift_id, (claimCounts.get(claim.gift_id) ?? 0) + 1);
  }
  const reservedGifts = (gifts ?? [])
    .map((gift) => ({
      id: gift.id,
      name: gift.name,
      count: claimCounts.get(gift.id) ?? 0,
    }))
    .filter((gift) => gift.count > 0);
  const claimedCount = reservedGifts.reduce((sum, gift) => sum + gift.count, 0);

  const { data: rsvps } = await supabase
    .from("baby_rsvps")
    .select("attending, party_size")
    .eq("event_id", event.id);
  const confirmedPeople = (rsvps ?? [])
    .filter((r) => r.attending)
    .reduce((sum, r) => sum + r.party_size, 0);

  return (
    <div className="space-y-8">
      {accessible.length > 1 && (
        <div className="flex flex-wrap gap-2">
          {accessible.map((item) => (
            <form key={item.id} action={selectDashboardEvent.bind(null, item.id)}>
              <button
                type="submit"
                className={`rounded-full px-3 py-1 text-xs transition ${
                  item.id === event.id
                    ? "bg-ink-900 text-cream-50"
                    : "border border-ink-900/15 text-ink-700 hover:bg-ink-900/5"
                }`}
              >
                {item.baby_name || "Lista"} {item.role === "owner" ? "" : "· equipo"}
              </button>
            </form>
          ))}
        </div>
      )}
      <div>
        <h1 className="font-serif text-2xl text-ink-900">
          {event.baby_name ? `La lista de ${event.baby_name}` : "Tu lista"}
        </h1>
        <p className="mt-1 text-sm text-ink-700">
          {event.role === "organizer" ? "Estás organizando esta lista. " : ""}
          {event.event_date ? new Date(event.event_date + "T00:00:00").toLocaleDateString("es-AR", { day: "numeric", month: "long", year: "numeric" }) : "Sin fecha"}
          {event.event_time ? ` · ${formatInvitationTime(event.event_time)}` : ""}
          {event.location ? ` · ${event.location}` : ""}
        </p>
      </div>

      {generatedInvitation && event.invitation_image_url && (
        <img
          src={event.invitation_image_url}
          alt="Invitación"
          className="w-full rounded-xl2 border border-ink-900/10 object-cover shadow-sm"
        />
      )}
      {!generatedInvitation && selectedTemplate && (
        <InvitationCard
          templateId={selectedTemplate}
          babyName={event.baby_name}
          eventDate={event.event_date}
          eventTime={event.event_time}
          location={event.location}
          className="border border-ink-900/10"
        />
      )}

      <div className="rounded-xl2 border border-ink-900/10 bg-white/60 p-6">
        <p className="text-sm font-medium text-ink-900">
          Compartí este link con tus invitados
        </p>
        <div className="mt-3 flex flex-col gap-3 sm:flex-row sm:items-center">
          <code className="flex-1 truncate rounded-lg bg-ink-900/5 px-3 py-2 text-xs text-ink-800">
            {publicLink}
          </code>
          <CopyLinkButton link={publicLink} />
        </div>
      </div>

      <div className="grid gap-4 sm:grid-cols-3">
        <div className="rounded-xl2 border border-ink-900/10 bg-white/60 p-6">
          <p className="text-sm text-ink-700">Regalos en la lista</p>
          <p className="mt-1 font-serif text-3xl text-ink-900">{totalGifts ?? 0}</p>
        </div>
        <div className="rounded-xl2 border border-ink-900/10 bg-white/60 p-6">
          <p className="text-sm text-ink-700">Ya reservados</p>
          <p className="mt-1 font-serif text-3xl text-sage-600">{claimedCount ?? 0}</p>
        </div>
        <div className="rounded-xl2 border border-ink-900/10 bg-white/60 p-6">
          <p className="text-sm text-ink-700">Personas confirmadas</p>
          <p className="mt-1 font-serif text-3xl text-ink-900">{confirmedPeople}</p>
        </div>
      </div>

      {reservedGifts.length > 0 && (
        <div className="rounded-xl2 border border-ink-900/10 bg-white/60 p-6">
          <p className="text-sm font-medium text-ink-900">
            Regalos ya reservados
          </p>
          <ul className="mt-3 divide-y divide-ink-900/10">
            {reservedGifts.map((gift) => (
              <li
                key={gift.id}
                className="flex items-center justify-between gap-3 py-2 text-sm"
              >
                <span className="text-ink-800">{gift.name}</span>
                <span className="rounded-full bg-sage-100 px-2 py-0.5 text-xs text-sage-700">
                  {gift.count === 1 ? "Reservado" : `${gift.count} reservas`}
                </span>
              </li>
            ))}
          </ul>
        </div>
      )}

      <div className="flex flex-wrap gap-3">
        <Link
          href="/dashboard/regalos"
          className="rounded-xl2 bg-ink-900 px-5 py-2.5 text-sm font-medium text-cream-50 transition hover:bg-ink-800"
        >
          Editar lista de regalos
        </Link>
        <Link
          href="/dashboard/invitados"
          className="rounded-xl2 border border-ink-900/15 px-5 py-2.5 text-sm text-ink-800 transition hover:bg-ink-900/5"
        >
          Ver invitados
        </Link>
        <Link
          href="/dashboard/perfil"
          className="rounded-xl2 border border-ink-900/15 px-5 py-2.5 text-sm text-ink-800 transition hover:bg-ink-900/5"
        >
          Editar datos del evento
        </Link>
      </div>
    </div>
  );
}

function Field({
  label,
  name,
  type = "text",
  placeholder,
  textarea,
}: {
  label: string;
  name: string;
  type?: string;
  placeholder?: string;
  textarea?: boolean;
}) {
  return (
    <label className="block">
      <span className="text-sm font-medium text-ink-800">{label}</span>
      {textarea ? (
        <textarea
          name={name}
          placeholder={placeholder}
          rows={3}
          className="mt-1 w-full rounded-lg border border-ink-900/15 bg-white px-3 py-2 text-sm text-ink-900 outline-none focus:border-sage-500"
        />
      ) : (
        <input
          type={type}
          name={name}
          placeholder={placeholder}
          className="mt-1 w-full rounded-lg border border-ink-900/15 bg-white px-3 py-2 text-sm text-ink-900 outline-none focus:border-sage-500"
        />
      )}
    </label>
  );
}
