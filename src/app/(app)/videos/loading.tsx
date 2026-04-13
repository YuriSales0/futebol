import { Skeleton } from '@/components/ui/skeleton'

export default function VideosLoading() {
  return (
    <div>
      <div className="flex items-center justify-between mb-4">
        <Skeleton className="h-7 w-32" />
        <Skeleton className="h-9 w-24 rounded-lg" />
      </div>
      <div className="space-y-2">
        {[...Array(4)].map((_, i) => (
          <div key={i} className="flex items-start gap-3 p-3 border border-border rounded-lg">
            <Skeleton className="h-16 w-16 rounded-md" />
            <div className="flex-1">
              <Skeleton className="h-4 w-40 mb-2" />
              <Skeleton className="h-3 w-24" />
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
