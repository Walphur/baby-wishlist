"use client";

import { useEffect, useState } from "react";
import { MP_DONATION_URL } from "@/lib/donation";

type DonateButtonProps = {
  variant?: "card" | "footer" | "quiet";
};

export default function DonateButton({ variant = "footer" }: DonateButtonProps) {
  const [open, setOpen] = useState(false);

  useEffect(() => {
    if (!open) return;
    const onKey = (event: KeyboardEvent) => {
      if (event.key === "Escape") setOpen(false);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open]);

  if (!MP_DONATION_URL) return null;

  return (
    <>
      {variant === "card" ? (
        <div className="rounded-xl2 border border-ink-900/10 bg-white/70 p-6 text-center">
          <p className="font-serif text-xl text-ink-900">La web es gratis</p>
          <p className="mx-auto mt-2 max-w-sm text-sm text-ink-700">
            Si te sirvió para el baby shower, una donación por Mercado Pago
            ayuda a mantenerla.
          </p>
          <button
            type="button"
            onClick={() => setOpen(true)}
            className="mt-5 rounded-full bg-ink-900 px-6 py-2.5 text-sm font-medium text-cream-50 transition hover:bg-ink-800"
          >
            Donar con Mercado Pago
          </button>
        </div>
      ) : (
        <button
          type="button"
          onClick={() => setOpen(true)}
          className={
            variant === "quiet"
              ? "text-sm text-ink-700 underline decoration-ink-900/20 underline-offset-4 transition hover:text-ink-900"
              : "rounded-full border border-ink-900/15 bg-white/80 px-4 py-2 text-sm text-ink-800 transition hover:bg-white"
          }
        >
          Donar
        </button>
      )}

      {open && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-ink-900/40 px-4"
          onClick={() => setOpen(false)}
          role="presentation"
        >
          <div
            role="dialog"
            aria-modal="true"
            aria-labelledby="donate-title"
            className="w-full max-w-sm rounded-xl2 border border-ink-900/10 bg-cream-50 p-6 text-center shadow-lg"
            onClick={(event) => event.stopPropagation()}
          >
            <h2 id="donate-title" className="font-serif text-2xl text-ink-900">
              Gracias por sostenerla
            </h2>
            <p className="mt-2 text-sm text-ink-700">
              Escaneá el QR con Mercado Pago. En el celular también podés abrir
              el link.
            </p>
            <img
              src="/api/donation-qr"
              alt="QR para donar por Mercado Pago"
              width={280}
              height={280}
              className="mx-auto mt-5 h-56 w-56 rounded-xl2 border border-ink-900/10 bg-white p-3"
            />
            <a
              href={MP_DONATION_URL}
              target="_blank"
              rel="noreferrer"
              className="mt-5 inline-flex rounded-full bg-ink-900 px-5 py-2.5 text-sm font-medium text-cream-50 transition hover:bg-ink-800"
            >
              Abrir Mercado Pago
            </a>
            <button
              type="button"
              onClick={() => setOpen(false)}
              className="mt-3 block w-full text-sm text-ink-700 hover:text-ink-900"
            >
              Cerrar
            </button>
          </div>
        </div>
      )}
    </>
  );
}
