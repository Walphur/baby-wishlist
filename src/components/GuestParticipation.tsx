"use client";

import { useMemo, useRef, useState, useTransition } from "react";
import { addGuestGift, confirmGuestChoices } from "@/app/e/[slug]/actions";
import type { GiftWithClaim } from "@/lib/types";
import { isAlreadyHaveGift, visibleGiftNotes } from "@/lib/gift-status";
import {
  CLOTHING_SIZES,
  CLOTHING_SLEEVES,
  CLOTHING_SOFT_ALERT_AT,
  CLOTHING_TYPES,
  countClothingByType,
  formatClothingChoice,
  isClothingPickerGift,
  parseClothingType,
} from "@/lib/clothing";

type Props = {
  slug: string;
  gifts: GiftWithClaim[];
  askPartySize?: boolean;
};

export default function GuestParticipation({
  slug,
  gifts,
  askPartySize = true,
}: Props) {
  const formRef = useRef<HTMLFormElement>(null);
  const [isPending, startTransition] = useTransition();
  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const [clothingChoices, setClothingChoices] = useState<string[]>([]);
  const [attending, setAttending] = useState<"yes" | "no">("yes");
  const [showCustom, setShowCustom] = useState(false);
  const [result, setResult] = useState<{ ok: boolean; message: string } | null>(null);

  const [clothType, setClothType] = useState<string>(CLOTHING_TYPES[0]);
  const [clothSize, setClothSize] = useState<string>(CLOTHING_SIZES[1]);
  const [clothSleeve, setClothSleeve] = useState<string>(CLOTHING_SLEEVES[2]);

  const giftById = useMemo(() => new Map(gifts.map((g) => [g.id, g])), [gifts]);

  const selectedLabels = useMemo(() => {
    const fromList = selectedIds
      .map((id) => giftById.get(id)?.name)
      .filter(Boolean) as string[];
    return [...fromList, ...clothingChoices];
  }, [selectedIds, clothingChoices, giftById]);

  const clothingCounts = useMemo(
    () => countClothingByType(gifts, clothingChoices),
    [gifts, clothingChoices]
  );

  const softClothingAlerts = useMemo(
    () =>
      Array.from(clothingCounts.entries())
        .filter(([, count]) => count >= CLOTHING_SOFT_ALERT_AT)
        .sort((a, b) => b[1] - a[1]),
    [clothingCounts]
  );

  const currentTypeCount = clothingCounts.get(clothType) ?? 0;

  // Ropa nunca se lista como checkbox: solo el selector (ilimitado).
  const grouped = new Map<string, GiftWithClaim[]>();
  for (const gift of gifts) {
    if (isClothingPickerGift(gift)) continue;
    if ((gift.category ?? "") === "Ropa") continue;
    if (parseClothingType(gift.name)) continue;
    const key = gift.category ?? "Otros";
    if (!grouped.has(key)) grouped.set(key, []);
    grouped.get(key)!.push(gift);
  }
  if (!grouped.has("Ropa")) grouped.set("Ropa", []);

  function toggleGift(gift: GiftWithClaim) {
    if (isAlreadyHaveGift(gift) || isClothingPickerGift(gift)) return;
    if ((gift.category ?? "") === "Ropa") return;

    const takenExclusive = !gift.max_quantity && gift.claimed;
    if (takenExclusive && !selectedIds.includes(gift.id)) return;

    const fullMulti =
      gift.max_quantity != null &&
      gift.claimedCount >= gift.max_quantity &&
      !selectedIds.includes(gift.id);
    if (fullMulti) return;

    setSelectedIds((prev) =>
      prev.includes(gift.id) ? prev.filter((id) => id !== gift.id) : [...prev, gift.id]
    );
    setResult(null);
  }

  function addClothingChoice() {
    const label = formatClothingChoice({
      type: clothType,
      size: clothSize,
      sleeve: clothSleeve,
    });
    setClothingChoices((prev) =>
      prev.includes(label) ? prev : [...prev, label].slice(0, 10)
    );
    setResult(null);
  }

  function removeClothingChoice(label: string) {
    setClothingChoices((prev) => prev.filter((item) => item !== label));
  }

  function handleConfirm(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    formData.set("selected_gift_ids", selectedIds.join(","));
    formData.set("clothing_choices", JSON.stringify(clothingChoices));
    startTransition(async () => {
      const res = await confirmGuestChoices(slug, formData);
      setResult(res);
      if (res.ok) {
        setSelectedIds([]);
        setClothingChoices([]);
        formRef.current?.reset();
        setAttending("yes");
      }
    });
  }

  return (
    <div className="space-y-8">
      <div className="space-y-6">
        <p className="rounded-xl2 border border-ink-900/10 bg-white/70 px-4 py-3 text-sm text-ink-800">
          <span className="font-medium text-ink-900">Los regalos son anónimos. </span>
          Quien organiza solo ve qué ítems están reservados, no quién lleva cada
          uno.
        </p>
        {Array.from(grouped.entries()).map(([category, items]) => (
          <div key={category}>
            <h2 className="text-xs font-semibold uppercase tracking-wide text-sage-700">
              {category}
            </h2>
            <ul className="mt-2 divide-y divide-ink-900/10 rounded-xl2 border border-ink-900/10 bg-white/70">
              {category === "Ropa" ? (
                <li className="space-y-3 px-4 py-4">
                  <div>
                    <p className="text-sm font-medium text-ink-900">Ropa a elección</p>
                    <p className="mt-0.5 text-xs text-ink-700">
                      Podés sumar toda la ropa que quieras: no se agota. Elegí
                      talle y tipo; si ya hay varios del mismo, te avisamos con
                      un tip.
                    </p>
                  </div>

                  {softClothingAlerts.length > 0 && (
                    <div className="rounded-lg border border-sage-200 bg-sage-50/90 px-3 py-2 text-xs text-sage-800">
                      <p className="font-medium">Tip (no es un límite)</p>
                      <ul className="mt-1 list-disc space-y-0.5 pl-4">
                        {softClothingAlerts.map(([type, count]) => (
                          <li key={type}>
                            {count} ya traen {type.toLowerCase()}. Si preferís,
                            podés elegir otra cosa.
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}

                  <div className="grid gap-2 sm:grid-cols-3">
                    <label className="block text-xs text-ink-700">
                      Tipo
                      <select
                        value={clothType}
                        onChange={(e) => setClothType(e.target.value)}
                        className="mt-1 w-full rounded-lg border border-ink-900/15 bg-white px-2 py-2 text-sm text-ink-900 outline-none focus:border-sage-500"
                      >
                        {CLOTHING_TYPES.map((t) => (
                          <option key={t} value={t}>
                            {t}
                          </option>
                        ))}
                      </select>
                    </label>
                    <label className="block text-xs text-ink-700">
                      Talle
                      <select
                        value={clothSize}
                        onChange={(e) => setClothSize(e.target.value)}
                        className="mt-1 w-full rounded-lg border border-ink-900/15 bg-white px-2 py-2 text-sm text-ink-900 outline-none focus:border-sage-500"
                      >
                        {CLOTHING_SIZES.map((s) => (
                          <option key={s} value={s}>
                            {s}
                          </option>
                        ))}
                      </select>
                    </label>
                    <label className="block text-xs text-ink-700">
                      Manga
                      <select
                        value={clothSleeve}
                        onChange={(e) => setClothSleeve(e.target.value)}
                        className="mt-1 w-full rounded-lg border border-ink-900/15 bg-white px-2 py-2 text-sm text-ink-900 outline-none focus:border-sage-500"
                      >
                        {CLOTHING_SLEEVES.map((s) => (
                          <option key={s} value={s}>
                            {s}
                          </option>
                        ))}
                      </select>
                    </label>
                  </div>

                  {currentTypeCount >= CLOTHING_SOFT_ALERT_AT && (
                    <p className="text-xs text-ink-700">
                      Tip: ya hay {currentTypeCount} que traen{" "}
                      {clothType.toLowerCase()}. Igual podés sumarlo si querés.
                    </p>
                  )}

                  <button
                    type="button"
                    onClick={addClothingChoice}
                    className="rounded-lg bg-sage-600 px-3 py-2 text-xs font-medium text-white transition hover:bg-sage-700"
                  >
                    Sumar esta ropa a mi selección
                  </button>

                  {clothingChoices.length > 0 && (
                    <ul className="space-y-1">
                      {clothingChoices.map((label) => (
                        <li
                          key={label}
                          className="flex items-center justify-between gap-2 rounded-lg bg-sage-50 px-3 py-2 text-xs text-sage-800"
                        >
                          <span>{label}</span>
                          <button
                            type="button"
                            onClick={() => removeClothingChoice(label)}
                            className="text-ink-700 hover:text-ink-900"
                          >
                            Quitar
                          </button>
                        </li>
                      ))}
                    </ul>
                  )}
                </li>
              ) : null}

              {category !== "Ropa" &&
                items.map((gift) => {
                  const alreadyHave = isAlreadyHaveGift(gift);
                  const notes = visibleGiftNotes(gift.notes);

                  if (alreadyHave) {
                    return (
                      <li key={gift.id} className="flex items-start gap-3 px-4 py-3">
                        <span
                          aria-hidden
                          className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded border border-ink-900/20 bg-ink-900/5 text-[10px] text-ink-700"
                        >
                          ✓
                        </span>
                        <div>
                          <p className="text-sm text-ink-800">{gift.name}</p>
                          {notes ? <p className="text-xs text-ink-700">{notes}</p> : null}
                          <span className="text-xs font-medium text-ink-700">
                            Ya lo tenemos
                          </span>
                        </div>
                      </li>
                    );
                  }

                  const mine = selectedIds.includes(gift.id);
                  const takenExclusive = !gift.max_quantity && gift.claimed;
                  const fullMulti =
                    gift.max_quantity != null && gift.claimedCount >= gift.max_quantity;
                  const locked = (takenExclusive || fullMulti) && !mine;

                  return (
                    <li key={gift.id} className="flex items-start gap-3 px-4 py-3">
                      <input
                        type="checkbox"
                        checked={mine}
                        disabled={isPending || locked}
                        onChange={() => toggleGift(gift)}
                        className="mt-0.5 h-5 w-5 shrink-0 rounded border-ink-900/30 text-sage-600 focus:ring-sage-500 disabled:opacity-70"
                      />
                      <div>
                        <p
                          className={
                            locked
                              ? "text-sm text-ink-700 line-through"
                              : "text-sm text-ink-900"
                          }
                        >
                          {gift.name}
                        </p>
                        {notes ? <p className="text-xs text-ink-700">{notes}</p> : null}
                        {gift.max_quantity ? (
                          <span className="text-xs text-sage-600">
                            {gift.claimedCount} de {gift.max_quantity} ya avisaron que lo
                            llevan
                          </span>
                        ) : locked ? (
                          <span className="text-xs text-sage-600">
                            Alguien ya avisó que lo lleva
                          </span>
                        ) : mine ? (
                          <span className="text-xs text-sage-600">
                            En tu selección (podés destildar si te arrepentís)
                          </span>
                        ) : null}
                      </div>
                    </li>
                  );
                })}
            </ul>
          </div>
        ))}

        <div className="rounded-xl2 border border-dashed border-ink-900/20 p-4">
          {showCustom ? (
            <form
              action={async (formData: FormData) => {
                await addGuestGift(slug, formData);
                setShowCustom(false);
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
                  onClick={() => setShowCustom(false)}
                  className="rounded-lg px-4 py-2 text-sm text-ink-700"
                >
                  Cancelar
                </button>
              </div>
            </form>
          ) : (
            <button
              type="button"
              onClick={() => setShowCustom(true)}
              className="text-sm font-medium text-sage-700 hover:text-sage-800"
            >
              + Quiero regalar algo que no está en la lista
            </button>
          )}
        </div>
      </div>

      <div className="rounded-xl2 border border-ink-900/10 bg-white/70 p-5">
        <h2 className="font-serif text-lg text-ink-900">¿Vas a poder venir?</h2>
        <p className="mt-1 text-sm text-ink-700">
          Marcá arriba lo que te gustaría llevar (podés cambiarlo cuando quieras) y
          confirmá acá al final.
        </p>

        {selectedLabels.length > 0 && (
          <div className="mt-3 rounded-xl border border-sage-200 bg-sage-50/80 px-3 py-2 text-sm text-sage-800">
            <p className="text-xs font-medium uppercase tracking-wide text-sage-700">
              Tu selección
            </p>
            <ul className="mt-1 list-disc space-y-0.5 pl-4">
              {selectedLabels.map((label) => (
                <li key={label}>{label}</li>
              ))}
            </ul>
          </div>
        )}

        <form ref={formRef} onSubmit={handleConfirm} className="mt-4 space-y-3">
          <input
            name="guest_name"
            required
            placeholder="Tu nombre"
            className="w-full rounded-lg border border-ink-900/15 bg-white px-3 py-2 text-sm outline-none focus:border-sage-500"
          />

          <div className="flex gap-4 text-sm">
            <label className="flex items-center gap-2">
              <input
                type="radio"
                name="attending"
                value="yes"
                checked={attending === "yes"}
                onChange={() => setAttending("yes")}
              />
              Voy a estar
            </label>
            <label className="flex items-center gap-2">
              <input
                type="radio"
                name="attending"
                value="no"
                checked={attending === "no"}
                onChange={() => setAttending("no")}
              />
              No voy a poder ir
            </label>
          </div>

          {attending === "yes" && askPartySize && (
            <label className="block">
              <span className="text-sm text-ink-800">
                ¿Cuántas personas van (incluyéndote)?
              </span>
              <input
                type="number"
                name="party_size"
                min={1}
                max={20}
                defaultValue={1}
                className="mt-1 w-24 rounded-lg border border-ink-900/15 bg-white px-3 py-2 text-sm outline-none focus:border-sage-500"
              />
            </label>
          )}

          <input
            name="note"
            placeholder="Algo que quieras avisar (opcional)"
            className="w-full rounded-lg border border-ink-900/15 bg-white px-3 py-2 text-sm outline-none focus:border-sage-500"
          />

          <button
            type="submit"
            disabled={isPending}
            className="rounded-lg bg-sage-600 px-5 py-2.5 text-sm font-medium text-white transition hover:bg-sage-700 disabled:opacity-60"
          >
            {isPending ? "Confirmando…" : "Confirmar"}
          </button>

          {result && (
            <p className={result.ok ? "text-sm text-sage-700" : "text-sm text-red-600"}>
              {result.message}
            </p>
          )}
        </form>
      </div>
    </div>
  );
}
