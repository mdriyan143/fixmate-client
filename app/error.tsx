"use client";
import { useEffect } from "react";
import Link from "next/link";

// named ErrorPage so it does not hide the built-in Error class
export default function ErrorPage({ error, reset }: { error: Error & { digest?: string }; reset: () => void }) {
  // the real error goes to the console only (never show technical text to visitors)
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <div className="grid min-h-screen place-items-center px-4 text-center">
      <div>
        <h1 className="text-3xl font-extrabold text-[var(--navy)]">Something went wrong</h1>
        <p className="mb-6 mt-2 text-slate-500">
          We could not load this page. Please try again in a moment.
        </p>
        <div className="flex flex-wrap justify-center gap-3">
          <button onClick={() => reset()} className="btn-main">Try Again</button>
          <Link href="/" className="btn-ghost">Back to Home</Link>
        </div>
      </div>
    </div>
  );
}
