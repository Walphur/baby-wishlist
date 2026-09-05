import Link from "next/link";
import GoogleLoginButton from "@/components/GoogleLoginButton";

export default function LoginPage() {
  return (
    <main className="flex min-h-screen items-center justify-center px-4">
      <div className="w-full max-w-sm rounded-xl2 border border-ink-900/10 bg-white/60 p-8 shadow-sm">
        <Link href="/" className="font-serif text-lg text-sage-700">
          Baby Wishlist
        </Link>
        <h1 className="mt-4 font-serif text-2xl text-ink-900">
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
