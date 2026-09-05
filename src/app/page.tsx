import Link from "next/link";
import Image from "next/image";
import DecorativeBlobs from "@/components/DecorativeBlobs";
import FloatingBear from "@/components/FloatingBear";
import RevealOnScroll from "@/components/RevealOnScroll";

const STEPS = [
  {
    number: "1",
    title: "Entrá con Google",
    text: "Sin contraseña ni formularios eternos. En un minuto ya estás adentro.",
    accent: "text-sage-600",
  },
  {
    number: "2",
    title: "Armá la lista",
    text: "Te dejamos una base de regalos. La editás, sumás lo que falte y listo.",
    accent: "text-terracotta-500",
  },
  {
    number: "3",
    title: "Compartí el link",
    text: "Tus invitados marcan qué llevan. Nadie se pisa un regalo y no necesitan cuenta.",
    accent: "text-gold-600",
  },
];

export default function LandingPage() {
  return (
    <main className="relative overflow-x-hidden">
      <DecorativeBlobs />

      <header className="relative z-20 mx-auto flex max-w-5xl items-center justify-between px-5 pt-6 sm:px-8">
        <Image
          src="/brand/wordmark.png"
          alt="Baby Wishlist"
          width={180}
          height={60}
          className="h-10 w-auto sm:h-12"
          priority
        />
        <Link
          href="/login"
          className="rounded-full border border-ink-900/15 bg-white/80 px-5 py-2.5 text-sm font-medium text-ink-800 shadow-sm transition hover:bg-white sm:px-6 sm:text-base"
        >
          Iniciar sesión
        </Link>
      </header>

      <section className="relative z-10 flex min-h-[calc(100svh-5.5rem)] items-center px-4 pb-10 sm:px-8">
        <div className="mx-auto grid w-fit max-w-[92vw] grid-cols-2 items-center gap-x-3 gap-y-6 sm:grid-cols-[auto_auto_auto] sm:gap-x-5 lg:gap-x-6">
          <FloatingBear
            variant="bear"
            motion="float"
            className="h-28 w-28 justify-self-end sm:h-40 sm:w-40 lg:h-48 lg:w-48"
          />
          <FloatingBear
            variant="fox"
            motion="float-delay"
            className="h-40 w-40 justify-self-start sm:col-start-3 sm:row-start-1 sm:h-64 sm:w-64 lg:h-[22rem] lg:w-[22rem]"
          />
          <div className="col-span-2 max-w-md text-center sm:col-span-1 sm:col-start-2 sm:row-start-1 sm:max-w-lg">
            <h1 className="font-serif text-3xl leading-[1.15] text-ink-900 sm:text-5xl lg:text-[3.35rem]">
              Una lista de regalos para recibir a tu bebé.
            </h1>
            <p className="mt-5 text-sm text-ink-700 sm:text-base">
              Clara, compartible y sin vueltas. Para papás, padrinos y quien
              organice el encuentro.
            </p>
            <Link
              href="/login"
              className="mt-8 inline-flex rounded-full bg-ink-900 px-8 py-3.5 text-sm font-medium text-cream-50 shadow-sm transition hover:bg-ink-800"
            >
              Crear mi lista
            </Link>
            <div className="mt-12 flex flex-col items-center gap-2">
              <p className="text-xs tracking-wide text-ink-700/80">
                Deslizá para ver cómo se usa
              </p>
              <span aria-hidden="true" className="scroll-nudge text-2xl text-sage-600">
                ↓
              </span>
            </div>
          </div>
        </div>
      </section>

      <section className="relative z-10 mx-auto flex min-h-[85svh] max-w-4xl flex-col justify-center px-6 py-20">
        <RevealOnScroll>
          <h2 className="text-center font-serif text-3xl text-ink-900 sm:text-4xl">
            Cómo se usa
          </h2>
          <p className="mx-auto mt-3 max-w-xl text-center text-sm text-ink-700">
            Tres pasos. El resto lo hace la página.
          </p>
        </RevealOnScroll>
        <div className="mt-14 grid gap-10 sm:grid-cols-3">
          {STEPS.map((step, index) => (
            <RevealOnScroll key={step.title} delayMs={index * 160}>
              <div className="rounded-xl2 border border-ink-900/10 bg-white/70 p-6">
                <span className={`font-serif text-3xl ${step.accent}`}>
                  {step.number}
                </span>
                <h3 className="mt-3 font-medium text-ink-900">{step.title}</h3>
                <p className="mt-2 text-sm leading-relaxed text-ink-700">
                  {step.text}
                </p>
              </div>
            </RevealOnScroll>
          ))}
        </div>
      </section>

      <section className="relative z-10 mx-auto flex min-h-[70svh] max-w-3xl flex-col justify-center px-6 py-20">
        <RevealOnScroll>
          <div className="rounded-xl2 border border-ink-900/10 bg-white/70 p-7 sm:p-10">
            <h2 className="font-serif text-2xl text-ink-900 sm:text-3xl">
              Pensada para quien organiza
            </h2>
            <ul className="mt-6 space-y-4 text-sm leading-relaxed text-ink-700 sm:text-base">
              <li>Un solo link para WhatsApp. Los invitados no crean cuenta.</li>
              <li>Cada regalo se marca una vez, en privado. Nadie se pisa.</li>
              <li>
                Podés invitar al papá, a la mamá o a los padrinos al mismo
                panel, con su propio Google.
              </li>
              <li>Sin tarjeta y sin suscripción. Se sostiene porque es simple.</li>
            </ul>
          </div>
        </RevealOnScroll>
      </section>

      <footer className="relative z-10 border-t border-ink-900/10 px-6 py-8 text-center text-xs text-ink-700">
        Baby Wishlist — hecho con cariño para futuras familias.
      </footer>
    </main>
  );
}
