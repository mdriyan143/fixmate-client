"use client";

import { useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { authClient } from "@/lib/auth-client";

export default function PaymentCancel() {
  const router = useRouter();
  const { data, isPending } = authClient.useSession();
  const email = data?.user?.email;
  const role = data?.user?.role;

  // customer-only page
  useEffect(() => {
    if (isPending) return;
    if (!email) router.replace("/sign-in");
    else if (role !== "customer") router.replace("/dashboard");
  }, [isPending, email, role, router]);

  if (isPending || role !== "customer") return null;

  return (
    <div className="page-wrap grid place-items-center py-16">
      <div className="card-box w-full max-w-md p-8 text-center">
        <div className="text-5xl">😕</div>
        <h1 className="mt-3 text-2xl font-bold text-[var(--navy)]">Payment cancelled</h1>
        <p className="mt-2 text-sm text-slate-500">No money was taken. You can pay whenever you are ready.</p>
        <Link href="/dashboard/customer/bookings" className="btn-main mt-6">Try Again</Link>
      </div>
    </div>
  );
}
