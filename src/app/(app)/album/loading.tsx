import { Skeleton } from '@/components/ui/skeleton'

export default function AlbumLoading() {
  return (
    <div>
      <Skeleton className="h-7 w-32 mb-4" />
      {/* Progress card */}
      <div className="bg-surface border border-border rounded-2xl p-4 mb-4">
        <div className="flex items-center justify-between">
          <div>
            <Skeleton className="h-3 w-24 mb-2" />
            <Skeleton className="h-8 w-16" />
          </div>
          <Skeleton className="h-14 w-14 rounded-full" />
        </div>
      </div>
      {/* Dimension cards */}
      <div className="space-y-2">
        {[...Array(7)].map((_, i) => (
          <div key={i} className="bg-surface border border-border rounded-2xl p-4">
            <div className="flex items-center gap-3">
              <Skeleton className="h-12 w-12 rounded-xl" />
              <div className="flex-1">
                <Skeleton className="h-4 w-24 mb-2" />
                <Skeleton className="h-3 w-40" />
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
