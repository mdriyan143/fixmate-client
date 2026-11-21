"use client";
import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { api, getErrorMessage } from "@/lib/api";
import { authClient } from "@/lib/auth-client";
import type { Payment } from "@/lib/types";

export default function PaymentSuccess() {
  const router = useRouter();
  const { data, isPending } = authClient.useSession();
  const email = data?.user?.email;
  const role = data?.user?.role;
  const [payment, setPayment] = useState<Payment | null>(null);
  const [error, setError] = useState("");

  useEffect(() => {
    if (isPending) return;
    
    if (!email) {
      // after login the customer comes back here, with the Stripe session_id still in the address
      const back = window.location.pathname + window.location.search;
      router.replace(`/sign-in?redirect=${encodeURIComponent(back)}`);
      return;
    }

    if (role !== "customer") {
      router.replace("/dashboard"); // payment pages are customer-only
      return;
    }

    const sessionId = new URLSearchParams(window.location.search).get("session_id");
    if (!sessionId) {
      setError("Payment session is missing");
      return;
    }

    // the server asks Stripe, saves the payment once, and marks the booking as paid
    api<Payment>(`/api/payments/verify?session_id=${sessionId}`)
      .then((p) => { setPayment(p); toast.success("Payment successful"); })
      .catch((err) => setError(getErrorMessage(err)));
  }, [isPending, email, role, router]);

  return (
    <div className="page-wrap grid place-items-center py-16">
      <div className="card-box w-full max-w-md p-8 text-center">
        {error ? (
          <>
            <div className="text-5xl">⚠️</div>
            <h1 className="mt-3 text-xl font-bold text-[var(--navy)]">We could not confirm the payment</h1>
            <p className="mt-1 text-sm text-slate-500">{error}</p>
          </>
        ) : !payment ? (
          <div className="skeleton h-32" />
        ) : (
          <>
            <div className="text-5xl">✅</div>
            <h1 className="mt-3 text-2xl font-bold text-[var(--navy)]">Payment successful</h1>
            <p className="mt-4 text-4xl font-extrabold text-[var(--accent-ink)]">${payment.amount}</p>
            <p className="mt-2 text-sm text-slate-500">{payment.serviceTitle}</p>
            <p className="mt-1 break-all font-mono text-xs text-slate-500">Transaction: {payment.transactionId}</p>
          </>
        )}
        <Link href="/dashboard/customer/bookings" className="btn-main mt-6">Back to My Bookings</Link>
      </div>
    </div>
  );
}
