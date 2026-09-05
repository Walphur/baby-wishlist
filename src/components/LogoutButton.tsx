"use client";

import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";

export default function LogoutButton() {
  const router = useRouter();

  async function handleLogout() {
    const supabase = createClient();
    await supabase.auth.signOut();
    router.push("/");
    router.refresh();
  }

  return (
    <button
      onClick={handleLogout}
      className="rounded-lg border border-ink-900/15 px-4 py-2 text-sm text-ink-700 transition hover:bg-ink-900/5"
    >
      Cerrar sesión
    </button>
  );
}
