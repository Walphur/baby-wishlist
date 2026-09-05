import Image from "next/image";

type FloatingMascotProps = {
  className?: string;
  variant?: "bear" | "fox";
  motion?: "float" | "float-slow" | "float-delay";
};

// Mascota flotante. width/height fijos: Image fill no anima bien el contenedor.
export default function FloatingBear({
  className = "",
  variant = "bear",
  motion = "float",
}: FloatingMascotProps) {
  const src = variant === "fox" ? "/brand/fox.png" : "/brand/bear.png";
  return (
    <div className={`pointer-events-none ${motionClass(motion)} ${className}`}>
      <Image
        src={src}
        alt=""
        aria-hidden="true"
        width={256}
        height={256}
        className="h-full w-full object-contain drop-shadow-md"
      />
    </div>
  );
}

function motionClass(motion: NonNullable<FloatingMascotProps["motion"]>) {
  if (motion === "float-slow") return "mascot-float-slow";
  if (motion === "float-delay") return "mascot-float-delay";
  return "mascot-float";
}
