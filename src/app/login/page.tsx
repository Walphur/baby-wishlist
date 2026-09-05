import Link from "next/link";
import Image from "next/image";
import GoogleLoginButton from "@/components/GoogleLoginButton";
import DecorativeBlobs from "@/components/DecorativeBlobs";
import FloatingBear from "@/components/FloatingBear";

export default function LoginPage() {
  return (
    <main className="relative flex min-h-screen items-center justify-center overflow-hidden px-4">
      <DecorativeBlobs />
      <FloatingBear
        variant="bear"
        className="absolute left-8 top-12 hidden h-32 w-32 animate-float sm:block lg:left-16 lg:h-44 lg:w-44"
      />
      <FloatingBear
        variant="fox"
        className="absolute right-10 bottom-14 hidden h-28 w-28 animate-float-delay sm:block lg:right-20 lg:bottom-16 lg:h-40 lg:w-40"
      />
      <div className="w-full max-w-sm rounded-xl2 border border-ink-900/10 bg-white/60 p-8 text-center shadow-sm">
        <Link href="/" className="mx-auto flex w-full justify-center">
          <Image
            src="/brand/wordmark.png"
            alt="Baby Wishlist"
            width={280}
            height={92}
            className="mx-auto h-[4.5rem] w-auto sm:h-24"
            priority
          />
        </Link>
        <h1 className="mt-6 font-serif text-3xl text-ink-900">
          Iniciá sesión
        </h1>
        <p className="mt-2 text-sm text-ink-700">
          Usá tu cuenta de Google para crear y administrar la lista de tu
          baby shower. Es gratis, no pedimos tarjeta ni contraseña.
        </p>
        <div className="mt-6">
          <GoogleLoginButton />
        </div>
      </div>
    </main>
  );
}

