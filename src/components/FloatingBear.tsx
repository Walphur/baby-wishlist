"use client";

import Image from "next/image";
import { useEffect, useRef } from "react";

type FloatingMascotProps = {
  className?: string;
  variant?: "bear" | "fox";
  motion?: "float" | "float-slow" | "float-delay";
};

const MOTION = {
  float: { amp: 22, sway: 0, period: 3600, phase: 0, tilt: 5 },
  "float-slow": { amp: 16, sway: 4, period: 4800, phase: 0.2, tilt: 3 },
  "float-delay": { amp: 20, sway: 8, period: 4200, phase: 0.55, tilt: -5 },
} as const;

// Flota con JS: CSS se apaga si Windows tiene "reducir movimiento".
export default function FloatingBear({
  className = "",
  variant = "bear",
  motion = "float",
}: FloatingMascotProps) {
  const ref = useRef<HTMLDivElement>(null);
  const src = variant === "fox" ? "/brand/fox.png" : "/brand/bear.png";

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    const { amp, sway, period, phase, tilt } = MOTION[motion];
    const start = performance.now();
    let frame = 0;

    const tick = (now: number) => {
      const t = ((now - start) / period + phase) * Math.PI * 2;
      const y = Math.sin(t) * amp;
      const x = Math.cos(t) * sway;
      const r = Math.sin(t) * tilt;
      el.style.transform = `translate3d(${x}px, ${y}px, 0) rotate(${r}deg)`;
      frame = requestAnimationFrame(tick);
    };

    frame = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(frame);
  }, [motion]);

  return (
    <div
      ref={ref}
      className={`pointer-events-none will-change-transform ${className}`}
    >
      <Image
        src={src}
        alt=""
        aria-hidden="true"
        width={512}
        height={512}
        className="h-full w-full object-contain drop-shadow-md"
      />
    </div>
  );
}
