// loading placeholder: same shape as the real service cards, so the page does not jump when data arrives
export default function Loading() {
  return (
    <div className="page-wrap section-gap" aria-busy="true" aria-label="Loading">
      <div className="skeleton mx-auto mb-3 h-6 w-28 rounded-full" />
      <div className="skeleton mx-auto mb-3 h-10 w-72 max-w-full" />
      <div className="skeleton mx-auto mb-10 h-5 w-96 max-w-full" />
      <div className="skeleton mb-8 h-20" />
      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
        {[1, 2, 3, 4, 5, 6, 7, 8].map((i) => (
          <div key={i} className="card-box overflow-hidden">
            <div className="skeleton aspect-[16/10] rounded-none" />
            <div className="space-y-3 p-5">
              <div className="skeleton h-5 w-3/4" />
              <div className="skeleton h-4 w-1/2" />
              <div className="skeleton h-4 w-2/3" />
              <div className="flex items-center justify-between pt-4">
                <div className="skeleton h-8 w-16" />
                <div className="skeleton h-8 w-28 rounded-full" />
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}