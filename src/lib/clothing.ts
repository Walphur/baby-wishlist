/** Marcador en notes para el selector de ropa a elección. */
export const CLOTHING_PICKER_TAG = "[[clothing-picker]]";

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
