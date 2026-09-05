// Manchas de color difuminadas de fondo, puramente decorativas.
// Posición "fixed": queda como ambiente detrás de toda la página, no solo del hero.
export default function DecorativeBlobs() {
  return (
    <div
      aria-hidden="true"
      className="pointer-events-none fixed inset-0 -z-10 overflow-hidden"
    >
      <div className="absolute -left-24 -top-32 h-[28rem] w-[28rem] rounded-full bg-sage-200/60 blur-3xl" />
      <div className="absolute -right-20 -top-10 h-96 w-96 rounded-full bg-gold-400/25 blur-3xl" />
      <div className="absolute left-1/3 top-1/3 h-80 w-80 rounded-full bg-blush-200/40 blur-3xl" />
      <div className="absolute -right-16 bottom-1/4 h-80 w-80 rounded-full bg-terracotta-400/20 blur-3xl" />
      <div className="absolute left-[-6rem] bottom-[-4rem] h-96 w-96 rounded-full bg-sage-300/30 blur-3xl" />
      <div className="absolute right-1/4 bottom-[-6rem] h-72 w-72 rounded-full bg-gold-500/20 blur-3xl" />
    </div>
  );
}

