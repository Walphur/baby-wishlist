import { redirect } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { createClient } from "@/lib/supabase/server";
import { isAdminEmail } from "@/lib/admin";
import LogoutButton from "@/components/LogoutButton";

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) redirect("/login");
  if (!isAdminEmail(user.email)) redirect("/dashboard");

  return (
    <div className="min-h-screen">
      <header className="border-b border-ink-900/10 bg-white/50">
        <div className="mx-auto flex max-w-5xl items-center justify-between px-6 py-4">
          <Link href="/admin" className="flex items-center gap-3">
            <Image
              src="/brand/wordmark.png"
              alt="Baby Wishlist"
              width={150}
              height={50}
              className="h-9 w-auto"
              priority
            />
            <span className="rounded-full bg-ink-900 px-2.5 py-0.5 text-[10px] font-medium uppercase tracking-wide text-cream-50">
              Admin
            </span>
          </Link>
          <nav className="flex items-center gap-4 text-sm">
            <Link href="/dashboard" className="text-ink-700 hover:text-ink-900">
              Mi lista
            </Link>
            <LogoutButton />
          </nav>
        </div>
      </header>
      <main className="mx-auto max-w-5xl px-6 py-10">{children}</main>
    </div>
  );
}
