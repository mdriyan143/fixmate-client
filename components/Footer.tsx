import Link from "next/link";
import { Mail, MapPin, Phone } from "lucide-react";
import Logo from "./Logo";
import { CATEGORIES } from "@/lib/constants";

// the new X logo (not the old Twitter bird)
const XLogo = () => (
  <svg viewBox="0 0 24 24" width="18" height="18" fill="currentColor">
    <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
  </svg>
);
const FbLogo = () => (
  <svg viewBox="0 0 24 24" width="18" height="18" fill="currentColor">
    <path d="M22 12c0-5.52-4.48-10-10-10S2 6.48 2 12c0 4.84 3.44 8.87 8 9.8V15H8v-3h2V9.5C10 7.57 11.57 6 13.5 6H16v3h-2c-.55 0-1 .45-1 1v2h3v3h-3v6.95c5.05-.5 9-4.76 9-9.95z" />
  </svg>
);

export default function Footer() {
  return (
    <footer className="bg-[var(--sage)] text-[var(--navy)]">
      <div className="page-wrap grid gap-10 py-14 sm:grid-cols-2 lg:grid-cols-4">
        <div>
          <Logo light />
          <p className="mt-3 text-sm">Broken device? Get it fixed by verified technicians and pay only after the job is done.</p>
          <div className="mt-4 flex gap-3">
            <a href="https://x.com" aria-label="X" className="grid h-9 w-9 place-items-center rounded-full bg-white/50 hover:bg-[var(--accent)]"><XLogo /></a>
            <a href="https://facebook.com" aria-label="Facebook" className="grid h-9 w-9 place-items-center rounded-full bg-white/50 hover:bg-[var(--accent)]"><FbLogo /></a>
          </div>
        </div>

        <div>
          <h4 className="mb-3 font-bold text-[var(--navy)]">Quick Links</h4>
          <ul className="space-y-2 text-sm">
            <li><Link href="/">Home</Link></li>
            <li><Link href="/services">Services</Link></li>
            <li><Link href="/about">About</Link></li>
          </ul>
        </div>

        <div>
          <h4 className="mb-3 font-bold text-[var(--navy)]">Popular Categories</h4>
          <ul className="space-y-2 text-sm">
            {CATEGORIES.slice(0, 5).map((c) => (
              <li key={c}><Link href={`/services?category=${encodeURIComponent(c)}`}>{c}</Link></li>
            ))}
          </ul>
        </div>

        <div>
          <h4 className="mb-3 font-bold text-[var(--navy)]">Contact</h4>
          <ul className="space-y-2 text-sm">
            <li className="flex items-center gap-2"><Mail size={16} /> support@fixmate.com</li>
            <li className="flex items-center gap-2"><Phone size={16} /> +880 1700 000000</li>
            <li className="flex items-center gap-2"><MapPin size={16} /> Mirpur 10, Dhaka</li>
          </ul>
        </div>
      </div>
      <p className="border-t border-[var(--navy)]/15 py-4 text-center text-sm">© {new Date().getFullYear()} FixMate. All rights reserved.</p>
    </footer>
  );
}
