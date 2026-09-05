import { randomUUID } from "crypto";

// Genera un identificador corto, aleatorio y no adivinable para el link público del evento.
export function generateSlug(): string {
  return randomUUID().replace(/-/g, "").slice(0, 10);
}
