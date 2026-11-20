import { Search } from "lucide-react";

export default function Hero() {
  return (
    <section className="bg-[var(--sage)] text-[var(--navy)]">
      <div className="page-wrap grid items-center gap-10 py-16 lg:grid-cols-2 lg:py-24">
        <div>
          <span className="badge bg-[var(--soft)] text-[var(--navy)]">Pay only after the job is done</span>
          <h1 className="mt-4 text-4xl font-extrabold leading-tight sm:text-5xl">
            Broken Device? Get It Fixed by Verified Technicians
          </h1>
          <p className="mt-4 max-w-lg text-[var(--navy)]/80">
            Phones, laptops, AC, fridge, TV and more. Send a request, track every step and pay securely when the repair is complete.
          </p>
          <form action="/services" className="mt-8 flex max-w-lg gap-2 rounded-xl bg-white p-2 shadow-lg">
            <input
              name="search"
              placeholder="Try: iPhone screen, AC gas..."
              className="min-w-0 flex-1 px-3 text-slate-800 outline-none"
            />
            <button className="btn-main"><Search size={18} /> Search</button>
          </form>
        </div>

        {/* real photo: put your own picture at client/public/hero.jpg */}
        <img
          src="/hero.jpg"
          alt="Technician repairing a smartphone"
          className="h-72 w-full rounded-2xl object-cover shadow-2xl sm:h-96"
        />
      </div>
    </section>
  );
}
