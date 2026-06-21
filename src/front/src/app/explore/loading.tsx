export default function ExploreLoading() {
  return (
    <div className="min-h-screen bg-white pt-32 px-8 lg:px-12">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-12">
          <div className="h-9 w-64 bg-black/5 rounded-lg animate-pulse mx-auto mb-4" />
          <div className="h-5 w-80 bg-black/5 rounded animate-pulse mx-auto" />
        </div>
        <div className="flex items-center justify-center gap-2 mb-8">
          {[...Array(7)].map((_, i) => (
            <div key={i} className="h-8 w-20 bg-black/5 rounded-lg animate-pulse" />
          ))}
        </div>
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {[...Array(6)].map((_, i) => (
            <div key={i} className="rounded-xl border border-black/5 p-6 space-y-3">
              <div className="h-5 w-3/4 bg-black/5 rounded animate-pulse" />
              <div className="h-3 w-1/2 bg-black/5 rounded animate-pulse" />
              <div className="h-4 w-20 bg-black/5 rounded-md animate-pulse" />
              <div className="h-2 w-full bg-black/5 rounded-full animate-pulse" />
              <div className="h-3 w-16 bg-black/5 rounded animate-pulse" />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
