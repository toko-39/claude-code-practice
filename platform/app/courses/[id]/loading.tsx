export default function CourseDetailLoading() {
  return (
    <>
      {/* Hero skeleton */}
      <div className="bg-liner-to-br from-slate-900 via-violet-950 to-slate-900 px-4 py-12 md:px-6">
        <div className="mx-auto max-w-7xl">
          <div className="mb-6 h-4 w-32 animate-pulse rounded bg-white/10" />
          <div className="h-9 w-2/3 animate-pulse rounded-lg bg-white/10" />
          <div className="mt-3 h-5 w-full max-w-xl animate-pulse rounded bg-white/10" />
          <div className="mt-2 h-5 w-3/4 max-w-lg animate-pulse rounded bg-white/10" />
          <div className="mt-6 flex gap-5">
            {[80, 100, 72].map((w, i) => (
              <div
                key={i}
                className="h-4 animate-pulse rounded bg-white/10"
                style={{ width: w }}
              />
            ))}
          </div>
        </div>
      </div>

      {/* Content skeleton */}
      <main className="mx-auto w-full max-w-7xl px-4 py-10 md:px-6">
        {/* Progress bar skeleton */}
        <div className="mb-8 rounded-2xl bg-white p-5 shadow-sm ring-1 ring-gray-100">
          <div className="flex justify-between">
            <div className="h-4 w-24 animate-pulse rounded bg-gray-200" />
            <div className="h-4 w-16 animate-pulse rounded bg-gray-200" />
          </div>
          <div className="mt-3 h-2.5 w-full animate-pulse rounded-full bg-gray-200" />
        </div>

        {/* Section skeletons */}
        <div className="mb-4 h-7 w-40 animate-pulse rounded bg-gray-200" />
        <div className="flex flex-col gap-3">
          {[4, 3, 5].map((lessonCount, i) => (
            <div
              key={i}
              className="overflow-hidden rounded-xl border border-gray-200 bg-white"
            >
              <div className="flex items-center justify-between px-5 py-4">
                <div className="flex items-center gap-3">
                  <div className="h-7 w-7 animate-pulse rounded-full bg-gray-200" />
                  <div className="h-5 w-40 animate-pulse rounded bg-gray-200" />
                </div>
                <div className="h-4 w-20 animate-pulse rounded bg-gray-200" />
              </div>
              <div className="border-t border-gray-100">
                {Array.from({ length: lessonCount }).map((_, j) => (
                  <div
                    key={j}
                    className="flex items-center gap-4 border-b border-gray-100 px-5 py-3.5 last:border-0"
                  >
                    <div className="h-6 w-6 animate-pulse rounded-full bg-gray-100" />
                    <div className="h-4 w-4 animate-pulse rounded bg-gray-100" />
                    <div className="h-4 flex-1 animate-pulse rounded bg-gray-100" />
                    <div className="h-4 w-10 animate-pulse rounded bg-gray-100" />
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </main>
    </>
  );
}
