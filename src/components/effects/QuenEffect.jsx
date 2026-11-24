/** Quen: a golden shield bubble. Stays up until the sign is cast again. */
export default function QuenEffect() {
  return (
    <div className="absolute inset-0 grid place-items-center animate-fade-in">
      <span className="col-start-1 row-start-1 aspect-square h-[85%] max-w-[95%] rounded-full border-2 border-quen bg-quen/10 shadow-[0_0_40px] shadow-quen/60 motion-safe:animate-shield" />
      <span className="col-start-1 row-start-1 aspect-square h-[70%] max-w-[80%] rounded-full border border-dashed border-quen/60 motion-safe:animate-rune-spin" />
    </div>
  );
}
