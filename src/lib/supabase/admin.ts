import "server-only";
import { createClient as createSupabaseClient } from "@supabase/supabase-js";

// Cliente con la service role key: bypassa RLS por completo.
// SOLO se debe usar en Server Actions / Route Handlers, nunca en código
// que se envuelva en un Client Component. `server-only` hace fallar el build
// si esto se llega a importar accidentalmente desde el navegador.
export function createAdminClient() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

  if (!url || !serviceKey) {
    throw new Error(
      "Faltan las variables de entorno de Supabase (SUPABASE_SERVICE_ROLE_KEY)."
    );
  }

  return createSupabaseClient(url, serviceKey, {
    auth: { autoRefreshToken: false, persistSession: false },
  });
}
