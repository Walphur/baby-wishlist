/** Marcador en notes para el selector de ropa a elección. */
export const CLOTHING_PICKER_TAG = "[[clothing-picker]]";

/** Aviso suave cuando varios ya eligieron el mismo tipo. */
export const CLOTHING_SOFT_ALERT_AT = 3;

export const CLOTHING_SIZES = [
  "0-3 meses",
  "3-6 meses",
  "6-9 meses",
  "9-12 meses",
  "1 año",
] as const;

export const CLOTHING_TYPES = [
  "Body",
  "Pijama",
  "Enterito",
  "Conjunto",
  "Campera / abrigo",
  "Gorrito",
  "Medias / escarpines",
] as const;

export const CLOTHING_SLEEVES = ["Manga corta", "Manga larga", "Indistinto"] as const;

export function isClothingPickerGift(gift: {
  notes?: string | null;
  name?: string | null;
}) {
  if ((gift.notes ?? "").includes(CLOTHING_PICKER_TAG)) return true;
  return (gift.name ?? "").toLowerCase().includes("ropa a elección");
}

export function formatClothingChoice(input: {
  type: string;
  size: string;
  sleeve?: string;
}) {
  const parts = [input.type];
  if (input.sleeve && input.sleeve !== "Indistinto") parts.push(input.sleeve);
  parts.push(`talle ${input.size}`);
  return `Ropa: ${parts.join(" · ")}`;
}

/** Extrae el tipo desde "Ropa: Pijama · …" o desde una elección pendiente. */
export function parseClothingType(name: string | null | undefined): string | null {
  if (!name) return null;
  const match = name.match(/^Ropa:\s*([^·]+)/i);
  if (match) return match[1].trim();
  for (const type of CLOTHING_TYPES) {
    if (name.toLowerCase().includes(type.toLowerCase())) return type;
  }
  return null;
}

/**
 * Cuenta cuántos ya llevan cada tipo de ropa (confirmados + elecciones locales).
 * La ropa es ilimitada: esto solo sirve para avisos suaves.
 */
export function countClothingByType(
  gifts: { name: string; claimed?: boolean; claimedCount?: number }[],
  pendingLabels: string[] = []
) {
  const counts = new Map<string, number>();

  for (const gift of gifts) {
    if (isClothingPickerGift(gift)) continue;
    const type = parseClothingType(gift.name);
    if (!type) continue;
    const n = gift.claimedCount ?? (gift.claimed ? 1 : 0);
    if (n <= 0) continue;
    counts.set(type, (counts.get(type) ?? 0) + n);
  }

  for (const label of pendingLabels) {
    const type = parseClothingType(label);
    if (!type) continue;
    counts.set(type, (counts.get(type) ?? 0) + 1);
  }

  return counts;
}
