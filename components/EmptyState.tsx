import Link from "next/link";

interface EmptyStateProps {
  icon?: string;
  title: string;
  text?: string;
  href?: string; // CTA button link
  cta?: string; // CTA button text
}

export default function EmptyState({ icon = "🔧", title, text, href, cta }: EmptyStateProps) {
  return (
    <div className="card-box px-6 py-14 text-center">
      <div className="mb-3 text-5xl">{icon}</div>
      <h3 className="text-lg font-bold text-[var(--navy)]">{title}</h3>
      {text && <p className="mx-auto mt-1 max-w-sm text-sm text-slate-500">{text}</p>}
      {href && <Link href={href} className="btn-main mt-5">{cta}</Link>}
    </div>
  );
}
