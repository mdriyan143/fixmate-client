import { Quote, UserRound } from "lucide-react";

// DEMO content: clearly labelled, not real customer reviews.
// Replace these with real feedback once customers start reviewing.
const stories = [
  {
    quote: "I could watch my request move from requested to completed, so I never had to chase anyone for updates.",
    topic: "Smartphone repair",
  },
  {
    quote: "The starting price was clear up front, and I paid only after the technician finished the job.",
    topic: "AC servicing",
  },
  {
    quote: "Booking took a minute. Everything stayed in one place: the request, the status and the payment.",
    topic: "Refrigerator repair",
  },
];

export default function Testimonials() {
  return (
    <section className="page-wrap section-gap pt-0">
      <span className="section-eyebrow">Customer stories</span>
      <h2 className="section-title">What a good repair feels like</h2>
      <p className="section-sub">Sample feedback shown as demo content until real customer reviews come in.</p>

      <div className="grid gap-6 md:grid-cols-3">
        {stories.map((s, i) => (
          <figure key={s.topic} className="card-box card-hover animate-fade-up flex flex-col p-6" style={{ animationDelay: `${i * 0.1}s` }}>
            <div className="flex items-center justify-between">
              <span className="icon-tile h-10 w-10 rounded-xl">
                <Quote size={18} aria-hidden="true" />
              </span>
              <span className="badge badge-pending">Demo</span>
            </div>

            <blockquote className="mt-4 flex-1 text-slate-600">&ldquo;{s.quote}&rdquo;</blockquote>

            <figcaption className="mt-5 flex items-center gap-3 border-t border-[var(--line)] pt-4">
              <span className="grid h-10 w-10 place-items-center rounded-full bg-[image:var(--grad-brand)] text-white">
                <UserRound size={18} aria-hidden="true" />
              </span>
              <span>
                <span className="block text-sm font-bold text-[var(--navy)]">Demo customer</span>
                <span className="block text-xs text-slate-500">{s.topic}</span>
              </span>
            </figcaption>
          </figure>
        ))}
      </div>
    </section>
  );
}