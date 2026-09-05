import Link from "next/link";
import Image from "next/image";
import GoogleLoginButton from "@/components/GoogleLoginButton";
import DecorativeBlobs from "@/components/DecorativeBlobs";
import FloatingBear from "@/components/FloatingBear";

export default function LoginPage() {
  return (
    <main className="relative flex min-h-screen items-center justify-center overflow-hidden px-4">
      <DecorativeBlobs />
      <div className="relative z-10 flex w-full max-w-4xl flex-col items-center justify-center gap-6 sm:flex-row sm:gap-8">
        <FloatingBear
          variant="bear"
          motion="float"
          className="h-24 w-24 shrink-0 sm:h-36 sm:w-36 lg:h-44 lg:w-44"
        />
        <div className="w-full max-w-sm rounded-xl2 border border-ink-900/10 bg-white/70 p-8 text-center shadow-sm">
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
        <FloatingBear
          variant="fox"
          motion="float-delay"
          className="h-28 w-28 shrink-0 sm:h-40 sm:w-40 lg:h-48 lg:w-48"
        />
      </div>
    </main>
  );
}
