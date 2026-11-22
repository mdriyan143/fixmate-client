"use client";
import { useEffect } from "react";
import Link from "next/link";
import { House, RefreshCw, TriangleAlert } from "lucide-react";

// named ErrorPage so it does not hide the built-in Error class
export default function ErrorPage({ error, reset }: { error: Error & { digest?: string }; reset: () => void }) {
  // the real error goes to the console only (never show technical text to visitors)
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <div className="grid min-h-screen place-items-center px-4 py-10">
      <div className="card-box animate-fade-up w-full max-w-md px-6 py-10 text-center sm:px-10">
        <div className="animate-pop mx-auto grid h-20 w-20 place-items-center rounded-full bg-amber-50 text-amber-500 ring-8 ring-amber-50/60">
          <TriangleAlert size={40} aria-hidden="true" />
        </div>
        <h1 className="mt-6 text-3xl font-extrabold text-[var(--navy)]">Something went wrong</h1>
        <p className="mb-7 mt-2 text-slate-500">
          We could not load this page. Please try again in a moment.
        </p>
        <div className="flex flex-wrap justify-center gap-3">
          <button onClick={() => reset()} className="btn-main">
            <RefreshCw size={16} aria-hidden="true" /> Try Again
          </button>
          <Link href="/" className="btn-ghost">
            <House size={16} aria-hidden="true" /> Back to Home
          </Link>
        </div>
      </div>
    </div>
  );
}