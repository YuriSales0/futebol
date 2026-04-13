import { Skeleton } from '@/components/ui/skeleton'

export default function RankingLoading() {
  return (
    <div>
      <Skeleton className="h-7 w-40 mb-4" />
      <div className="grid grid-cols-3 gap-2 mb-4">
        <Skeleton className="h-10 rounded-xl" />
        <Skeleton className="h-10 rounded-xl" />
        <Skeleton className="h-10 rounded-xl" />
      </div>
      <div className="space-y-2">
        {[...Array(8)].map((_, i) => (
          <div key={i} className="flex items-center gap-3 p-3 bg-surface border border-border rounded-2xl">
            <Skeleton className="h-8 w-8 rounded-xl" />
            <Skeleton className="h-10 w-10 rounded-xl" />
            <div className="flex-1">
              <Skeleton className="h-4 w-32 mb-1" />
              <Skeleton className="h-3 w-24" />
            </div>
            <Skeleton className="h-6 w-10" />
          </div>
        ))}
      </div>
    </div>
  )
}
