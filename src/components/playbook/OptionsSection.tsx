import { useState } from 'react'
import type { PlaybookOption } from '@/lib/swarm-api'
import { cn } from '@/lib/utils'
import { OptionCard } from './OptionCard'

interface OptionsSectionProps {
  kind: 'call' | 'put'
  items: PlaybookOption[]
}

/**
 * Section header + 3-col grid of option trade cards (calls = green family,
 * puts = red family). One card at a time can expand to full-width detail.
 */
export function OptionsSection({ kind, items }: OptionsSectionProps) {
  const [expandedIdx, setExpandedIdx] = useState<number | null>(null)
  const isCall = kind === 'call'

  return (
    <section className="mt-12">
      {/* Section header (SectionHeader layout + direction chip) */}
      <div className="flex scroll-mt-20 items-center gap-3">
        <span className="font-mono text-[13px] font-medium tracking-[0.14em] text-inkfaint">
          {isCall ? '01' : '02'} <span className="text-inkfaint/60">/</span>
        </span>
        <h2 className="font-display text-[13px] font-bold uppercase tracking-[0.14em] text-ink">
          {isCall ? 'TOP CALL OPTIONS' : 'TOP PUT OPTIONS'}
        </h2>
        <span
          className={cn(
            'inline-flex items-center gap-1 rounded-[2px] border px-1.5 py-0.5',
            'font-mono text-[10px] uppercase leading-none tracking-[0.1em]',
            isCall
              ? 'border-up/50 bg-up/10 text-up'
              : 'border-down/50 bg-down/10 text-down',
          )}
        >
          <span aria-hidden>{isCall ? '▲' : '▼'}</span>
          {isCall ? 'BULLISH' : 'BEARISH'}
        </span>
        <div className="h-px flex-1 bg-hair" aria-hidden />
        <span className="font-mono text-[10px] uppercase tracking-[0.1em] text-inkfaint">
          {items.length} CONTRACTS
        </span>
      </div>

      <div className="mt-4 grid grid-cols-1 gap-3 lg:grid-cols-3">
        {items.map((opt, i) => (
          <OptionCard
            key={`${opt.underlying}-${opt.contract}`}
            opt={opt}
            kind={kind}
            index={i}
            expanded={expandedIdx === i}
            onToggle={() => setExpandedIdx((cur) => (cur === i ? null : i))}
          />
        ))}
      </div>
    </section>
  )
}
