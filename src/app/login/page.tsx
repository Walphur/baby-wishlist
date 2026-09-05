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
        motion="float"
        className="absolute left-3 top-8 h-24 w-24 sm:left-10 sm:top-12 sm:h-36 sm:w-36 lg:left-16 lg:h-44 lg:w-44"
      />
      <FloatingBear
        variant="fox"
        motion="float-delay"
        className="absolute right-3 bottom-8 h-24 w-24 sm:right-10 sm:bottom-14 sm:h-36 sm:w-36 lg:right-16 lg:h-44 lg:w-44"
      />
      <div className="relative z-10 w-full max-w-sm rounded-xl2 border border-ink-900/10 bg-white/70 p-8 text-center shadow-sm">
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
          Usá tu cuenta de Google para crear y administrar la lista. Sin
          tarjeta ni contraseña.
        </p>
        <div className="mt-6">
          <GoogleLoginButton />
        </div>
      </div>
    </main>
  );
}
