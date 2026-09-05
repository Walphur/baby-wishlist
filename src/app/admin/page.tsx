import { createAdminClient } from "@/lib/supabase/admin";

export const dynamic = "force-dynamic";

export default async function AdminPage() {
  const admin = createAdminClient();

  const [
    { count: listsCount },
    { count: giftsCount },
    { count: claimsCount },
    { count: rsvpsCount },
    { count: organizersCount },
    { data: recentLists },
  ] = await Promise.all([
    admin.from("baby_events").select("id", { count: "exact", head: true }),
    admin.from("baby_gifts").select("id", { count: "exact", head: true }),
    admin.from("baby_claims").select("id", { count: "exact", head: true }),
    admin.from("baby_rsvps").select("id", { count: "exact", head: true }),
    admin.from("baby_event_members").select("id", { count: "exact", head: true }),
    admin
      .from("baby_events")
      .select("id, baby_name, location, created_at, slug")
      .order("created_at", { ascending: false })
      .limit(12),
  ]);

  let accountsCount = 0;
  try {
    const { data } = await admin.auth.admin.listUsers({ perPage: 1000 });
    accountsCount = data.users.length;
  } catch {
    accountsCount = listsCount ?? 0;
  }

  const stats = [
    { label: "Cuentas creadas", value: accountsCount },
    { label: "Listas / invitaciones", value: listsCount ?? 0 },
    { label: "Regalos cargados", value: giftsCount ?? 0 },
    { label: "Regalos reservados", value: claimsCount ?? 0 },
    { label: "Confirmaciones RSVP", value: rsvpsCount ?? 0 },
    { label: "Organizadores invitados", value: organizersCount ?? 0 },
  ];

  return (
    <div className="space-y-8">
      <div>
        <h1 className="font-serif text-2xl text-ink-900">Panel admin</h1>
        <p className="mt-1 text-sm text-ink-700">
          Cómo se está usando Baby Wishlist. Esto no es una lista de baby
          shower: es el tablero interno.
        </p>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {stats.map((stat) => (
          <div
            key={stat.label}
            className="rounded-xl2 border border-ink-900/10 bg-white/60 p-6"
          >
            <p className="text-sm text-ink-700">{stat.label}</p>
            <p className="mt-1 font-serif text-3xl text-ink-900">{stat.value}</p>
          </div>
        ))}
      </div>

      <div>
        <h2 className="font-medium text-ink-900">Últimas listas</h2>
        <ul className="mt-3 divide-y divide-ink-900/10 rounded-xl2 border border-ink-900/10 bg-white/60">
          {(recentLists ?? []).length === 0 ? (
            <li className="px-4 py-3 text-sm text-ink-700">Todavía no hay listas.</li>
          ) : (
            (recentLists ?? []).map((event) => (
              <li key={event.id} className="px-4 py-3 text-sm">
                <p className="text-ink-900">
                  {event.baby_name || "Lista sin nombre"}
                </p>
                <p className="text-xs text-ink-700">
                  {event.location || "Sin lugar"} ·{" "}
                  {new Date(event.created_at).toLocaleDateString("es-AR")} · /e/
                  {event.slug}
                </p>
              </li>
            ))
          )}
        </ul>
      </div>
    </div>
  );
}
