import { cn } from '@/lib/utils'

interface SectionHeaderProps {
  /** Two-digit stage number, e.g. "01". */
  num: string
  title: string
  /** Right-aligned meta, e.g. "10 INSTRUMENTS". */
  meta?: string
  /** Anchor id for stage-rail / quick-link navigation. */
  id?: string
  className?: string
}

/**
 * Shared section header: mono stage number in ink-faint + slash +
 * uppercase Space Grotesk title + thin rule extending right + optional meta.
 */
export function SectionHeader({ num, title, meta, id, className }: SectionHeaderProps) {
  return (
    <div id={id} className={cn('flex scroll-mt-20 items-center gap-3', className)}>
      <span className="font-mono text-[13px] font-medium tracking-[0.14em] text-inkfaint">
        {num} <span className="text-inkfaint/60">/</span>
      </span>
      <h2 className="font-display text-[13px] font-bold uppercase tracking-[0.14em] text-ink">
        {title}
      </h2>
      <div className="h-px flex-1 bg-hair" aria-hidden />
      {meta && (
        <span className="font-mono text-[10px] uppercase tracking-[0.1em] text-inkfaint">
          {meta}
        </span>
      )}
    </div>
  )
}
