import { cookies } from "next/headers";
import { createServerClient, type CookieOptionsWithName } from "@supabase/ssr";

type CookieToSet = { name: string; value: string; options?: CookieOptionsWithName };

// Cliente para Server Components / Server Actions del dashboard: usa la sesión
// del usuario (cookies) y respeta las policies de RLS (solo ve/edita lo suyo).
export async function createClient() {
  const cookieStore = await cookies();

  return createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return cookieStore.getAll();
        },
        setAll(cookiesToSet: CookieToSet[]) {
          try {
            cookiesToSet.forEach(({ name, value, options }) =>
              cookieStore.set(name, value, options)
            );
          } catch {
            // Se llamó desde un Server Component sin permiso de escritura de cookies;
            // el middleware se encarga de refrescar la sesión en ese caso.
          }
        },
      },
    }
  );
}
