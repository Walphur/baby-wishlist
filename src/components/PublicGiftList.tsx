"use client";

import { useEffect, useRef, useState, useTransition } from "react";
import { toggleClaim, addClaim, removeClaim, addGuestGift } from "@/app/e/[slug]/actions";
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
  const [toast, setToast] = useState<{ ok: boolean; message: string } | null>(null);
  const toastTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    return () => {
      if (toastTimer.current) clearTimeout(toastTimer.current);
    };
  }, []);

  function showToast(result: { ok: boolean; message: string }) {
    setToast(result);
    if (toastTimer.current) clearTimeout(toastTimer.current);
    toastTimer.current = setTimeout(() => setToast(null), 3500);
  }

  const grouped = new Map<string, GiftWithClaim[]>();
  for (const gift of gifts) {
    const key = gift.category ?? "Otros";
    if (!grouped.has(key)) grouped.set(key, []);
    grouped.get(key)!.push(gift);
  }

  function handleToggle(giftId: string) {
    startTransition(async () => {
      const result = await toggleClaim(slug, giftId);
      showToast(result);
    });
  }

  function handleAdd(giftId: string) {
    startTransition(async () => {
      const result = await addClaim(slug, giftId);
      showToast(result);
    });
  }

  function handleRemove(giftId: string) {
    startTransition(async () => {
      const result = await removeClaim(slug, giftId);
      showToast(result);
    });
  }

  return (
    <div className="relative space-y-6">
      {toast && (
        <div
          role="status"
          className={`fixed inset-x-4 top-4 z-50 mx-auto max-w-sm rounded-xl2 border px-4 py-3 text-center text-sm shadow-lg sm:inset-x-auto sm:right-4 ${
            toast.ok
              ? "border-sage-300 bg-sage-50 text-sage-800"
              : "border-terracotta-400/40 bg-white text-terracotta-500"
          }`}
        >
          {toast.message}
        </div>
      )}

      {Array.from(grouped.entries()).map(([category, items]) => (
        <div key={category}>
          <h2 className="text-xs font-semibold uppercase tracking-wide text-sage-700">
            {category}
          </h2>
          <ul className="mt-2 divide-y divide-ink-900/10 rounded-xl2 border border-ink-900/10 bg-white/70">
            {items.map((gift) => (
              <li key={gift.id} className="flex items-start gap-3 px-4 py-3">
                {gift.max_quantity ? (
                  <div className="flex w-full items-center justify-between gap-3">
                    <div>
                      <p className="text-sm text-ink-900">{gift.name}</p>
                      {gift.notes && <p className="text-xs text-ink-700">{gift.notes}</p>}
                      <span className="text-xs text-sage-600">
                        {gift.claimedCount} de {gift.max_quantity} ya avisaron que lo llevan
                      </span>
                    </div>
                    <div className="flex shrink-0 items-center gap-2">
                      <button
                        type="button"
                        disabled={isPending || gift.claimedCount === 0}
                        onClick={() => handleRemove(gift.id)}
                        aria-label="Quitar mi aporte"
                        className="flex h-9 w-9 items-center justify-center rounded-full border border-ink-900/15 text-lg text-ink-700 disabled:opacity-30"
                      >
                        −
                      </button>
                      <button
                        type="button"
                        disabled={isPending || gift.claimedCount >= gift.max_quantity}
                        onClick={() => handleAdd(gift.id)}
                        aria-label="Sumarme a llevar esto"
                        className="flex h-9 w-9 items-center justify-center rounded-full bg-sage-600 text-lg text-white disabled:opacity-40"
                      >
                        +
                      </button>
                    </div>
                  </div>
                ) : (
                  <>
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
                  </>
                )}
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
