import Link from "next/link";
import LogoutButton from "@/components/LogoutButton";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen">
      <header className="border-b border-ink-900/10 bg-white/50">
        <div className="mx-auto flex max-w-4xl items-center justify-between px-6 py-4">
          <Link href="/dashboard" className="font-serif text-lg text-sage-700">
            Baby Wishlist
          </Link>
          <nav className="flex items-center gap-4 text-sm">
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
            <LogoutButton />
          </nav>
        </div>
      </header>
      <main className="mx-auto max-w-4xl px-6 py-10">{children}</main>
    </div>
  );
}
