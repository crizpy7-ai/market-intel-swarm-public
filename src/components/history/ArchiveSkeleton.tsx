import { cn } from '@/lib/utils'

function Bar({ className }: { className?: string }) {
  return (
    <div className={cn('archive-shimmer rounded-[2px] bg-panel2', className)} />
  )
}

/**
 * Loading state for the archive list: 5 skeleton rows with a 200px
 * gradient sweep (see history.css). Static under prefers-reduced-motion.
 */
export function ArchiveSkeleton() {
  return (
    <div className="divide-y divide-hair" aria-busy="true" aria-label="Loading archive">
      {Array.from({ length: 5 }).map((_, i) => (
        <div
          key={i}
          className="flex flex-col gap-3 px-4 py-4 md:flex-row md:items-center md:gap-6 md:px-5"
        >
          <div className="md:w-24">
            <Bar className="h-[18px] w-16" />
            <Bar className="mt-1.5 h-[10px] w-14" />
          </div>
          <div className="flex flex-1 items-center gap-3">
            <Bar className="h-[12px] w-40" />
            <Bar className="h-[18px] w-20" />
          </div>
          <div className="flex gap-2 max-md:w-full">
            <Bar className="h-[26px] w-20 max-md:flex-1" />
            <Bar className="h-[26px] w-24 max-md:flex-1" />
          </div>
        </div>
      ))}
    </div>
  )
}
