"use client";

import { useFormStatus } from "react-dom";

/** Overlay de carga sobre la previa mientras el server genera la invitación. */
export default function GeneratingInvitationOverlay() {
  const { pending } = useFormStatus();
  if (!pending) return null;

  return (
    <div
      className="absolute inset-0 z-10 flex flex-col items-center justify-center gap-3 rounded-xl2 bg-ink-900/55 px-6 text-center backdrop-blur-[2px]"
      role="status"
      aria-live="polite"
    >
      <span
        className="h-9 w-9 animate-spin rounded-full border-2 border-cream-50/30 border-t-cream-50"
        aria-hidden="true"
      />
      <p className="font-serif text-lg text-cream-50">Generando la imagen…</p>
      <p className="max-w-xs text-xs text-cream-100/90">
        La IA está completando la tarjeta. Puede tardar unos segundos, no cierres
        la página.
      </p>
    </div>
  );
}
