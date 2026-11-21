import { Star } from "lucide-react";

type RatingLineProps = { avg?: number; count?: number; showEmpty?: boolean };

// shows a star, the average and the review count, used on service cards and the details page
export default function RatingLine({ avg, count, showEmpty = false }: RatingLineProps) {
  if (!count) {
    return showEmpty ? <p className="text-sm text-slate-400">No reviews yet</p> : null;
  }
  return (
    <p className="flex items-center gap-1 text-sm font-semibold text-[var(--accent-ink)]">
      <Star size={14} className="fill-current" /> {(avg ?? 0).toFixed(1)}
      <span className="font-normal text-slate-500">({count})</span>
    </p>
  );
}