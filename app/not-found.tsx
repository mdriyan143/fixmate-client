import Link from "next/link";

export default function NotFound() {
  return (
    <div className="grid min-h-screen place-items-center px-4 text-center">
      <div>
        <svg viewBox="0 0 240 200" role="img" aria-label="Broken phone being repaired"
             className="tool-wiggle mx-auto mb-6 h-48 w-60">
          <circle cx="120" cy="100" r="88" fill="var(--sage-soft)" />

          {/* broken phone */}
          <rect x="82" y="38" width="76" height="124" rx="14" fill="var(--navy)" />
          <rect x="90" y="52" width="60" height="92" rx="6" fill="#fff" />
          <polyline points="108,52 118,80 106,96 122,114 114,144" fill="none"
                    stroke="var(--accent)" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" />
          <circle cx="120" cy="153" r="4" fill="#fff" />

          {/* screwdriver */}
          <g transform="rotate(35 175 130)">
            <rect x="170" y="90" width="10" height="46" rx="4" fill="var(--accent)" />
            <rect x="173" y="136" width="4" height="26" fill="#94a3b8" />
          </g>

          {/* gear (dashed thick stroke makes the teeth) */}
          <circle cx="60" cy="62" r="16" fill="none" stroke="var(--accent)" strokeWidth="8" strokeDasharray="6 6" />
          <circle cx="60" cy="62" r="14" fill="var(--accent)" />
          <circle cx="60" cy="62" r="5" fill="var(--sage-soft)" />
        </svg>

        <h1 className="text-6xl font-extrabold text-[var(--navy)]">404</h1>
        <p className="mb-6 mt-2 text-slate-500">This page is broken, and even FixMate cannot repair it.</p>
        <Link href="/" className="btn-main">Back to Home</Link>
      </div>
    </div>
  );
}