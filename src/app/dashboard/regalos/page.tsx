import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { getAccessibleEvent } from "@/lib/event-access";
import { addOwnerGift, resetDefaultGifts } from "../actions";
import OwnerGiftRow from "@/components/OwnerGiftRow";

export default async function RegalosPage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  const event = await getAccessibleEvent(user!);
  if (!event) redirect("/dashboard");

  let { data: gifts, error } = await supabase
    .from("baby_gifts")
    .select("id, name, category, notes, is_custom, max_quantity, already_have")
    .eq("event_id", event.id)
    .order("category");

  if (error) {
    const fallback = await supabase
      .from("baby_gifts")
      .select("id, name, category, notes, is_custom, max_quantity")
      .eq("event_id", event.id)
      .order("category");
    gifts = (fallback.data ?? []).map((g) => ({ ...g, already_have: false }));
  }

  const giftIds = (gifts ?? []).map((g) => g.id);
  const { data: claims } =
    giftIds.length > 0
      ? await supabase.from("baby_claims").select("gift_id").in("gift_id", giftIds)
      : { data: [] };
  const claimCounts = new Map<string, number>();
  for (const c of claims ?? []) {
    claimCounts.set(c.gift_id, (claimCounts.get(c.gift_id) ?? 0) + 1);
  }

  const grouped = new Map<string, NonNullable<typeof gifts>>();
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
            Podés editar cualquier ítem o marcar “Ya lo tenemos” para que los
            invitados sepan que eso ya está cubierto. Los tildados fueron
            reservados (anónimo); solo vos los liberás.
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
        {(gifts ?? []).length === 0 ? (
          <div className="rounded-xl2 border border-dashed border-ink-900/20 bg-white/50 px-4 py-8 text-center">
            <p className="text-sm text-ink-800">
              Todavía no hay regalos en la lista.
            </p>
            <p className="mt-1 text-xs text-ink-700">
              Cargá la lista base de ideas útiles (pañales, baño, ropa, etc.).
            </p>
            <form action={reset} className="mt-4">
              <button
                type="submit"
                className="rounded-xl2 bg-ink-900 px-5 py-2.5 text-sm font-medium text-cream-50 transition hover:bg-ink-800"
              >
                Cargar lista base
              </button>
            </form>
          </div>
        ) : (
          Array.from(grouped.entries()).map(([category, items]) => (
            <div key={category}>
              <h2 className="text-xs font-semibold uppercase tracking-wide text-sage-700">
                {category}
              </h2>
              <ul className="mt-2 divide-y divide-ink-900/10 rounded-xl2 border border-ink-900/10 bg-white/60">
                {items!.map((gift) => (
                  <OwnerGiftRow
                    key={gift.id}
                    gift={gift}
                    claimCount={claimCounts.get(gift.id) ?? 0}
                  />
                ))}
              </ul>
            </div>
          ))
        )}
      </div>

      <div className="rounded-xl2 border border-dashed border-ink-900/20 p-4">
        <p className="text-sm font-medium text-ink-800">
          Agregar un regalo a la lista
        </p>
        <form action={addGift} className="mt-3 space-y-2">
          <div className="flex flex-col gap-2 sm:flex-row">
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
              placeholder="Cant. máx"
              className="w-full rounded-lg border border-ink-900/15 bg-white px-3 py-2 text-sm outline-none focus:border-sage-500 sm:w-28"
            />
          </div>
          <input
            name="notes"
            placeholder="Nota opcional"
            className="w-full rounded-lg border border-ink-900/15 bg-white px-3 py-2 text-sm outline-none focus:border-sage-500"
          />
          <label className="flex items-center gap-2 text-sm text-ink-800">
            <input
              type="checkbox"
              name="already_have"
              className="h-4 w-4 rounded border-ink-900/30 text-sage-600 focus:ring-sage-500"
            />
            Ya lo tenemos (aparece en la lista pública marcado)
          </label>
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
