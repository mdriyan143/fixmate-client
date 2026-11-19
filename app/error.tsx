"use client";

// named ErrorPage so it does not hide the built-in Error class
export default function ErrorPage({ error, reset }: { error: Error; reset: () => void }) {
  return (
    <div className="grid min-h-screen place-items-center px-4 text-center">
      <div>
        <h1 className="text-3xl font-extrabold text-[var(--navy)]">Something went wrong</h1>
        <p className="mb-6 mt-2 text-slate-500">{error?.message || "Please try again in a moment."}</p>
        <button onClick={() => reset()} className="btn-main">Try Again</button>
      </div>
    </div>
  );
}
