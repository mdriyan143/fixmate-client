"use client";
import { useEffect, useState } from "react";
import type { FormEvent } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Eye, EyeOff, Loader2, Lock, LogIn, Mail, ShieldCheck } from "lucide-react";
import { toast } from "sonner";
import { authClient } from "@/lib/auth-client";
import { FcGoogle } from "react-icons/fc";
import { clearToken } from "@/lib/api";

type SignInForm = { email: string; password: string };

// the page the user wanted before signing in, otherwise the dashboard
function getRedirect() {
  const redirect = new URLSearchParams(window.location.search).get("redirect");
  return redirect && redirect.startsWith("/") && !redirect.startsWith("//") ? redirect : "/dashboard";
}

export default function SignInPage() {
  const router = useRouter();
  const { data: session } = authClient.useSession();
  const [form, setForm] = useState<SignInForm>({ email: "", password: "" });
  const [errors, setErrors] = useState<Partial<SignInForm>>({});
  const [busy, setBusy] = useState(false);
  const [showPass, setShowPass] = useState(false);

  // logged in (by email or Google)? go to the wanted page or the dashboard
  useEffect(() => {
    if (session?.user) router.replace(getRedirect());
  }, [session, router]);

  async function submit(ev: FormEvent<HTMLFormElement>) {
    ev.preventDefault();
    const e: Partial<SignInForm> = {};
    if (!/^\S+@\S+\.\S+$/.test(form.email)) e.email = "Enter a valid email address";
    if (!form.password) e.password = "Password is required";
    setErrors(e);
    if (Object.keys(e).length) return;

    setBusy(true);
    clearToken();
    const { error } = await authClient.signIn.email(form);
    setBusy(false);
    if (error) return toast.error(error.message || "Wrong email or password", { duration: 2500 });

    toast.success("Signed in successfully", { duration: 2500 });
    // the useEffect above does the redirect
  }

  async function googleSignIn() {
    await authClient.signIn.social({ provider: "google", callbackURL: getRedirect() });
  }

  return (
    <div className="bg-hero">
      <div className="page-wrap grid min-h-[calc(100vh-4rem)] place-items-center py-14">
        <form onSubmit={submit} noValidate className="card-box animate-fade-up w-full max-w-md space-y-5 p-6 sm:p-8">
          <div className="text-center">
            <span className="icon-tile mx-auto h-14 w-14 rounded-2xl">
              <LogIn size={26} aria-hidden="true" />
            </span>
            <h1 className="mt-4 text-2xl font-extrabold text-[var(--navy)]">Welcome back</h1>
            <p className="mt-1 text-sm text-slate-500">Sign in to track your repairs and bookings.</p>
          </div>

          <div>
            <label htmlFor="si-email" className="input-label">Email</label>
            <div className="relative">
              <Mail size={18} aria-hidden="true" className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" />
              <input
                id="si-email"
                type="email"
                autoComplete="email"
                className="input-box pl-11"
                value={form.email}
                onChange={(e) => setForm({ ...form, email: e.target.value })}
                placeholder="you@example.com"
              />
            </div>
            {errors.email && <p className="input-error">{errors.email}</p>}
          </div>

          <div>
            <label htmlFor="si-password" className="input-label">Password</label>
            <div className="relative">
              <Lock size={18} aria-hidden="true" className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" />
              <input
                id="si-password"
                type={showPass ? "text" : "password"}
                autoComplete="current-password"
                className="input-box pl-11 pr-11"
                value={form.password}
                onChange={(e) => setForm({ ...form, password: e.target.value })}
                placeholder="Your password"
              />
              <button
                type="button"
                onClick={() => setShowPass(!showPass)}
                aria-label={showPass ? "Hide password" : "Show password"}
                className="press absolute right-3 top-1/2 -translate-y-1/2 text-slate-500 hover:text-[var(--navy)]"
              >
                {showPass ? <EyeOff size={20} /> : <Eye size={20} />}
              </button>
            </div>
            {errors.password && <p className="input-error">{errors.password}</p>}
          </div>

          <button className="btn-main w-full" disabled={busy}>
            {busy ? (
              <>
                <Loader2 size={18} className="animate-spin" aria-hidden="true" /> Signing in...
              </>
            ) : (
              "Sign In"
            )}
          </button>

          <div className="flex items-center gap-3 text-xs text-slate-400">
            <span className="h-px flex-1 bg-slate-200" /> or <span className="h-px flex-1 bg-slate-200" />
          </div>
          <button type="button" onClick={googleSignIn} className="btn-ghost flex w-full items-center justify-center gap-3">
            <FcGoogle size={22} /> Continue with Google
          </button>

          <p className="text-center text-sm text-slate-500">
            New to FixMate?{" "}
            <Link href="/sign-up" className="font-semibold text-[var(--accent-ink)] hover:underline">Sign Up</Link>
          </p>
          <p className="flex items-center justify-center gap-1.5 text-xs text-slate-500">
            <ShieldCheck size={13} aria-hidden="true" /> Your session is protected and secure.
          </p>
        </form>
      </div>
    </div>
  );
}