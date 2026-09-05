import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { addOwnerGift, deleteGift, resetDefaultGifts } from "../actions";

export default async function RegalosPage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  const { data: event } = await supabase
    .from("baby_events")
    .select("id")
    .eq("user_id", user!.id)
    .maybeSingle();

  if (!event) redirect("/dashboard");

  const { data: gifts } = await supabase
    .from("baby_gifts")
    .select("id, name, category, is_custom, max_quantity")
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

  const grouped = new Map<string, typeof gifts>();
  for (const gift of gifts ?? []) {
    const key = gift.category ?? "Otros";
    if (!grouped.has(key)) grouped.set(key, []);
    grouped.get(key)!.push(gift);
  }

  const addGift = addOwnerGift.bind(null, event.id);
  const reset = resetDefaultGifts.bind(null, event.id);

  return (
    <div className="max-w-2xl space-y-8">
      <div className="flex items-start justify-between gap-4">
        <div>
          <h1 className="font-serif text-2xl text-ink-900">Lista de regalos</h1>
          <p className="mt-1 text-sm text-ink-700">
            Los que aparecen tildados ya fueron reservados por algún
            invitado (de forma anónima, no vemos quién).
          </p>
        </div>
        <form action={reset}>
          <button
            type="submit"
            className="whitespace-nowrap rounded-lg border border-ink-900/15 px-3 py-2 text-xs text-ink-700 transition hover:bg-ink-900/5"
          >
            Restaurar lista base
          </button>
        </form>
      </div>

      <div className="space-y-6">
        {Array.from(grouped.entries()).map(([category, items]) => (
          <div key={category}>
            <h2 className="text-xs font-semibold uppercase tracking-wide text-sage-700">
              {category}
            </h2>
            <ul className="mt-2 divide-y divide-ink-900/10 rounded-xl2 border border-ink-900/10 bg-white/60">
              {items!.map((gift) => {
                const count = claimCounts.get(gift.id) ?? 0;
                const isFull = gift.max_quantity ? count >= gift.max_quantity : count > 0;
                return (
                  <li
                    key={gift.id}
                    className="flex items-center justify-between gap-3 px-4 py-3"
                  >
                    <span
                      className={
                        isFull
                          ? "text-sm text-ink-700 line-through"
                          : "text-sm text-ink-900"
                      }
                    >
                      {gift.name}
                      {count > 0 && (
                        <span className="ml-2 rounded-full bg-sage-100 px-2 py-0.5 text-[10px] font-medium text-sage-700 no-underline">
                          {gift.max_quantity
                            ? `${count}/${gift.max_quantity} reservado`
                            : "Reservado"}
                        </span>
                      )}
                    </span>
                    <form action={deleteGift.bind(null, gift.id)}>
                      <button
                        type="submit"
                        className="text-xs text-ink-700/60 hover:text-red-600"
                      >
                        Quitar
                      </button>
                    </form>
                  </li>
                );
              })}
            </ul>
          </div>
        ))}
      </div>

      <div className="rounded-xl2 border border-dashed border-ink-900/20 p-4">
        <p className="text-sm font-medium text-ink-800">
          Agregar un regalo a la lista
        </p>
        <form action={addGift} className="mt-3 flex flex-col gap-2 sm:flex-row">
          <input
            name="name"
            placeholder="Nombre del regalo"
            required
            className="flex-1 rounded-lg border border-ink-900/15 bg-white px-3 py-2 text-sm outline-none focus:border-sage-500"
          />
          <input
            name="category"
            placeholder="Categoría (opcional)"
            className="w-full rounded-lg border border-ink-900/15 bg-white px-3 py-2 text-sm outline-none focus:border-sage-500 sm:w-36"
          />
          <input
            name="max_quantity"
            type="number"
            min={2}
            placeholder="Cant. máx (opcional)"
            className="w-full rounded-lg border border-ink-900/15 bg-white px-3 py-2 text-sm outline-none focus:border-sage-500 sm:w-36"
          />
          <button
            type="submit"
            className="rounded-lg bg-ink-900 px-4 py-2 text-sm font-medium text-cream-50 transition hover:bg-ink-800"
          >
            Agregar
          </button>
        </form>
      </div>
    </div>
  );
}
