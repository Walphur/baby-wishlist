import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { deleteRsvp } from "../actions";

export default async function InvitadosPage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  const { data: event } = await supabase
    .from("baby_events")
    .select("id, event_date, guest_list_reveal_days")
    .eq("user_id", user!.id)
    .maybeSingle();

  if (!event) redirect("/dashboard");

  const { data: rsvps } = await supabase
    .from("baby_rsvps")
    .select("id, guest_name, attending, party_size, note, created_at")
    .eq("event_id", event.id)
    .order("guest_name", { ascending: true });

  const confirmed = (rsvps ?? []).filter((r) => r.attending);
  const declined = (rsvps ?? []).filter((r) => !r.attending);
  const totalPeople = confirmed.reduce((sum, r) => sum + r.party_size, 0);

  const daysUntilEvent = event.event_date
    ? Math.ceil(
        (new Date(event.event_date + "T00:00:00").getTime() - Date.now()) /
          (1000 * 60 * 60 * 24)
      )
    : null;
  const revealNames =
    daysUntilEvent === null ||
    daysUntilEvent <= event.guest_list_reveal_days ||
    (rsvps ?? []).length >= 10;

  return (
    <div className="max-w-2xl space-y-8">
      <div>
        <h1 className="font-serif text-2xl text-ink-900">Invitados</h1>
        <p className="mt-1 text-sm text-ink-700">
          Confirmaciones de asistencia que fueron dejando tus invitados en el
          link público.
        </p>
      </div>

      <div className="grid gap-4 sm:grid-cols-3">
        <div className="rounded-xl2 border border-ink-900/10 bg-white/60 p-6">
          <p className="text-sm text-ink-700">Confirmaron</p>
          <p className="mt-1 font-serif text-3xl text-sage-600">{confirmed.length}</p>
        </div>
        <div className="rounded-xl2 border border-ink-900/10 bg-white/60 p-6">
          <p className="text-sm text-ink-700">Personas en total</p>
          <p className="mt-1 font-serif text-3xl text-ink-900">{totalPeople}</p>
        </div>
        <div className="rounded-xl2 border border-ink-900/10 bg-white/60 p-6">
          <p className="text-sm text-ink-700">No pueden ir</p>
          <p className="mt-1 font-serif text-3xl text-ink-700">{declined.length}</p>
        </div>
      </div>

      {(rsvps ?? []).length === 0 ? (
        <p className="text-sm text-ink-700">
          Todavía nadie confirmó asistencia. Compartí el link de tu evento
          desde el resumen del dashboard.
        </p>
      ) : !revealNames ? (
        <div className="rounded-xl2 border border-dashed border-ink-900/20 p-4 text-sm text-ink-700">
          Los nombres se muestran {event.guest_list_reveal_days} días antes
          del evento (o antes si ya hay 10 o más confirmados). Es a propósito:
          así no se puede relacionar quién confirmó con qué regalo reservó, ya
          que los regalos son anónimos. Por ahora solo ves los totales de
          arriba. Podés cambiar esto en “Datos del evento”.
        </div>
      ) : (
        <ul className="divide-y divide-ink-900/10 rounded-xl2 border border-ink-900/10 bg-white/60">
          {(rsvps ?? []).map((r) => (
            <li key={r.id} className="flex items-start justify-between gap-3 px-4 py-3">
              <div>
                <p className="text-sm font-medium text-ink-900">
                  {r.guest_name}{" "}
                  <span
                    className={
                      r.attending
                        ? "ml-1 rounded-full bg-sage-100 px-2 py-0.5 text-[10px] font-medium text-sage-700"
                        : "ml-1 rounded-full bg-ink-900/10 px-2 py-0.5 text-[10px] font-medium text-ink-700"
                    }
                  >
                    {r.attending ? `Va (${r.party_size})` : "No va"}
                  </span>
                </p>
                {r.note && <p className="mt-1 text-xs text-ink-700">{r.note}</p>}
              </div>
              <form action={deleteRsvp.bind(null, r.id)}>
                <button
                  type="submit"
                  className="text-xs text-ink-700/60 hover:text-red-600"
                >
                  Quitar
                </button>
              </form>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
