type RatingLineProps = { avg?: number; count?: number; showEmpty?: boolean };

// shows "★ 4.5 (3)", used on service cards and on the details page
export default function RatingLine({ avg, count, showEmpty = false }: RatingLineProps) {
  if (!count) {
    return showEmpty ? <p className="text-sm text-slate-400">No reviews yet</p> : null;
  }
  return (
    <p className="text-sm font-semibold text-[var(--accent-ink)]">
      ★ {(avg ?? 0).toFixed(1)} <span className="font-normal text-slate-500">({count})</span>
    </p>
  );
}