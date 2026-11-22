"use client";
import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { CircleCheck, FileText, TriangleAlert } from "lucide-react";
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
    <div className="bg-hero">
      <div className="page-wrap grid min-h-[calc(100vh-4rem)] place-items-center py-16">
        <div className="card-box animate-fade-up w-full max-w-md p-8 text-center">
          {error ? (
            <>
              <div className="animate-pop mx-auto grid h-20 w-20 place-items-center rounded-full bg-amber-50 text-amber-500 ring-8 ring-amber-50/60">
                <TriangleAlert size={38} aria-hidden="true" />
              </div>
              <h1 className="mt-5 text-xl font-extrabold text-[var(--navy)]">We could not confirm the payment</h1>
              <p className="mt-2 text-sm text-slate-500">{error}</p>
            </>
          ) : !payment ? (
            <div className="skeleton h-44" />
          ) : (
            <>
              <div className="animate-pop mx-auto grid h-20 w-20 place-items-center rounded-full bg-green-50 text-green-600 ring-8 ring-green-50/60">
                <CircleCheck size={42} aria-hidden="true" />
              </div>
              <h1 className="mt-5 text-2xl font-extrabold text-[var(--navy)]">Payment successful</h1>
              <p className="text-gradient mt-3 text-5xl font-extrabold">${payment.amount}</p>

              <dl className="mt-6 space-y-3 rounded-2xl bg-[var(--accent-ink)]/5 p-4 text-left text-sm">
                <div className="flex justify-between gap-4">
                  <dt className="text-slate-500">Service</dt>
                  <dd className="text-right font-semibold text-[var(--navy)]">{payment.serviceTitle}</dd>
                </div>
                <div className="flex justify-between gap-4">
                  <dt className="shrink-0 text-slate-500">Transaction</dt>
                  <dd className="break-all text-right font-mono text-xs text-[var(--navy)]">{payment.transactionId}</dd>
                </div>
              </dl>
            </>
          )}

          <div className="mt-7 flex flex-wrap justify-center gap-3">
            <Link href="/dashboard/customer/bookings" className="btn-main">Back to My Bookings</Link>
            {payment && (
              <Link href={`/dashboard/customer/invoices/${payment.bookingId}`} className="btn-ghost">
                <FileText size={16} aria-hidden="true" /> Invoice
              </Link>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}