const AVOID_ITEMS = [
  {
    title: "Ropa solo talle RN",
    detail: "Se usa poquísimo. Mejor 0-3, 3-6 o 6-9 meses.",
  },
  {
    title: "Peluches grandes",
    detail: "Ocupan lugar y no entran en la cuna el primer año.",
  },
  {
    title: "Juguetes para bebés de +6 meses",
    detail: "Todavía no los van a usar; después llegan muchos.",
  },
  {
    title: "Productos con perfume fuerte",
    detail: "La piel del recién nacido es sensible: preferí neutro / sin fragancia.",
  },
  {
    title: "Zapatos",
    detail: "Hasta que camine alcanzan medias y escarpines.",
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
          regalos. ¡Traé lo que quieras, con eso ya es más que suficiente!
        </p>
      </div>

      <div className="rounded-xl2 border border-ink-900/10 bg-white/70 px-5 py-4">
        <h2 className="font-serif text-lg text-ink-900">
          Preferimos que no traigan
        </h2>
        <p className="mt-1 text-xs text-ink-700">
          Ideas típicas que suelen sobrar o no sirven al principio:
        </p>
        <ul className="mt-3 space-y-2.5">
          {AVOID_ITEMS.map((item) => (
            <li key={item.title} className="flex gap-3 text-sm">
              <span
                aria-hidden
                className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-ink-900/10 text-[11px] font-semibold text-ink-700"
              >
                ×
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
