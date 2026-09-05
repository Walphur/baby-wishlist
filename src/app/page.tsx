import Link from "next/link";

export default function LandingPage() {
  return (
    <main>
      <section className="mx-auto flex max-w-3xl flex-col items-center px-6 pt-24 pb-16 text-center">
        <span className="rounded-full bg-sage-100 px-4 py-1 text-xs font-medium tracking-wide text-sage-700">
          100% gratis
        </span>
        <h1 className="mt-6 font-serif text-4xl leading-tight text-ink-900 sm:text-5xl">
          La lista de regalos de tu baby shower,
          <br className="hidden sm:block" /> simple y sin gastar un peso.
        </h1>
        <p className="mt-5 max-w-xl text-base text-ink-700">
          Creá tu página en un minuto, cargá los datos del bebé o la beba y
          compartí un link con tus invitados. Ellos marcan de forma anónima
          qué van a llevar, así no se repiten regalos.
        </p>
        <div className="mt-8 flex flex-col gap-3 sm:flex-row">
          <Link
            href="/login"
            className="rounded-xl2 bg-ink-900 px-8 py-3.5 text-sm font-medium text-cream-50 transition hover:bg-ink-800"
          >
            Crear mi lista gratis
          </Link>
        </div>
      </section>

      <section className="mx-auto max-w-4xl px-6 py-16">
        <div className="grid gap-8 sm:grid-cols-3">
          <Step
            number="1"
            title="Creá tu cuenta"
            text="Iniciá sesión con Google, sin contraseñas ni pagos."
          />
          <Step
            number="2"
            title="Cargá los datos"
            text="Nombre, fecha, lugar y tu propia lista de regalos (te damos una base para empezar)."
          />
          <Step
            number="3"
            title="Compartí el link"
            text="Tus invitados marcan qué van a llevar, o agregan otra cosa si prefieren."
          />
        </div>
      </section>

      <section className="mx-auto max-w-2xl px-6 pb-24">
        <div className="rounded-xl2 border border-ink-900/10 bg-white/60 p-6 text-center text-sm text-ink-700">
          Sabemos que existen otras páginas para esto, pero suelen ser
          pagas. Esta idea nació para que armar la lista del baby shower no
          le cueste dinero a nadie.
        </div>
      </section>

      <footer className="border-t border-ink-900/10 px-6 py-8 text-center text-xs text-ink-700">
        Baby Wishlist — hecho con cariño para futuras familias.
      </footer>
    </main>
  );
}

function Step({
  number,
  title,
  text,
}: {
  number: string;
  title: string;
  text: string;
}) {
  return (
    <div className="text-left">
      <span className="font-serif text-2xl text-sage-600">{number}</span>
      <h3 className="mt-2 font-medium text-ink-900">{title}</h3>
      <p className="mt-1 text-sm text-ink-700">{text}</p>
    </div>
  );
}
