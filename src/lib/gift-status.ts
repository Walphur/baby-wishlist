/** Marcador en notes para “ya lo tenemos” (funciona sin migración). */
export const ALREADY_HAVE_TAG = "[[ya-lo-tenemos]]";

export function isAlreadyHaveGift(gift: {
  notes?: string | null;
  already_have?: boolean | null;
}) {
  if (gift.already_have === true) return true;
  return (gift.notes ?? "").includes(ALREADY_HAVE_TAG);
}

export function visibleGiftNotes(notes: string | null | undefined) {
  if (!notes) return null;
  const cleaned = notes.split(ALREADY_HAVE_TAG).join("").trim();
  return cleaned || null;
}

export function withAlreadyHaveNotes(
  notes: string | null | undefined,
  alreadyHave: boolean
) {
  const base = visibleGiftNotes(notes);
  if (!alreadyHave) return base;
  return base ? `${ALREADY_HAVE_TAG} ${base}` : ALREADY_HAVE_TAG;
}
