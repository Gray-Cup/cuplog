export default function Loading() {
  return (
    <div className="p-6 md:p-8 space-y-8">
      <div className="flex items-start justify-between">
        <div className="space-y-2">
          <div className="h-7 w-32 bg-neutral-100 rounded animate-pulse" />
          <div className="h-4 w-48 bg-neutral-100 rounded animate-pulse" />
        </div>
        <div className="h-9 w-32 bg-neutral-100 rounded animate-pulse" />
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-px bg-neutral-200 border border-neutral-200">
        {Array.from({ length: 4 }).map((_, i) => (
          <div key={i} className="bg-white p-5 space-y-2">
            <div className="h-3 w-20 bg-neutral-100 rounded animate-pulse" />
            <div className="h-8 w-12 bg-neutral-100 rounded animate-pulse" />
          </div>
        ))}
      </div>

      <div className="space-y-3">
        <div className="h-5 w-36 bg-neutral-100 rounded animate-pulse" />
        <div className="border border-dashed border-neutral-200 h-48 bg-neutral-50 animate-pulse" />
      </div>
    </div>
  );
}
