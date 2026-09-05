import Link from "next/link";
import Image from "next/image";
import LogoutButton from "@/components/LogoutButton";
import { createClient } from "@/lib/supabase/server";
import { isAdminEmail } from "@/lib/admin";

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  return (
    <div className="min-h-screen">
      <header className="border-b border-ink-900/10 bg-white/50">
        <div className="mx-auto flex max-w-4xl flex-col gap-3 px-4 py-4 sm:flex-row sm:items-center sm:justify-between sm:px-6">
          <Link href="/dashboard" className="block">
            <Image
              src="/brand/wordmark.png"
              alt="Baby Wishlist"
              width={150}
              height={50}
              className="h-9 w-auto sm:h-10"
              priority
            />
          </Link>
          <nav className="flex flex-wrap items-center gap-x-4 gap-y-2 text-sm">
            <Link href="/dashboard" className="text-ink-700 hover:text-ink-900">
              Resumen
            </Link>
            <Link href="/dashboard/perfil" className="text-ink-700 hover:text-ink-900">
              Datos del evento
            </Link>
            <Link href="/dashboard/regalos" className="text-ink-700 hover:text-ink-900">
              Lista de regalos
            </Link>
            <Link href="/dashboard/invitados" className="text-ink-700 hover:text-ink-900">
              Invitados
            </Link>
            <Link href="/dashboard/equipo" className="text-ink-700 hover:text-ink-900">
              Equipo
            </Link>
            {isAdminEmail(user?.email) && (
              <Link href="/admin" className="font-medium text-sage-700 hover:text-sage-800">
                Admin
              </Link>
            )}
            <LogoutButton />
          </nav>
        </div>
      </header>
      <main className="mx-auto max-w-4xl px-6 py-10">{children}</main>
    </div>
  );
}
