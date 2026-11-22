import { Star } from "lucide-react";

type RatingLineProps = { avg?: number; count?: number; showEmpty?: boolean };

// shows a gold star, the average and the review count (service cards and the details page)
export default function RatingLine({ avg, count, showEmpty = false }: RatingLineProps) {
  if (!count) {
    return showEmpty ? <p className="text-sm text-slate-400">No reviews yet</p> : null;
  }
  return (
    <p className="flex items-center gap-1 text-sm font-semibold text-[var(--navy)]">
      <Star size={14} aria-hidden="true" className="fill-amber-400 text-amber-400" />
      {(avg ?? 0).toFixed(1)}
      <span className="font-normal text-slate-500">({count})</span>
    </p>
  );
}