"use client";

import { useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { CircleX } from "lucide-react";
import { authClient } from "@/lib/auth-client";

export default function PaymentCancel() {
  const router = useRouter();
  const { data, isPending } = authClient.useSession();
  const email = data?.user?.email;
  const role = data?.user?.role;

  // customer-only page
  useEffect(() => {
    if (isPending) return;
    if (!email) router.replace("/sign-in?redirect=/payment/cancel");
    else if (role !== "customer") router.replace("/dashboard");
  }, [isPending, email, role, router]);

  if (isPending || role !== "customer") return null;

  return (
    <div className="bg-hero">
      <div className="page-wrap grid min-h-[calc(100vh-4rem)] place-items-center py-16">
        <div className="card-box animate-fade-up w-full max-w-md p-8 text-center">
          <div className="animate-pop mx-auto grid h-20 w-20 place-items-center rounded-full bg-red-50 text-red-500 ring-8 ring-red-50/60">
            <CircleX size={42} aria-hidden="true" />
          </div>
          <h1 className="mt-5 text-2xl font-extrabold text-[var(--navy)]">Payment cancelled</h1>
          <p className="mt-2 text-sm text-slate-500">No money was taken. You can pay whenever you are ready.</p>
          <div className="mt-7 flex flex-wrap justify-center gap-3">
            <Link href="/dashboard/customer/bookings" className="btn-main">Try Again</Link>
            <Link href="/" className="btn-ghost">Back to Home</Link>
          </div>
        </div>
      </div>
    </div>
  );
}