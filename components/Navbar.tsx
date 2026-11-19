"use client";
import { useState } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { Menu, X } from "lucide-react";
import { toast } from "sonner";
import Logo from "./Logo";
import { authClient } from "@/lib/auth-client";
import { dashboardPath } from "@/lib/constants";

const links: [label: string, href: string][] = [
  ["Home", "/"],
  ["Services", "/services"],
  ["How It Works", "/about"],
];

export default function Navbar() {
  const pathname = usePathname();
  const router = useRouter();
  const { data } = authClient.useSession();
  const user = data?.user;
  const [menuOpen, setMenuOpen] = useState(false);
  const [dropOpen, setDropOpen] = useState(false);

  const isActive = (href: string) => (href === "/" ? pathname === "/" : pathname.startsWith(href));
  const linkClass = (href: string) =>
    `font-medium ${isActive(href) ? "text-[var(--navy)] underline decoration-[var(--accent)] decoration-2 underline-offset-8" : "text-slate-600 hover:text-[var(--navy)]"}`;

  async function signOut() {
    await authClient.signOut();
    toast.success("Signed out");
    setDropOpen(false);
    setMenuOpen(false);
    router.push("/");
  }

  return (
    <header className="sticky top-0 z-40 border-b border-[var(--line)] bg-[var(--soft)]/90 backdrop-blur">
      <div className="page-wrap flex h-16 items-center justify-between">
        <Logo />

        <nav className="hidden items-center gap-8 md:flex">
          {links.map(([label, href]) => (
            <Link key={href} href={href} className={linkClass(href)}>{label}</Link>
          ))}
        </nav>

        <div className="hidden items-center gap-3 md:flex">
          {!user ? (
            <>
              <Link href="/sign-in" className="btn-ghost btn-small">Sign In</Link>
              <Link href="/sign-up" className="btn-main btn-small">Sign Up</Link>
            </>
          ) : (
            <div className="relative">
              <button onClick={() => setDropOpen(!dropOpen)} className="block">
                {user.image ? (
                  <img src={user.image} alt={user.name} className="h-10 w-10 rounded-full object-cover" />
                ) : (
                  <span className="grid h-10 w-10 place-items-center rounded-full bg-[var(--navy)] font-bold text-white">
                    {user.name?.[0]?.toUpperCase()}
                  </span>
                )}
              </button>
              {dropOpen && (
                <div className="card-box absolute right-0 mt-2 w-60 p-3 shadow-lg">
                  <p className="font-bold text-[var(--navy)]">{user.name}</p>
                  <span className="badge badge-role mb-2 capitalize">{user.role || "customer"}</span>
                  <Link onClick={() => setDropOpen(false)} href={dashboardPath(user.role)} className="block rounded-lg px-2 py-2 hover:bg-slate-100">Dashboard</Link>
                  <Link onClick={() => setDropOpen(false)} href="/dashboard/profile" className="block rounded-lg px-2 py-2 hover:bg-slate-100">Update Profile</Link>
                  <button onClick={signOut} className="w-full rounded-lg px-2 py-2 text-left text-red-600 hover:bg-red-50">Sign Out</button>
                </div>
              )}
            </div>
          )}
        </div>

        <button className="md:hidden" onClick={() => setMenuOpen(!menuOpen)} aria-label="Menu">
          {menuOpen ? <X /> : <Menu />}
        </button>
      </div>

      {menuOpen && (
        <div className="space-y-3 border-t border-[var(--line)] bg-[var(--soft)] px-4 py-4 md:hidden">
          {links.map(([label, href]) => (
            <Link key={href} href={href} onClick={() => setMenuOpen(false)} className={`block ${linkClass(href)}`}>{label}</Link>
          ))}
          {!user ? (
            <div className="flex gap-3">
              <Link href="/sign-in" onClick={() => setMenuOpen(false)} className="btn-ghost btn-small">Sign In</Link>
              <Link href="/sign-up" onClick={() => setMenuOpen(false)} className="btn-main btn-small">Sign Up</Link>
            </div>
          ) : (
            <>
              <p className="font-bold">{user.name} <span className="badge badge-role capitalize">{user.role || "customer"}</span></p>
              <Link href={dashboardPath(user.role)} onClick={() => setMenuOpen(false)} className="block">Dashboard</Link>
              <Link href="/dashboard/profile" onClick={() => setMenuOpen(false)} className="block">Update Profile</Link>
              <button onClick={signOut} className="text-red-600">Sign Out</button>
            </>
          )}
        </div>
      )}
    </header>
  );
}
