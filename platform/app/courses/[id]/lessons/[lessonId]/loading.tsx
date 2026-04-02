export default function LessonLoading() {
  return (
    <div className="flex flex-1 flex-col lg:flex-row">
      {/* Main */}
      <div className="flex flex-1 flex-col">
        {/* Dark header skeleton */}
        <div className="bg-gray-900 px-4 py-3 md:px-6">
          <div className="flex items-center gap-2">
            <div className="h-4 w-16 animate-pulse rounded bg-white/10" />
            <div className="h-3 w-3 animate-pulse rounded bg-white/10" />
            <div className="h-4 w-32 animate-pulse rounded bg-white/10" />
            <div className="h-3 w-3 animate-pulse rounded bg-white/10" />
            <div className="h-4 w-40 animate-pulse rounded bg-white/10" />
          </div>
        </div>

        {/* Player skeleton */}
        <div className="bg-gray-950 px-4 py-6 md:px-8">
          <div className="aspect-video w-full animate-pulse rounded-xl bg-gray-800" />
        </div>

        {/* Info skeleton */}
        <div className="flex-1 px-4 py-6 md:px-8">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
            <div className="h-7 w-2/3 animate-pulse rounded-lg bg-gray-200" />
            <div className="h-9 w-28 animate-pulse rounded-xl bg-gray-200" />
          </div>
          <div className="mt-8 flex items-center justify-between border-t border-gray-100 pt-6">
            <div className="h-10 w-36 animate-pulse rounded-xl bg-gray-200" />
            <div className="h-10 w-36 animate-pulse rounded-xl bg-gray-200" />
          </div>
        </div>
      </div>

      {/* Sidebar skeleton */}
      <aside className="w-full shrink-0 border-t border-gray-200 bg-white lg:w-80 lg:border-l lg:border-t-0 xl:w-96">
        <div className="border-b border-gray-200 px-4 py-3">
          <div className="h-4 w-24 animate-pulse rounded bg-gray-200" />
        </div>
        <div className="p-4 flex flex-col gap-3">
          {[3, 4, 3].map((count, i) => (
            <div key={i} className="overflow-hidden rounded-xl border border-gray-100">
              <div className="px-4 py-3">
                <div className="h-5 w-3/4 animate-pulse rounded bg-gray-200" />
              </div>
              {Array.from({ length: count }).map((_, j) => (
                <div key={j} className="flex items-center gap-3 border-t border-gray-100 px-4 py-2.5">
                  <div className="h-5 w-5 animate-pulse rounded-full bg-gray-100" />
                  <div className="h-4 flex-1 animate-pulse rounded bg-gray-100" />
                  <div className="h-4 w-10 animate-pulse rounded bg-gray-100" />
                </div>
              ))}
            </div>
          ))}
        </div>
      </aside>
    </div>
  )
}
