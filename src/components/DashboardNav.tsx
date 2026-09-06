"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useTransition } from "react";

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
  const router = useRouter();
  const [isPending, startTransition] = useTransition();

  function go(href: string) {
    startTransition(() => {
      router.push(href);
    });
  }

  return (
    <nav
      className={`flex w-full flex-wrap items-center gap-2 sm:w-auto ${
        isPending ? "opacity-70" : ""
      }`}
      aria-busy={isPending}
    >
      {LINKS.map((link) => {
        const active = link.exact
          ? pathname === link.href
          : pathname.startsWith(link.href);
        return (
          <Link
            key={link.href}
            href={link.href}
            onClick={(event) => {
              if (
                event.metaKey ||
                event.ctrlKey ||
                event.shiftKey ||
                event.altKey ||
                event.button !== 0
              ) {
                return;
              }
              event.preventDefault();
              go(link.href);
            }}
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
          onClick={(event) => {
            if (
              event.metaKey ||
              event.ctrlKey ||
              event.shiftKey ||
              event.altKey ||
              event.button !== 0
            ) {
              return;
            }
            event.preventDefault();
            go("/admin");
          }}
          className={`rounded-full px-3 py-1.5 text-sm transition ${
            pathname.startsWith("/admin")
              ? "bg-sage-600 text-cream-50"
              : "bg-sage-100 text-sage-700 hover:bg-sage-200"
          }`}
        >
          Admin
        </Link>
      )}
      {isPending && (
        <span className="text-xs text-ink-700">Cargando…</span>
      )}
    </nav>
  );
}
