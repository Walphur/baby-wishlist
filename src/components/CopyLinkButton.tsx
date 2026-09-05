"use client";

import { useState } from "react";

export default function CopyLinkButton({ link }: { link: string }) {
  const [copied, setCopied] = useState(false);

  async function handleCopy() {
    try {
      await navigator.clipboard.writeText(link);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      // clipboard API no disponible; el usuario puede copiar el link a mano
    }
  }

  return (
    <button
      onClick={handleCopy}
      className="rounded-lg bg-sage-600 px-4 py-2 text-sm font-medium text-white transition hover:bg-sage-700"
    >
      {copied ? "¡Copiado!" : "Copiar link"}
    </button>
  );
}
