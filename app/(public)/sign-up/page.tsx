"use client";
import { useEffect, useState } from "react";
import type { ChangeEvent, FormEvent } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Eye, EyeOff } from "lucide-react";
import { toast } from "sonner";
import { authClient } from "@/lib/auth-client";
import { dashboardPath } from "@/lib/constants";

type SignUpRole = "customer" | "technician"; // admin is not an option
type TextField = "name" | "email" | "password";
type SignUpForm = Record<TextField, string> & { role: SignUpRole };

const roleCards: [value: SignUpRole, title: string, text: string][] = [
  ["customer", "Customer", "Book repairs"],
  ["technician", "Technician", "Offer repairs"],
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

  return (
    <div className="page-wrap grid place-items-center py-14">
      <form onSubmit={submit} noValidate className="card-box w-full max-w-md space-y-4 p-6 sm:p-8">
        <h1 className="text-2xl font-bold text-[var(--navy)]">Create your account</h1>

        <div>
          <label className="input-label">Full Name</label>
          <input className="input-box" value={form.name} onChange={set("name")} placeholder="Your full name" />
          {errors.name && <p className="input-error">{errors.name}</p>}
        </div>

        <div>
          <label className="input-label">Email</label>
          <input type="email" className="input-box" value={form.email} onChange={set("email")} placeholder="you@example.com" />
          {errors.email && <p className="input-error">{errors.email}</p>}
        </div>

        <div>
          <label className="input-label">Password</label>
          <div className="relative">
            <input
              type={showPass ? "text" : "password"}
              className="input-box pr-11"
              value={form.password}
              onChange={set("password")}
              placeholder="Min 6 chars, upper and lower case"
            />
            <button
              type="button"
              onClick={() => setShowPass(!showPass)}
              aria-label={showPass ? "Hide password" : "Show password"}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-500 hover:text-[var(--navy)]"
            >
              {showPass ? <EyeOff size={20} /> : <Eye size={20} />}
            </button>
          </div>
          {errors.password && <p className="input-error">{errors.password}</p>}
        </div>

        <div>
          <label className="input-label">I want to join as</label>
          <div className="grid grid-cols-2 gap-3">
            {roleCards.map(([value, title, text]) => (
              <button
                type="button"
                key={value}
                onClick={() => setForm({ ...form, role: value })}
                className={`rounded-xl border p-3 text-left ${form.role === value ? "border-[var(--accent)] bg-orange-50" : "border-slate-300"}`}
              >
                <p className="font-semibold text-[var(--navy)]">{title}</p>
                <p className="text-xs text-slate-500">{text}</p>
              </button>
            ))}
          </div>
        </div>

        <button className="btn-main w-full" disabled={busy}>{busy ? "Creating..." : "Sign Up"}</button>

        <div className="flex items-center gap-3 text-xs text-slate-400">
          <span className="h-px flex-1 bg-slate-200" /> or <span className="h-px flex-1 bg-slate-200" />
        </div>
        <button type="button" onClick={googleSignUp} className="btn-ghost w-full">
          <span className="font-bold text-[#4285F4]">G</span> Continue with Google
        </button>
        <p className="text-center text-xs text-slate-500">Google sign up creates a customer account.</p>

        <p className="text-center text-sm text-slate-500">
          Already have an account? <Link href="/sign-in" className="font-semibold text-[var(--accent-ink)]">Sign In</Link>
        </p>
      </form>
    </div>
  );
}