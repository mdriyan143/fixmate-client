export default function Loading() {
  return (
    <div className="page-wrap section-gap">
      <div className="skeleton mb-8 h-10 w-64" />
      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {[1, 2, 3, 4, 5, 6].map((i) => (
          <div key={i} className="skeleton h-72" />
        ))}
      </div>
    </div>
  );
}
