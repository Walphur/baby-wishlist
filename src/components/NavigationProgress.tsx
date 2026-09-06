"use client";

import { useEffect, useState } from "react";
import { usePathname } from "next/navigation";

export default function NavigationProgress() {
  const pathname = usePathname();
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    setLoading(false);
  }, [pathname]);

  useEffect(() => {
    function onClick(event: MouseEvent) {
      if (event.defaultPrevented) return;
      if (event.button !== 0) return;
      if (event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) return;

      const target = event.target as HTMLElement | null;
      const anchor = target?.closest("a");
      if (!anchor) return;

      const href = anchor.getAttribute("href");
      if (!href || href.startsWith("#") || href.startsWith("mailto:")) return;
      if (anchor.target && anchor.target !== "_self") return;

      try {
        const url = new URL(href, window.location.href);
        if (url.origin !== window.location.origin) return;
        if (url.pathname === pathname && url.search === window.location.search) return;
        if (!url.pathname.startsWith("/dashboard") && !url.pathname.startsWith("/admin")) {
          return;
        }
        setLoading(true);
      } catch {
        // ignore invalid hrefs
      }
    }

    document.addEventListener("click", onClick);
    return () => document.removeEventListener("click", onClick);
  }, [pathname]);

  if (!loading) return null;

  return (
    <div
      className="pointer-events-none fixed inset-x-0 top-0 z-[80] h-1 overflow-hidden bg-sage-100"
      aria-hidden="true"
    >
      <div className="nav-progress-bar h-full w-1/3 bg-sage-600" />
    </div>
  );
}
