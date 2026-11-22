"use client";
import { useEffect, useState } from "react";
import type { ChangeEvent, FormEvent } from "react";
import type { LucideIcon } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Check, Eye, EyeOff, Loader2, Lock, Mail, UserPlus, UserRound, Wrench } from "lucide-react";
import { toast } from "sonner";
import { authClient } from "@/lib/auth-client";
import { dashboardPath } from "@/lib/constants";
import { FcGoogle } from "react-icons/fc";

type SignUpRole = "customer" | "technician"; // admin is not an option
type TextField = "name" | "email" | "password";
type SignUpForm = Record<TextField, string> & { role: SignUpRole };

const roleCards: [value: SignUpRole, title: string, text: string, icon: LucideIcon][] = [
  ["customer", "Customer", "Book repairs", UserRound],
  ["technician", "Technician", "Offer repairs", Wrench],
];

export default function SignUpPage() {
  const router = useRouter();
  const { data: session } = authClient.useSession();
  const [form, setForm] = useState<SignUpForm>({ name: "", email: "", password: "", role: "customer" });
  const [errors, setErrors] = useState<Partial<Record<TextField, string>>>({});
  const [busy, setBusy] = useState(false);
  const [showPass, setShowPass] = useState(false);

  // logged-in users do not need this page
  useEffect(() => {
    if (session?.user) router.replace("/dashboard");
  }, [session, router]);

  const set = (key: TextField) => (e: ChangeEvent<HTMLInputElement>) =>
    setForm({ ...form, [key]: e.target.value });

  function validate() {
    const e: Partial<Record<TextField, string>> = {};
    if (!form.name.trim()) e.name = "Full name is required";
    if (!/^\S+@\S+\.\S+$/.test(form.email)) e.email = "Enter a valid email address";
    if (form.password.length < 6) e.password = "Password must be at least 6 characters";
    else if (!/[A-Z]/.test(form.password)) e.password = "Add at least one uppercase letter";
    else if (!/[a-z]/.test(form.password)) e.password = "Add at least one lowercase letter";
    setErrors(e);
    return Object.keys(e).length === 0;
  }

  async function submit(ev: FormEvent<HTMLFormElement>) {
    ev.preventDefault();
    if (!validate()) return;
    setBusy(true);
    const { error } = await authClient.signUp.email(form);
    setBusy(false);
    if (error) return toast.error(error.message || "Sign up failed", { duration: 2500 });
    toast.success("Account created! Welcome to FixMate");
    router.push(dashboardPath(form.role));
  }

  async function googleSignUp() {
    await authClient.signIn.social({ provider: "google", callbackURL: "/dashboard" });
  }

  // live password checklist (display only; validate() above is the real check)
  const rules: [boolean, string][] = [
    [form.password.length >= 6, "6+ characters"],
    [/[A-Z]/.test(form.password), "Uppercase letter"],
    [/[a-z]/.test(form.password), "Lowercase letter"],
  ];

  return (
    <div className="bg-hero">
      <div className="page-wrap grid min-h-[calc(100vh-4rem)] place-items-center py-14">
        <form onSubmit={submit} noValidate className="card-box animate-fade-up w-full max-w-md space-y-5 p-6 sm:p-8">
          <div className="text-center">
            <span className="icon-tile mx-auto h-14 w-14 rounded-2xl">
              <UserPlus size={26} aria-hidden="true" />
            </span>
            <h1 className="mt-4 text-2xl font-extrabold text-[var(--navy)]">Create your account</h1>
            <p className="mt-1 text-sm text-slate-500">Join FixMate in less than a minute.</p>
          </div>

          <div>
            <label htmlFor="su-name" className="input-label">Full Name</label>
            <div className="relative">
              <UserRound size={18} aria-hidden="true" className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" />
              <input id="su-name" autoComplete="name" className="input-box pl-11" value={form.name} onChange={set("name")} placeholder="Your full name" />
            </div>
            {errors.name && <p className="input-error">{errors.name}</p>}
          </div>

          <div>
            <label htmlFor="su-email" className="input-label">Email</label>
            <div className="relative">
              <Mail size={18} aria-hidden="true" className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" />
              <input id="su-email" type="email" autoComplete="email" className="input-box pl-11" value={form.email} onChange={set("email")} placeholder="you@example.com" />
            </div>
            {errors.email && <p className="input-error">{errors.email}</p>}
          </div>

          <div>
            <label htmlFor="su-password" className="input-label">Password</label>
            <div className="relative">
              <Lock size={18} aria-hidden="true" className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" />
              <input
                id="su-password"
                type={showPass ? "text" : "password"}
                autoComplete="new-password"
                className="input-box pl-11 pr-11"
                value={form.password}
                onChange={set("password")}
                placeholder="Min 6 chars, upper and lower case"
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
            <ul className="mt-2 flex flex-wrap gap-x-4 gap-y-1">
              {rules.map(([ok, text]) => (
                <li key={text} className={`flex items-center gap-1 text-xs font-medium transition-colors ${ok ? "text-emerald-600" : "text-slate-400"}`}>
                  <Check size={12} aria-hidden="true" /> {text}
                </li>
              ))}
            </ul>
            {errors.password && <p className="input-error">{errors.password}</p>}
          </div>

          <div>
            <span className="input-label">I want to join as</span>
            <div className="grid grid-cols-2 gap-3">
              {roleCards.map(([value, title, text, Icon]) => {
                const selected = form.role === value;
                return (
                  <button
                    type="button"
                    key={value}
                    aria-pressed={selected}
                    onClick={() => setForm({ ...form, role: value })}
                    className={`press relative rounded-2xl border-2 p-3.5 text-left transition-all duration-200 ${
                      selected
                        ? "border-[#2f6df0] bg-[#2f6df0]/10 shadow-[0_8px_20px_-12px_rgb(47_109_240/0.6)]"
                        : "border-slate-200 bg-white/60 hover:border-[#2f6df0]/50 dark:bg-white/5"
                    }`}
                  >
                    <span className={`grid h-9 w-9 place-items-center rounded-xl transition-colors ${selected ? "bg-[#2f6df0] text-white" : "bg-slate-100 text-slate-500"}`}>
                      <Icon size={18} aria-hidden="true" />
                    </span>
                    <p className="mt-2 font-semibold text-[var(--navy)]">{title}</p>
                    <p className="text-xs text-slate-500">{text}</p>
                    {selected && (
                      <span className="absolute right-3 top-3 grid h-5 w-5 place-items-center rounded-full bg-[#2f6df0] text-white">
                        <Check size={12} aria-hidden="true" />
                      </span>
                    )}
                  </button>
                );
              })}
            </div>
          </div>

          <button className="btn-main w-full" disabled={busy}>
            {busy ? (
              <>
                <Loader2 size={18} className="animate-spin" aria-hidden="true" /> Creating...
              </>
            ) : (
              "Sign Up"
            )}
          </button>

          <div className="flex items-center gap-3 text-xs text-slate-400">
            <span className="h-px flex-1 bg-slate-200" /> or <span className="h-px flex-1 bg-slate-200" />
          </div>
          <button type="button" onClick={googleSignUp} className="btn-ghost flex w-full items-center justify-center gap-3">
            <FcGoogle size={22} /> Continue with Google
          </button>
          <p className="text-center text-xs text-slate-500">Google sign up creates a customer account.</p>

          <p className="text-center text-sm text-slate-500">
            Already have an account?{" "}
            <Link href="/sign-in" className="font-semibold text-[var(--accent-ink)] hover:underline">Sign In</Link>
          </p>
        </form>
      </div>
    </div>
  );
}