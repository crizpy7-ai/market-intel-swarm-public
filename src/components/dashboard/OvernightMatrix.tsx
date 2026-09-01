import { useState } from 'react'
import { motion } from 'framer-motion'
import type { OvernightItem } from '@/lib/swarm-api'
import { fmtChg } from '@/lib/swarm-api'
import { CountUp } from '@/components/ui/count-up'
import { Panel } from '@/components/ui/panel'
import { SectionHeader } from '@/components/ui/section-header'
import { cn } from '@/lib/utils'

const EASE = [0.16, 1, 0.3, 1] as [number, number, number, number]

function MatrixCell({ item, index }: { item: OvernightItem; index: number }) {
  const [expanded, setExpanded] = useState(false)
  const up = item.chg >= 0
  const digits = item.price < 10 ? 3 : item.price >= 10000 ? 2 : 2

  return (
    <motion.button
      type="button"
      onClick={() => setExpanded((e) => !e)}
      initial={{ opacity: 0, y: 12 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.3 }}
      transition={{ delay: index * 0.04, duration: 0.4, ease: EASE }}
      className={cn(
        'cursor-pointer rounded border border-hair bg-panel2/40 p-3 text-left transition-colors',
        'hover:border-bright hover:bg-panel2',
        item.warn && 'border-l-2 border-l-warn',
      )}
    >
      <div className="flex items-baseline justify-between gap-2">
        <p className="font-mono text-[10px] uppercase tracking-[0.1em] text-inkfaint">
          {item.symbol}
          {item.warn && <span className="ml-1.5 text-warn">▲ WATCH</span>}
        </p>
        <p className={cn('font-mono text-[12px] tabular-nums', up ? 'text-up' : 'text-down')}>
          {fmtChg(item.chg)}
        </p>
      </div>
      <p className="mt-0.5 text-[11px] text-inkdim">{item.name}</p>
      <p className="mt-1 text-[20px] font-semibold leading-none">
        <CountUp value={item.price} digits={digits} grouped className="text-ink" />
      </p>
      <motion.p
        className={cn('overflow-hidden text-[11px] leading-snug text-inkdim')}
        initial={false}
        animate={{ height: 'auto' }}
      >
        <span className={cn(!expanded && 'line-clamp-2')}>{item.note}</span>
      </motion.p>
    </motion.button>
  )
}

/** 01 / OVERNIGHT MATRIX — 10 instruments as a 5×2 grid (2×5 mobile). */
export function OvernightMatrix({ items }: { items: OvernightItem[] }) {
  return (
    <section id="stage-overnight" className="lg:col-span-12">
      <SectionHeader num="01" title="Overnight Matrix" meta={`${items.length} INSTRUMENTS`} />
      <Panel className="mt-3">
        <div className="grid grid-cols-2 gap-3 md:grid-cols-5">
          {items.map((item, i) => (
            <MatrixCell key={item.symbol} item={item} index={i} />
          ))}
        </div>
      </Panel>
    </section>
  )
}
