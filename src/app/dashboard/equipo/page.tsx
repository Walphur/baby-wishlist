import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { getAccessibleEvent } from "@/lib/event-access";
import { inviteOrganizer, removeOrganizer } from "../actions";

export default async function EquipoPage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) redirect("/login");

  const event = await getAccessibleEvent(user);
  if (!event) redirect("/dashboard");

  const { data: members } = await supabase
    .from("baby_event_members")
    .select("id, email, user_id, created_at")
    .eq("event_id", event.id)
    .order("created_at");

  const isOwner = event.role === "owner";
  const invite = inviteOrganizer.bind(null, event.id);

  return (
    <div className="max-w-lg space-y-8">
      <div>
        <h1 className="font-serif text-2xl text-ink-900">Quién organiza</h1>
        <p className="mt-2 text-sm text-ink-700">
          Invitá al papá, a la mamá o a los padrinos. Entran con Google y
          ven la misma lista, los invitados y los regalos.
        </p>
      </div>

      <div className="rounded-xl2 border border-ink-900/10 bg-white/60 p-5">
        <p className="text-xs font-medium uppercase tracking-wide text-sage-700">
          Dueño de la lista
        </p>
        <p className="mt-1 text-sm text-ink-900">
          {isOwner ? user.email : "Quien creó esta lista"}
        </p>
      </div>

      <div>
        <h2 className="font-medium text-ink-900">Organizadores invitados</h2>
        {(members ?? []).length === 0 ? (
          <p className="mt-2 text-sm text-ink-700">
            Todavía no hay nadie más. Cuando invites a alguien, va a poder
            entrar con esa cuenta de Google.
          </p>
        ) : (
          <ul className="mt-3 divide-y divide-ink-900/10 rounded-xl2 border border-ink-900/10 bg-white/60">
            {(members ?? []).map((member) => (
              <li
                key={member.id}
                className="flex items-center justify-between gap-3 px-4 py-3"
              >
                <div>
                  <p className="text-sm text-ink-900">{member.email}</p>
                  <p className="text-xs text-ink-700">
                    {member.user_id ? "Ya entró" : "Invitación pendiente"}
                  </p>
                </div>
                {isOwner && (
                  <form action={removeOrganizer.bind(null, member.id)}>
                    <button
                      type="submit"
                      className="text-xs text-ink-700/60 hover:text-red-600"
                    >
                      Quitar
                    </button>
                  </form>
                )}
              </li>
            ))}
          </ul>
        )}
      </div>

      {isOwner && (
        <form action={invite} className="space-y-3">
          <label className="block">
            <span className="text-sm font-medium text-ink-800">
              Email de Google
            </span>
            <input
              type="email"
              name="email"
              required
              placeholder="ej: padrino@gmail.com"
              className="mt-1 w-full rounded-lg border border-ink-900/15 bg-white px-3 py-2 text-sm text-ink-900 outline-none focus:border-sage-500"
            />
          </label>
          <button
            type="submit"
            className="rounded-xl2 bg-ink-900 px-5 py-2.5 text-sm font-medium text-cream-50 transition hover:bg-ink-800"
          >
            Invitar a organizar
          </button>
        </form>
      )}

      {!isOwner && (
        <p className="text-sm text-ink-700">
          Estás viendo esta lista como organizador. Solo quien la creó puede
          sumar o quitar personas.
        </p>
      )}
    </div>
  );
}
