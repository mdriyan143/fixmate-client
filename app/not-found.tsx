import Link from "next/link";
import { Wrench } from "lucide-react";

export default function NotFound() {
  return (
    <div className="grid min-h-screen place-items-center px-4 text-center">
      <div>
        <div className="mx-auto mb-6 grid h-28 w-28 place-items-center rounded-full bg-orange-100 text-[var(--accent-ink)]">
          <Wrench size={56} className="-rotate-45" />
        </div>
        <h1 className="text-6xl font-extrabold text-[var(--navy)]">404</h1>
        <p className="mb-6 mt-2 text-slate-500">This page is broken, and even FixMate cannot repair it.</p>
        <Link href="/" className="btn-main">Back to Home</Link>
      </div>
    </div>
  );
}
