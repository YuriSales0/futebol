import { Skeleton } from '@/components/ui/skeleton'

export default function ProfileLoading() {
  return (
    <div className="space-y-4">
      {/* Player card */}
      <div className="bg-surface border border-border rounded-3xl p-5">
        <div className="flex items-start gap-4">
          <Skeleton className="h-20 w-20 rounded-2xl" />
          <div className="flex-1">
            <Skeleton className="h-6 w-40 mb-2" />
            <Skeleton className="h-4 w-24 mb-3" />
            <div className="flex gap-2">
              <Skeleton className="h-5 w-12 rounded-lg" />
              <Skeleton className="h-5 w-20 rounded-lg" />
              <Skeleton className="h-5 w-16 rounded-lg" />
            </div>
          </div>
        </div>
        <div className="grid grid-cols-4 gap-2 mt-5">
          {[...Array(4)].map((_, i) => (
            <Skeleton key={i} className="h-20 rounded-xl" />
          ))}
        </div>
      </div>
      {/* Radar chart */}
      <div className="bg-surface border border-border rounded-2xl p-5">
        <Skeleton className="h-4 w-32 mb-4" />
        <Skeleton className="h-64 w-64 rounded-full mx-auto" />
      </div>
    </div>
  )
}
