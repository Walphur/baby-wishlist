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
      <div
        aria-hidden="true"
        className="pointer-events-none absolute right-6 top-16 z-0 h-52 w-52 opacity-40 sm:right-12 sm:top-20 sm:h-[22rem] sm:w-[22rem] sm:opacity-50 lg:right-20 lg:top-24 lg:h-[28rem] lg:w-[28rem]"
      >
        <div className="relative h-full w-full animate-fox-float">
          <Image
            src="/brand/fox.png"
            alt=""
            fill
            sizes="(max-width: 640px) 13rem, (max-width: 1024px) 22rem, 28rem"
            className="object-contain object-center drop-shadow-lg"
          />
        </div>
      </div>
      <header className="relative z-10 mx-auto grid max-w-4xl grid-cols-[1fr_auto_1fr] items-center px-6 pt-8">
        <div />
        <Image
          src="/brand/wordmark.png"
          alt="Baby Wishlist"
          width={180}
          height={60}
          className="h-10 w-auto sm:h-12"
          priority
        />
        <div className="justify-self-end">
          <Link
            href="/login"
            className="rounded-xl2 border border-ink-900/15 bg-white/80 px-4 py-2.5 text-sm text-ink-800 transition hover:bg-ink-900/5 sm:px-5 sm:text-base"
          >
            Iniciar sesión
          </Link>
        </div>
      </header>

      <section className="relative z-10 mx-auto flex min-h-[calc(100svh-6rem)] max-w-3xl flex-col items-center justify-center px-6 pb-16 text-center">
        <FloatingBear
          variant="bear"
          className="absolute left-2 top-8 hidden h-16 w-16 animate-float sm:block"
        />
        <h1 className="font-serif text-4xl leading-[1.15] text-ink-900 sm:text-5xl lg:text-[3.4rem]">
          Una lista de regalos
          <br />
          para recibir a tu bebé.
        </h1>
        <p className="mt-5 max-w-md text-sm text-ink-700 sm:text-base">
          Clara, compartible y sin vueltas. Para papás, padrinos y quien
          organice el encuentro.
        </p>
        <div className="mt-8">
          <Link
            href="/login"
            className="rounded-xl2 bg-ink-900 px-8 py-3.5 text-sm font-medium text-cream-50 transition hover:bg-ink-800"
          >
            Crear mi lista
          </Link>
        </div>
        <p className="mt-10 text-xs tracking-wide text-ink-700/80">
          Deslizá para ver cómo se usa
        </p>
        <span
          aria-hidden="true"
          className="mt-2 inline-block animate-bounce text-sage-600"
        >
          ↓
        </span>
      </section>

      <section className="relative z-10 mx-auto max-w-4xl px-6 py-16">
        <RevealOnScroll>
          <h2 className="text-center font-serif text-2xl text-ink-900 sm:text-3xl">
            Cómo se usa
          </h2>
          <p className="mx-auto mt-3 max-w-xl text-center text-sm text-ink-700">
            Tres pasos. El resto lo hace la página: la lista, los invitados y
            que no se repitan los regalos.
          </p>
        </RevealOnScroll>
        <div className="mt-12 grid gap-8 sm:grid-cols-3">
          {STEPS.map((step, index) => (
            <RevealOnScroll key={step.title} delayMs={index * 140}>
              <div className="text-left">
                <span className={`font-serif text-2xl ${step.accent}`}>
                  {step.number}
                </span>
                <h3 className="mt-2 font-medium text-ink-900">{step.title}</h3>
                <p className="mt-1 text-sm leading-relaxed text-ink-700">
                  {step.text}
                </p>
              </div>
            </RevealOnScroll>
          ))}
        </div>
      </section>

      <section className="relative z-10 mx-auto max-w-3xl px-6 pb-24">
        <RevealOnScroll>
          <div className="rounded-xl2 border border-ink-900/10 bg-white/65 p-6 sm:p-8">
            <h2 className="font-serif text-xl text-ink-900 sm:text-2xl">
              Pensada para quien organiza
            </h2>
            <ul className="mt-5 space-y-3 text-sm leading-relaxed text-ink-700">
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
