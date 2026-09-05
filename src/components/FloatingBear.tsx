import Image from "next/image";

type FloatingMascotProps = {
  className?: string;
  variant?: "bear" | "fox";
};

// Mascota flotante decorativa, usa las ilustraciones reales de public/brand.
export default function FloatingBear({
  className = "",
  variant = "bear",
}: FloatingMascotProps) {
  const src = variant === "fox" ? "/brand/fox.png" : "/brand/bear.png";
  return (
    <div className={className}>
      <Image
        src={src}
        alt=""
        aria-hidden="true"
        fill
        sizes="200px"
        className="object-contain drop-shadow-md"
      />
    </div>
  );
}

