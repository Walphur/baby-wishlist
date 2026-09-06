"use client";

import { useEffect, useState } from "react";
import { createPortal } from "react-dom";
import { MP_DONATION_ALIAS, MP_DONATION_QR_SRC } from "@/lib/donation";

type DonateButtonProps = {
  variant?: "card" | "footer" | "quiet";
};

export default function DonateButton({ variant = "footer" }: DonateButtonProps) {
  const [open, setOpen] = useState(false);
  const [copied, setCopied] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (!open) return;
    const onKey = (event: KeyboardEvent) => {
      if (event.key === "Escape") setOpen(false);
    };
    const previous = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    window.addEventListener("keydown", onKey);
    return () => {
      document.body.style.overflow = previous;
      window.removeEventListener("keydown", onKey);
    };
  }, [open]);

  if (!MP_DONATION_ALIAS) return null;

  async function copyAlias() {
    try {
      await navigator.clipboard.writeText(MP_DONATION_ALIAS);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      // clipboard no disponible
    }
  }

  const donateClass =
    variant === "quiet"
      ? "rounded-full bg-sage-600 px-4 py-2 text-sm font-medium text-white transition hover:bg-sage-700"
      : "rounded-full bg-sage-600 px-6 py-2.5 text-sm font-medium text-white transition hover:bg-sage-700";

  const modal =
    mounted &&
    open &&
    createPortal(
      <div
        className="fixed inset-0 z-[100] flex items-center justify-center bg-ink-900/50 p-4"
        onClick={() => setOpen(false)}
        role="presentation"
      >
        <div
          role="dialog"
          aria-modal="true"
          aria-labelledby="donate-title"
          className="relative w-full max-w-sm rounded-xl2 bg-cream-50 p-6 pt-12 text-center shadow-xl"
          onClick={(event) => event.stopPropagation()}
        >
          <button
            type="button"
            onClick={() => setOpen(false)}
            aria-label="Cerrar"
            className="absolute right-3 top-3 flex h-9 w-9 items-center justify-center rounded-full text-2xl leading-none text-ink-700 transition hover:bg-ink-900/5"
          >
            ×
          </button>
          <h2 id="donate-title" className="font-serif text-2xl text-ink-900">
            Gracias
          </h2>
          <p className="mt-2 text-sm text-ink-700">
            Esta web se hace con cariño. Si te sirvió, cualquier donación para
            mantenerla se agradece.
          </p>
          <img
            src={MP_DONATION_QR_SRC}
            alt="QR oficial de Mercado Pago para donar"
            width={280}
            height={280}
            className="mx-auto mt-5 h-52 w-52 rounded-xl2 border border-ink-900/10 bg-white p-3"
          />
          <p className="mt-4 font-serif text-2xl tracking-wide text-ink-900">
            {MP_DONATION_ALIAS}
          </p>
          <button
            type="button"
            onClick={copyAlias}
            className="mt-5 inline-flex rounded-full bg-sage-600 px-5 py-2.5 text-sm font-medium text-white transition hover:bg-sage-700"
          >
            {copied ? "¡Alias copiado!" : "Copiar alias"}
          </button>
        </div>
      </div>,
      document.body
    );

  return (
    <>
      {variant === "card" ? (
        <div className="rounded-xl2 border border-ink-900/10 bg-white/70 p-6 text-center">
          <p className="font-serif text-xl text-ink-900">Hecha con cariño</p>
          <p className="mx-auto mt-2 max-w-sm text-sm text-ink-700">
            Baby Wishlist es gratis. Si te sirvió y querés donar algo para
            mantenerla, se agradece un montón.
          </p>
          <button
            type="button"
            onClick={() => setOpen(true)}
            className={`mt-5 ${donateClass}`}
          >
            Donar
          </button>
        </div>
      ) : (
        <button
          type="button"
          onClick={() => setOpen(true)}
          className={donateClass}
        >
          Donar
        </button>
      )}
      {modal}
    </>
  );
}
