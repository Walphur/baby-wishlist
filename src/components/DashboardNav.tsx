"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

const LINKS = [
  { href: "/dashboard", label: "Resumen", exact: true },
  { href: "/dashboard/perfil", label: "Evento" },
  { href: "/dashboard/regalos", label: "Regalos" },
  { href: "/dashboard/invitados", label: "Invitados" },
  { href: "/dashboard/equipo", label: "Equipo" },
];

export default function DashboardNav({
  isAdmin,
}: {
  isAdmin: boolean;
}) {
  const pathname = usePathname();

  return (
    <nav className="flex w-full flex-wrap items-center gap-2 sm:w-auto">
      {LINKS.map((link) => {
        const active = link.exact
          ? pathname === link.href
          : pathname.startsWith(link.href);
        return (
          <Link
            key={link.href}
            href={link.href}
            className={`rounded-full px-3 py-1.5 text-sm transition ${
              active
                ? "bg-ink-900 text-cream-50 shadow-sm"
                : "bg-white/70 text-ink-700 hover:bg-ink-900/5"
            }`}
          >
            {link.label}
          </Link>
        );
      })}
      {isAdmin && (
        <Link
          href="/admin"
          className={`rounded-full px-3 py-1.5 text-sm transition ${
            pathname.startsWith("/admin")
              ? "bg-sage-600 text-cream-50"
              : "bg-sage-100 text-sage-700 hover:bg-sage-200"
          }`}
        >
          Admin
        </Link>
      )}
    </nav>
  );
}
