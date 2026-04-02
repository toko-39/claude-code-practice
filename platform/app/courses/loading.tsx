export default function CoursesLoading() {
  return (
    <main className="mx-auto w-full max-w-7xl px-4 py-10 md:px-6">
      {/* Hero skeleton */}
      <div className="mb-10">
        <div className="h-8 w-48 animate-pulse rounded-lg bg-gray-200" />
        <div className="mt-2 h-5 w-72 animate-pulse rounded-lg bg-gray-200" />
      </div>

      {/* Cards grid skeleton */}
      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
        {Array.from({ length: 8 }).map((_, i) => (
          <div key={i} className="overflow-hidden rounded-2xl bg-white shadow-sm ring-1 ring-gray-100">
            <div className="aspect-video w-full animate-pulse bg-gray-200" />
            <div className="p-4">
              <div className="h-5 w-3/4 animate-pulse rounded bg-gray-200" />
              <div className="mt-2 h-4 w-full animate-pulse rounded bg-gray-200" />
              <div className="mt-1 h-4 w-2/3 animate-pulse rounded bg-gray-200" />
            </div>
          </div>
        ))}
      </div>
    </main>
  )
}
