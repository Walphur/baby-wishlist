"use client";

import { useRef, useState, useTransition } from "react";
import { submitRsvp } from "@/app/e/[slug]/actions";

export default function RsvpForm({
  slug,
  askPartySize = true,
}: {
  slug: string;
  askPartySize?: boolean;
}) {
  const formRef = useRef<HTMLFormElement>(null);
  const [isPending, startTransition] = useTransition();
  const [attending, setAttending] = useState<"yes" | "no">("yes");
  const [result, setResult] = useState<{ ok: boolean; message: string } | null>(null);

  function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    startTransition(async () => {
      const res = await submitRsvp(slug, formData);
      setResult(res);
      if (res.ok) formRef.current?.reset();
    });
  }

  return (
    <div className="rounded-xl2 border border-ink-900/10 bg-white/70 p-5">
      <h2 className="font-serif text-lg text-ink-900">¿Vas a poder venir?</h2>
      <p className="mt-1 text-sm text-ink-700">
        Contanos si nos vas a acompañar, nos ayuda mucho a organizarnos.
      </p>
      <form ref={formRef} onSubmit={handleSubmit} className="mt-4 space-y-3">
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
          {isPending ? "Enviando..." : "Confirmar"}
        </button>

        {result && (
          <p
            className={
              result.ok
                ? "text-sm text-sage-700"
                : "text-sm text-red-600"
            }
          >
            {result.message}
          </p>
        )}
      </form>
    </div>
  );
}
