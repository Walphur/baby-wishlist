import Link from "next/link";
import Image from "next/image";
import LogoutButton from "@/components/LogoutButton";
import DashboardNav from "@/components/DashboardNav";
import DonateButton from "@/components/DonateButton";
import NavigationProgress from "@/components/NavigationProgress";
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
      <NavigationProgress />
      <header className="sticky top-0 z-20 border-b border-ink-900/10 bg-white/80 backdrop-blur-md">
        <div className="mx-auto flex max-w-4xl flex-col gap-4 px-4 py-4 sm:px-6">
          <div className="flex items-center justify-between gap-3">
            <Link href="/dashboard" className="shrink-0">
              <Image
                src="/brand/wordmark.png"
                alt="Baby Wishlist"
                width={150}
                height={50}
                className="h-9 w-auto sm:h-10"
                priority
              />
            </Link>
            <LogoutButton />
          </div>
          <DashboardNav isAdmin={isAdminEmail(user?.email)} />
        </div>
      </header>
      <main className="mx-auto max-w-4xl px-4 py-8 sm:px-6 sm:py-10">{children}</main>
      <footer className="mx-auto max-w-4xl px-4 pb-8 text-center sm:px-6">
        <DonateButton variant="quiet" />
      </footer>
    </div>
  );
}
