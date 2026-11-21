import Link from "next/link";
import { Wrench } from "lucide-react";
import type { LucideIcon } from "lucide-react";

interface EmptyStateProps {
  icon?: LucideIcon;
  title: string;
  text?: string;
  href?: string; // CTA button link
  cta?: string; // CTA button text
}

export default function EmptyState({ icon: Icon = Wrench, title, text, href, cta }: EmptyStateProps) {
  return (
    <div className="card-box px-6 py-14 text-center">
      <div className="mx-auto mb-4 grid h-16 w-16 place-items-center rounded-full bg-[var(--sage-soft)] text-[var(--accent-ink)]">
        <Icon size={30} strokeWidth={1.75} />
      </div>
      <h3 className="text-lg font-bold text-[var(--navy)]">{title}</h3>
      {text && <p className="mx-auto mt-1 max-w-sm text-sm text-slate-500">{text}</p>}
      {href && <Link href={href} className="btn-main mt-5">{cta}</Link>}
    </div>
  );
}