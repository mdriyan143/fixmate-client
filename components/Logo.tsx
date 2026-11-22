import Link from "next/link";
import { Wrench } from "lucide-react";

// "light" is kept so existing pages still compile (it changes nothing).
// "onDark" is for logos placed on the deep navy footer or sidebar.
export default function Logo({ light = false, onDark = false }: { light?: boolean; onDark?: boolean }) {
  void light;
  return (
    <Link
      href="/"
      aria-label="FixMate home"
      className="group press flex items-center gap-2.5 text-xl font-extrabold"
    >
      <span
        className="grid h-10 w-10 place-items-center rounded-2xl bg-[image:var(--grad-brand)] text-white shadow-[0_8px_18px_-8px_rgb(30_63_207/0.7)] ring-1 ring-white/60 transition-transform duration-300 group-hover:-rotate-6"
      >
        <Wrench
          size={20}
          strokeWidth={2.25}
          aria-hidden="true"
          className="transition-transform duration-300 group-hover:-rotate-12"
        />
      </span>
      <span className="tracking-tight" style={{ fontFamily: "var(--font-manrope)" }}>
        <span className={onDark ? "text-white" : "text-[var(--navy)]"}>Fix</span>
        {onDark ? (
          <span
            style={{
              backgroundImage: "linear-gradient(90deg, #8fb0ff 0%, #5eead4 100%)",
              WebkitBackgroundClip: "text",
              backgroundClip: "text",
              WebkitTextFillColor: "transparent",
            }}
          >
            Mate
          </span>
        ) : (
          <span className="text-gradient">Mate</span>
        )}
      </span>
    </Link>
  );
}