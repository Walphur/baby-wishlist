"use client";

import { useEffect, useState } from "react";
import { MP_DONATION_ALIAS, MP_DONATION_QR_SRC } from "@/lib/donation";

type DonateButtonProps = {
  variant?: "card" | "footer" | "quiet";
};

export default function DonateButton({ variant = "footer" }: DonateButtonProps) {
  const [open, setOpen] = useState(false);
  const [copied, setCopied] = useState(false);
  const [hasOfficialQr, setHasOfficialQr] = useState(false);

  useEffect(() => {
    if (!open) return;
    const onKey = (event: KeyboardEvent) => {
      if (event.key === "Escape") setOpen(false);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open]);

  useEffect(() => {
    let cancelled = false;
    fetch(MP_DONATION_QR_SRC, { method: "HEAD" })
      .then((res) => {
        if (!cancelled) setHasOfficialQr(res.ok);
      })
      .catch(() => {
        if (!cancelled) setHasOfficialQr(false);
      });
    return () => {
      cancelled = true;
    };
  }, []);

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

  return (
    <>
      {variant === "card" ? (
        <div className="rounded-xl2 border border-ink-900/10 bg-white/70 p-6 text-center">
          <p className="font-serif text-xl text-ink-900">La web es gratis</p>
          <p className="mx-auto mt-2 max-w-sm text-sm text-ink-700">
            Si te sirvió, transferí al alias. Es envío de dinero, no un cobro:
            no come el 6,29%.
          </p>
          <button
            type="button"
            onClick={() => setOpen(true)}
            className="mt-5 rounded-full bg-ink-900 px-6 py-2.5 text-sm font-medium text-cream-50 transition hover:bg-ink-800"
          >
            Donar por alias
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
              En Mercado Pago tocá Transferir y pegá el alias. Así no te cobra
              comisión.
            </p>
            <p className="mt-5 font-serif text-2xl tracking-wide text-ink-900">
              {MP_DONATION_ALIAS}
            </p>
            {hasOfficialQr && (
              <img
                src={MP_DONATION_QR_SRC}
                alt="QR oficial de Mercado Pago para donar"
                width={280}
                height={280}
                className="mx-auto mt-4 h-52 w-52 rounded-xl2 border border-ink-900/10 bg-white p-3"
              />
            )}
            <button
              type="button"
              onClick={copyAlias}
              className="mt-5 inline-flex rounded-full bg-ink-900 px-5 py-2.5 text-sm font-medium text-cream-50 transition hover:bg-ink-800"
            >
              {copied ? "¡Alias copiado!" : "Copiar alias"}
            </button>
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
