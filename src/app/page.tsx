import Link from "next/link";
import Image from "next/image";
import DecorativeBlobs from "@/components/DecorativeBlobs";
import FloatingBear from "@/components/FloatingBear";
import RevealOnScroll from "@/components/RevealOnScroll";
import DonateButton from "@/components/DonateButton";

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
        <div className="relative mx-auto w-full max-w-5xl">
          <div className="pointer-events-none absolute left-2 top-1/2 hidden -translate-y-1/2 sm:block lg:left-6">
            <FloatingBear
              variant="bear"
              motion="float"
              className="h-40 w-40 lg:h-52 lg:w-52"
            />
          </div>
          <div className="pointer-events-none absolute right-0 top-1/2 hidden -translate-y-1/2 sm:block lg:right-2">
            <FloatingBear
              variant="fox"
              motion="float-delay"
              className="h-52 w-52 lg:h-64 lg:w-64"
            />
          </div>
          <div className="mb-6 flex items-end justify-center gap-8 sm:hidden">
            <FloatingBear
              variant="bear"
              motion="float"
              className="h-24 w-24"
            />
            <FloatingBear
              variant="fox"
              motion="float-delay"
              className="h-32 w-32"
            />
          </div>
          <div className="relative z-10 mx-auto max-w-xl px-4 text-center sm:px-28">
            <h1 className="font-serif text-3xl leading-[1.15] text-ink-900 sm:text-5xl lg:text-[3.35rem]">
              Una lista de regalos para recibir a tu bebé.
            </h1>
            <p className="mx-auto mt-5 max-w-md text-sm text-ink-700 sm:text-base">
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

      <section className="relative z-10 mx-auto max-w-xl px-6 pb-8 pt-4">
        <RevealOnScroll className="text-center">
          <h2 className="font-serif text-3xl text-ink-900 sm:text-4xl">
            Cómo se usa
          </h2>
          <p className="mx-auto mt-3 text-sm text-ink-700">
            Tres pasos. El resto lo hace la página.
          </p>
        </RevealOnScroll>
        <div className="mt-8 space-y-5">
          {STEPS.map((step) => (
            <RevealOnScroll key={step.title} shift={56}>
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

      <section className="relative z-10 mx-auto max-w-xl px-6 pb-16 pt-2">
        <div className="rounded-xl2 border border-ink-900/10 bg-white/70 p-7 sm:p-10">
          <RevealOnScroll>
            <h2 className="font-serif text-2xl text-ink-900 sm:text-3xl">
              Pensada para quien organiza
            </h2>
          </RevealOnScroll>
          <ul className="mt-6 space-y-4 text-sm leading-relaxed text-ink-700 sm:text-base">
            {[
              "Un solo link para WhatsApp. Los invitados no crean cuenta.",
              "Cada regalo se marca una vez, en privado. Nadie se pisa.",
              "Podés invitar al papá, a la mamá o a los padrinos al mismo panel, con su propio Google.",
              "Sin tarjeta y sin suscripción. Se sostiene porque es simple.",
            ].map((item) => (
              <li key={item}>
                <RevealOnScroll shift={36}>{item}</RevealOnScroll>
              </li>
            ))}
          </ul>
        </div>
        <div className="mt-6">
          <DonateButton variant="card" />
        </div>
      </section>

      <footer className="relative z-10 border-t border-ink-900/10 px-6 py-8 text-center text-xs text-ink-700">
        <p>Baby Wishlist — hecho con cariño para futuras familias.</p>
        <div className="mt-3">
          <DonateButton variant="quiet" />
        </div>
      </footer>
    </main>
  );
}
