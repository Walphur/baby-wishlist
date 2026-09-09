"use client";

import { useState } from "react";
import {
  clearGiftClaims,
  deleteGift,
  updateGift,
} from "@/app/dashboard/actions";
import { isAlreadyHaveGift, visibleGiftNotes } from "@/lib/gift-status";

type GiftItem = {
  id: string;
  name: string;
  category: string | null;
  notes?: string | null;
  max_quantity: number | null;
  already_have?: boolean | null;
};

export default function OwnerGiftRow({
  gift,
  claimCount,
}: {
  gift: GiftItem;
  claimCount: number;
}) {
  const [editing, setEditing] = useState(false);
  const alreadyHave = isAlreadyHaveGift(gift);
  const isFull = gift.max_quantity ? claimCount >= gift.max_quantity : claimCount > 0;
  const notesVisible = visibleGiftNotes(gift.notes);

  if (editing) {
    return (
      <li className="px-4 py-3">
        <form
          action={async (formData) => {
            await updateGift(gift.id, formData);
            setEditing(false);
          }}
          className="space-y-2"
        >
          <input
            name="name"
            defaultValue={gift.name}
            required
            className="w-full rounded-lg border border-ink-900/15 bg-white px-3 py-2 text-sm outline-none focus:border-sage-500"
          />
          <div className="flex flex-col gap-2 sm:flex-row">
            <input
              name="category"
              defaultValue={gift.category ?? ""}
              placeholder="Categoría"
              className="w-full rounded-lg border border-ink-900/15 bg-white px-3 py-2 text-sm outline-none focus:border-sage-500 sm:flex-1"
            />
            <input
              name="max_quantity"
              type="number"
              min={2}
              defaultValue={gift.max_quantity && gift.max_quantity > 1 ? gift.max_quantity : ""}
              placeholder="Cant. máx"
              className="w-full rounded-lg border border-ink-900/15 bg-white px-3 py-2 text-sm outline-none focus:border-sage-500 sm:w-28"
            />
          </div>
          <input
            name="notes"
            defaultValue={notesVisible ?? ""}
            placeholder="Nota opcional"
            className="w-full rounded-lg border border-ink-900/15 bg-white px-3 py-2 text-sm outline-none focus:border-sage-500"
          />
          <label className="flex items-center gap-2 text-sm text-ink-800">
            <input
              type="checkbox"
              name="already_have"
              defaultChecked={alreadyHave}
              className="h-4 w-4 rounded border-ink-900/30 text-sage-600 focus:ring-sage-500"
            />
            Ya lo tenemos (los invitados lo van a ver marcado)
          </label>
          <div className="flex flex-wrap gap-2 pt-1">
            <button
              type="submit"
              className="rounded-lg bg-ink-900 px-3 py-1.5 text-xs font-medium text-cream-50 hover:bg-ink-800"
            >
              Guardar
            </button>
            <button
              type="button"
              onClick={() => setEditing(false)}
              className="rounded-lg px-3 py-1.5 text-xs text-ink-700 hover:bg-ink-900/5"
            >
              Cancelar
            </button>
          </div>
        </form>
      </li>
    );
  }

  return (
    <li className="flex items-center justify-between gap-3 px-4 py-3">
      <div className="min-w-0">
        <p
          className={
            alreadyHave || isFull
              ? "text-sm text-ink-700"
              : "text-sm text-ink-900"
          }
        >
          <span className={isFull && !alreadyHave ? "line-through" : undefined}>
            {gift.name}
          </span>
          {alreadyHave && (
            <span className="ml-2 rounded-full bg-ink-900/10 px-2 py-0.5 text-[10px] font-medium text-ink-800 no-underline">
              Ya lo tenemos
            </span>
          )}
          {!alreadyHave && claimCount > 0 && (
            <span className="ml-2 rounded-full bg-sage-100 px-2 py-0.5 text-[10px] font-medium text-sage-700 no-underline">
              {gift.max_quantity
                ? `${claimCount}/${gift.max_quantity} reservado`
                : "Reservado"}
            </span>
          )}
        </p>
        {notesVisible ? (
          <p className="mt-0.5 text-xs text-ink-700">{notesVisible}</p>
        ) : null}
      </div>
      <div className="flex shrink-0 items-center gap-2">
        <button
          type="button"
          onClick={() => setEditing(true)}
          className="text-xs text-ink-700 hover:text-ink-900"
        >
          Editar
        </button>
        {!alreadyHave && claimCount > 0 && (
          <form action={clearGiftClaims.bind(null, gift.id)}>
            <button
              type="submit"
              className="text-xs text-sage-700 hover:text-sage-800"
            >
              Liberar
            </button>
          </form>
        )}
        <form action={deleteGift.bind(null, gift.id)}>
          <button
            type="submit"
            className="text-xs text-ink-700/60 hover:text-red-600"
          >
            Quitar
          </button>
        </form>
      </div>
    </li>
  );
}
