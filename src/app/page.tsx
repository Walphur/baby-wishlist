import Link from "next/link";
import Image from "next/image";
import DecorativeBlobs from "@/components/DecorativeBlobs";
import FloatingBear from "@/components/FloatingBear";

export default function LandingPage() {
  return (
    <main className="relative overflow-x-hidden">
      <DecorativeBlobs />
      <div
        aria-hidden="true"
        className="pointer-events-none absolute right-8 top-10 z-0 h-52 w-52 opacity-25 sm:right-16 sm:top-12 sm:h-[20rem] sm:w-[20rem] sm:opacity-30 lg:right-24 lg:top-14 lg:h-[26rem] lg:w-[26rem]"
      >
        <Image
          src="/brand/fox.png"
          alt=""
          fill
          sizes="(max-width: 640px) 13rem, (max-width: 1024px) 20rem, 26rem"
          className="object-contain object-center"
        />
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
      <section className="relative z-10 mx-auto flex max-w-3xl flex-col items-center px-6 pt-16 pb-16 text-center">
        <FloatingBear
          variant="bear"
          className="absolute left-2 top-8 hidden h-16 w-16 animate-float sm:block"
        />
        <FloatingBear
          variant="bear"
          className="absolute left-10 bottom-2 hidden h-11 w-11 animate-float-slow md:block"
        />
        <span className="rounded-full bg-sage-100 px-4 py-1 text-xs font-medium tracking-wide text-sage-700">
          100% gratis
        </span>
        <h1 className="mt-6 font-serif text-3xl leading-tight text-ink-900 sm:text-4xl lg:text-5xl">
          La lista de regalos de tu baby shower,
          <br className="hidden sm:block" /> simple y sin gastar un peso.
        </h1>
        <p className="mt-5 max-w-xl text-sm text-ink-700 sm:text-base">
          Creá tu página en un minuto, cargá los datos del bebé o la beba y
          compartí un link con tus invitados. Ellos marcan de forma anónima
          qué van a llevar, así no se repiten regalos.
        </p>
        <div className="mt-8 flex w-full flex-col gap-3 sm:w-auto sm:flex-row">
          <Link
            href="/login"
            className="rounded-xl2 bg-ink-900 px-8 py-3.5 text-sm font-medium text-cream-50 transition hover:bg-ink-800"
          >
            Crear mi lista gratis
          </Link>
        </div>
      </section>

      <section className="relative z-10 mx-auto max-w-4xl px-6 py-16">
        <div className="grid gap-8 sm:grid-cols-3">
          <Step
            number="1"
            title="Creá tu cuenta"
            text="Iniciá sesión con Google, sin contraseñas ni pagos."
            accent="text-sage-600"
          />
          <Step
            number="2"
            title="Cargá los datos"
            text="Nombre, fecha, lugar y tu propia lista de regalos (te damos una base para empezar)."
            accent="text-terracotta-500"
          />
          <Step
            number="3"
            title="Compartí el link"
            text="Tus invitados marcan qué van a llevar, o agregan otra cosa si prefieren."
            accent="text-gold-600"
          />
        </div>
      </section>

      <section className="relative z-10 mx-auto max-w-2xl px-6 pb-24">
        <div className="rounded-xl2 border border-ink-900/10 bg-white/60 p-6 text-center text-sm text-ink-700">
          Sabemos que existen otras páginas para esto, pero suelen ser
          pagas. Esta idea nació para que armar la lista del baby shower no
          le cueste dinero a nadie.
        </div>
      </section>

      <footer className="relative z-10 border-t border-ink-900/10 px-6 py-8 text-center text-xs text-ink-700">
        Baby Wishlist — hecho con cariño para futuras familias.
      </footer>
    </main>
  );
}

function Step({
  number,
  title,
  text,
  accent,
}: {
  number: string;
  title: string;
  text: string;
  accent: string;
}) {
  return (
    <div className="text-left">
      <span className={`font-serif text-2xl ${accent}`}>{number}</span>
      <h3 className="mt-2 font-medium text-ink-900">{title}</h3>
      <p className="mt-1 text-sm text-ink-700">{text}</p>
    </div>
  );
}
