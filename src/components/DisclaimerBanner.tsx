const GIFT_TIPS = [
  {
    title: "Sobre la ropa",
    detail:
      "Los talles a partir de 3-6 meses y 6-9 meses suelen usarse más. El RN se queda chico muy rápido.",
  },
  {
    title: "Si pensás en calzado",
    detail:
      "Hasta que camine, medias o escarpines suelen alcanzar mejor que zapatitos.",
  },
];

export default function DisclaimerBanner() {
  return (
    <div className="space-y-4">
      <div className="rounded-xl2 border border-gold-500/30 bg-gold-400/10 px-5 py-4 text-sm text-ink-800">
        <p>
          <span className="font-medium">Esta lista es solo una guía. </span>
          Nadie está obligado a traer algo de acá: es simplemente una ayuda
          para quien no sabe qué regalar y para evitar que se repitan
          regalos. Traé lo que prefieras: con tu presencia ya es más que
          suficiente.
        </p>
      </div>

      <div className="rounded-xl2 border border-ink-900/10 bg-white/70 px-5 py-4">
        <h2 className="font-serif text-lg text-ink-900">
          Tips para armar tu regalo
        </h2>
        <p className="mt-1 text-xs text-ink-700">
          Sugerencias suaves, por si te sirven a la hora de elegir:
        </p>
        <ul className="mt-3 space-y-2.5">
          {GIFT_TIPS.map((item) => (
            <li key={item.title} className="flex gap-3 text-sm">
              <span
                aria-hidden
                className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-sage-100 text-[11px] font-semibold text-sage-700"
              >
                ·
              </span>
              <div>
                <p className="font-medium text-ink-900">{item.title}</p>
                <p className="text-xs text-ink-700">{item.detail}</p>
              </div>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
