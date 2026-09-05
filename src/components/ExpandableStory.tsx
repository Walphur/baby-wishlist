"use client";

import { useEffect, useRef, useState } from "react";

const STORY = [
  "Creá tu página en un minuto, cargá los datos del bebé o la beba y compartí un link con tus invitados.",
  "Ellos marcan de forma anónima qué van a llevar, así no se repiten regalos. Si prefieren otra cosa, también pueden proponerla.",
  "Es gratis: no pedimos tarjeta, ni contraseña, ni suscripción. Iniciás sesión con Google y listo.",
];

// Descripción plegada que se abre sola al scrollear, y se puede cerrar de nuevo.
export default function ExpandableStory() {
  const ref = useRef<HTMLDivElement>(null);
  const [open, setOpen] = useState(false);
  const [entered, setEntered] = useState(false);

  useEffect(() => {
    const node = ref.current;
    if (!node) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (!entry.isIntersecting) return;
        setEntered(true);
        if (entry.intersectionRatio >= 0.55) {
          setOpen(true);
          observer.disconnect();
        }
      },
      { threshold: [0.2, 0.55], rootMargin: "-12% 0px -8% 0px" }
    );

    observer.observe(node);
    return () => observer.disconnect();
  }, []);

  return (
    <div
      ref={ref}
      className={`reveal-on-scroll mx-auto w-full max-w-2xl ${entered ? "is-visible" : ""}`}
    >
      <div className="overflow-hidden rounded-xl2 border border-ink-900/10 bg-white/70 shadow-sm">
        <button
          type="button"
          onClick={() => setOpen((value) => !value)}
          aria-expanded={open}
          className="flex w-full items-center justify-between gap-4 px-5 py-4 text-left sm:px-6"
        >
          <span>
            <span className="block font-serif text-xl text-ink-900">
              ¿Cómo funciona?
            </span>
            <span className="mt-1 block text-sm text-ink-700">
              La idea completa, en tres párrafos.
            </span>
          </span>
          <span
            aria-hidden="true"
            className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-sage-100 text-sage-700 transition-transform duration-500 ${
              open ? "rotate-180" : "rotate-0"
            }`}
          >
            <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
              <path
                d="M4 6.5 8 10.5 12 6.5"
                stroke="currentColor"
                strokeWidth="1.8"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </span>
        </button>

        <div
          className={`grid transition-[grid-template-rows] duration-700 ease-[cubic-bezier(0.22,1,0.36,1)] ${
            open ? "grid-rows-[1fr]" : "grid-rows-[0fr]"
          }`}
        >
          <div className="overflow-hidden">
            <div className="space-y-3 border-t border-ink-900/10 px-5 py-5 text-sm leading-relaxed text-ink-700 sm:px-6 sm:text-base">
              {STORY.map((paragraph, index) => (
                <p
                  key={paragraph}
                  className={`transition-all duration-700 ${
                    open
                      ? "translate-y-0 opacity-100"
                      : "translate-y-3 opacity-0"
                  }`}
                  style={{ transitionDelay: open ? `${120 + index * 90}ms` : "0ms" }}
                >
                  {paragraph}
                </p>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
