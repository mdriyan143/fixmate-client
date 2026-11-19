import Link from "next/link";
import { Wrench } from "lucide-react";

// the "light" prop is kept so existing pages still compile; the logo now looks the same everywhere
export default function Logo({ light = false }: { light?: boolean }) {
  void light;
  return (
    <Link href="/" className="flex items-center gap-2 text-xl font-extrabold">
      <span className="grid h-9 w-9 place-items-center rounded-xl bg-[var(--accent)] text-[var(--navy)] shadow-sm">
        <Wrench size={20} />
      </span>
      <span className="text-[var(--navy)]">FixMate</span>
    </Link>
  );
}
