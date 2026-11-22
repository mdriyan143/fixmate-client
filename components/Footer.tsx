import Link from "next/link";
import { ArrowRight, Mail, MapPin, Phone } from "lucide-react";
import Logo from "./Logo";
import { CATEGORIES } from "@/lib/constants";

// the new X logo (not the old Twitter bird)
const XLogo = () => (
  <svg viewBox="0 0 24 24" width="18" height="18" fill="currentColor" aria-hidden="true">
    <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
  </svg>
);
const FbLogo = () => (
  <svg viewBox="0 0 24 24" width="18" height="18" fill="currentColor" aria-hidden="true">
    <path d="M22 12c0-5.52-4.48-10-10-10S2 6.48 2 12c0 4.84 3.44 8.87 8 9.8V15H8v-3h2V9.5C10 7.57 11.57 6 13.5 6H16v3h-2c-.55 0-1 .45-1 1v2h3v3h-3v6.95c5.05-.5 9-4.76 9-9.95z" />
  </svg>
);

const linkClass =
  "inline-block text-sm text-blue-100/80 transition-all duration-200 hover:translate-x-1 hover:text-white";
const headingClass = "mb-4 text-xs font-bold uppercase tracking-wider text-[#8fb0ff]";
const socialClass =
  "press grid h-10 w-10 place-items-center rounded-full bg-white/10 text-white ring-1 ring-white/15 transition-colors duration-200 hover:bg-white/25";

export default function Footer() {
  return (
    <footer className="bg-deep relative mt-8 overflow-hidden rounded-t-[2rem]">
      {/* soft glows behind the content */}
      <div aria-hidden="true" className="pointer-events-none absolute -right-24 -top-24 h-72 w-72 rounded-full bg-[#2f6df0]/30 blur-3xl" />
      <div aria-hidden="true" className="pointer-events-none absolute -bottom-28 -left-20 h-72 w-72 rounded-full bg-[#14b8a6]/20 blur-3xl" />

      <div className="page-wrap relative">
        {/* call-to-action strip */}
        <div className="flex flex-col items-start justify-between gap-5 border-b border-white/10 py-10 sm:flex-row sm:items-center">
          <div>
            <h3 className="text-2xl font-extrabold text-white">Got a broken device?</h3>
            <p className="mt-1 text-sm text-blue-100/80">Find a verified technician and pay only after the job is done.</p>
          </div>
          <Link href="/services" className="btn-ghost shrink-0">
            Browse Services <ArrowRight size={16} aria-hidden="true" />
          </Link>
        </div>

        <div className="grid gap-10 py-12 sm:grid-cols-2 lg:grid-cols-4">
          <div>
            <Logo onDark />
            <p className="mt-4 max-w-xs text-sm text-blue-100/80">
              Broken device? Get it fixed by verified technicians and pay only after the job is done.
            </p>
            <div className="mt-5 flex gap-3">
              <a href="https://x.com" target="_blank" rel="noopener noreferrer" aria-label="FixMate on X" className={socialClass}><XLogo /></a>
              <a href="https://facebook.com" target="_blank" rel="noopener noreferrer" aria-label="FixMate on Facebook" className={socialClass}><FbLogo /></a>
            </div>
          </div>

          <div>
            <h4 className={headingClass}>Quick Links</h4>
            <ul className="space-y-2.5">
              <li><Link href="/" className={linkClass}>Home</Link></li>
              <li><Link href="/services" className={linkClass}>Services</Link></li>
              <li><Link href="/about" className={linkClass}>About</Link></li>
            </ul>
          </div>

          <div>
            <h4 className={headingClass}>Popular Categories</h4>
            <ul className="space-y-2.5">
              {CATEGORIES.slice(0, 5).map((c) => (
                <li key={c}>
                  <Link href={`/services?category=${encodeURIComponent(c)}`} className={linkClass}>{c}</Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h4 className={headingClass}>Contact</h4>
            <ul className="space-y-3 text-sm text-blue-100/80">
              <li className="flex items-center gap-2.5"><Mail size={16} aria-hidden="true" className="text-[#8fb0ff]" /> support@fixmate.com</li>
              <li className="flex items-center gap-2.5"><Phone size={16} aria-hidden="true" className="text-[#8fb0ff]" /> +880 1700 000000</li>
              <li className="flex items-center gap-2.5"><MapPin size={16} aria-hidden="true" className="text-[#8fb0ff]" /> Mirpur 10, Dhaka</li>
            </ul>
          </div>
        </div>

        <p className="border-t border-white/10 py-5 text-center text-sm text-blue-100/70">
          © {new Date().getFullYear()} FixMate. All rights reserved.
        </p>
      </div>
    </footer>
  );
}