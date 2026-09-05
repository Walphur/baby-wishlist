"use client";

import { useState, useTransition } from "react";
import { toggleClaim, addGuestGift } from "@/app/e/[slug]/actions";
import type { GiftWithClaim } from "@/lib/types";

export default function PublicGiftList({
  slug,
  gifts,
}: {
  slug: string;
  gifts: GiftWithClaim[];
}) {
  const [isPending, startTransition] = useTransition();
  const [showForm, setShowForm] = useState(false);

  const grouped = new Map<string, GiftWithClaim[]>();
  for (const gift of gifts) {
    const key = gift.category ?? "Otros";
    if (!grouped.has(key)) grouped.set(key, []);
    grouped.get(key)!.push(gift);
  }

  function handleToggle(giftId: string) {
    startTransition(() => {
      toggleClaim(slug, giftId);
    });
  }

  return (
    <div className="space-y-6">
      {Array.from(grouped.entries()).map(([category, items]) => (
        <div key={category}>
          <h2 className="text-xs font-semibold uppercase tracking-wide text-sage-700">
            {category}
          </h2>
          <ul className="mt-2 divide-y divide-ink-900/10 rounded-xl2 border border-ink-900/10 bg-white/70">
            {items.map((gift) => (
              <li key={gift.id} className="flex items-start gap-3 px-4 py-3">
                <input
                  type="checkbox"
                  checked={gift.claimed}
                  disabled={isPending}
                  onChange={() => handleToggle(gift.id)}
                  className="mt-0.5 h-5 w-5 shrink-0 rounded border-ink-900/30 text-sage-600 focus:ring-sage-500"
                />
                <div>
                  <p
                    className={
                      gift.claimed
                        ? "text-sm text-ink-700 line-through"
                        : "text-sm text-ink-900"
                    }
                  >
                    {gift.name}
                  </p>
                  {gift.notes && (
                    <p className="text-xs text-ink-700">{gift.notes}</p>
                  )}
                  {gift.claimed && (
                    <span className="text-xs text-sage-600">
                      Ya alguien va a llevar esto
                    </span>
                  )}
                </div>
              </li>
            ))}
          </ul>
        </div>
      ))}

      <div className="rounded-xl2 border border-dashed border-ink-900/20 p-4">
        {showForm ? (
          <form
            action={async (formData: FormData) => {
              await addGuestGift(slug, formData);
              setShowForm(false);
            }}
            className="flex flex-col gap-2"
          >
            <input
              name="name"
              required
              placeholder="¿Qué querés regalar?"
              className="rounded-lg border border-ink-900/15 bg-white px-3 py-2 text-sm outline-none focus:border-sage-500"
            />
            <input
              name="notes"
              placeholder="Detalle opcional (talle, color, etc.)"
              className="rounded-lg border border-ink-900/15 bg-white px-3 py-2 text-sm outline-none focus:border-sage-500"
            />
            <div className="flex gap-2">
              <button
                type="submit"
                className="rounded-lg bg-ink-900 px-4 py-2 text-sm font-medium text-cream-50 transition hover:bg-ink-800"
              >
                Agregar a la lista
              </button>
              <button
                type="button"
                onClick={() => setShowForm(false)}
                className="rounded-lg px-4 py-2 text-sm text-ink-700"
              >
                Cancelar
              </button>
            </div>
          </form>
        ) : (
          <button
            onClick={() => setShowForm(true)}
            className="text-sm font-medium text-sage-700 hover:text-sage-800"
          >
            + Quiero regalar algo que no está en la lista
          </button>
        )}
      </div>
    </div>
  );
}
