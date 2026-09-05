import { headers } from "next/headers";
import { createClient } from "@/lib/supabase/server";
import { createEvent } from "./actions";
import CopyLinkButton from "@/components/CopyLinkButton";
import Link from "next/link";

export default async function DashboardPage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  const { data: event } = await supabase
    .from("baby_events")
    .select("id, slug, baby_name, event_date, location")
    .eq("user_id", user!.id)
    .maybeSingle();

  if (!event) {
    return (
      <div className="max-w-lg">
        <h1 className="font-serif text-2xl text-ink-900">
          ¡Bienvenido/a! Contanos sobre tu baby shower
        </h1>
        <p className="mt-2 text-sm text-ink-700">
          Con esto armamos tu página y una lista base de regalos que después
          vas a poder editar.
        </p>
        <form action={createEvent} className="mt-6 space-y-4">
          <Field label="Nombre del bebé/a (opcional)" name="baby_name" />
          <Field label="Fecha del evento" name="event_date" type="date" />
          <Field label="Lugar" name="location" placeholder="Ej: Salón Los Aromos" />
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
          <button
            type="submit"
            className="rounded-xl2 bg-ink-900 px-6 py-3 text-sm font-medium text-cream-50 transition hover:bg-ink-800"
          >
            Crear mi lista
          </button>
        </form>
      </div>
    );
  }

  const host = (await headers()).get("host");
  const protocol = host?.includes("localhost") ? "http" : "https";
  const publicLink = `${protocol}://${host}/e/${event.slug}`;

  const { count: totalGifts } = await supabase
    .from("baby_gifts")
    .select("id", { count: "exact", head: true })
    .eq("event_id", event.id);

  const { data: gifts } = await supabase
    .from("baby_gifts")
    .select("id")
    .eq("event_id", event.id);
  const giftIds = (gifts ?? []).map((g) => g.id);
  const { count: claimedCount } =
    giftIds.length > 0
      ? await supabase
          .from("baby_claims")
          .select("id", { count: "exact", head: true })
          .in("gift_id", giftIds)
      : { count: 0 };

  const { data: rsvps } = await supabase
    .from("baby_rsvps")
    .select("attending, party_size")
    .eq("event_id", event.id);
  const confirmedPeople = (rsvps ?? [])
    .filter((r) => r.attending)
    .reduce((sum, r) => sum + r.party_size, 0);

  return (
    <div className="space-y-8">
      <div>
        <h1 className="font-serif text-2xl text-ink-900">
          {event.baby_name ? `La lista de ${event.baby_name}` : "Tu lista"}
        </h1>
        <p className="mt-1 text-sm text-ink-700">
          {event.event_date ? new Date(event.event_date + "T00:00:00").toLocaleDateString("es-AR", { day: "numeric", month: "long", year: "numeric" }) : "Sin fecha"}
          {event.location ? ` · ${event.location}` : ""}
        </p>
      </div>

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
