import { Fragment, useMemo, useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { ChevronDown } from 'lucide-react'
import type { OptionsFlowRow } from '@/lib/swarm-api'
import { dash } from '@/lib/swarm-api'
import { BiasChip } from '@/components/ui/chips'
import { Panel } from '@/components/ui/panel'
import { SectionHeader } from '@/components/ui/section-header'
import { cn } from '@/lib/utils'

const EASE = [0.16, 1, 0.3, 1] as [number, number, number, number]

type SortKey = 'pcr_vol' | 'pcr_oi' | 'atm_iv' | 'exp_move'

const SIGNAL_TINT: Record<string, string> = {
  bullish: 'bg-up/[0.04]',
  bearish: 'bg-down/[0.04]',
  defensive: 'bg-warn/[0.04]',
}

function Th({
  label,
  sortKey,
  sort,
  onSort,
}: {
  label: string
  sortKey?: SortKey
  sort: { key: SortKey; dir: 1 | -1 } | null
  onSort: (k: SortKey) => void
}) {
  const active = sortKey && sort?.key === sortKey
  return (
    <th className="px-3 py-2 text-left font-mono text-[10px] font-medium uppercase tracking-[0.1em] text-inkfaint">
      {sortKey ? (
        <button
          type="button"
          onClick={() => onSort(sortKey)}
          className={cn(
            'inline-flex cursor-pointer items-center gap-1 uppercase transition-colors hover:text-phosphor',
            active && 'text-phosphor',
          )}
        >
          {label}
          <span className="text-[9px]">{active ? (sort?.dir === 1 ? '▲' : '▼') : '↕'}</span>
        </button>
      ) : (
        label
      )}
    </th>
  )
}

/** 07 / OPTIONS FLOW — sortable, expandable flow table. */
export function OptionsFlow({ rows }: { rows: OptionsFlowRow[] }) {
  const [sort, setSort] = useState<{ key: SortKey; dir: 1 | -1 } | null>(null)
  const [open, setOpen] = useState<string | null>(null)

  const sorted = useMemo(() => {
    if (!sort) return rows
    return [...rows].sort((a, b) => {
      const av = a[sort.key]
      const bv = b[sort.key]
      if (av === null && bv === null) return 0
      if (av === null) return 1
      if (bv === null) return -1
      return (av - bv) * sort.dir
    })
  }, [rows, sort])

  const onSort = (key: SortKey) =>
    setSort((s) => (s?.key === key ? { key, dir: s.dir === 1 ? -1 : 1 } : { key, dir: 1 }))

  return (
    <section id="stage-options" className="lg:col-span-8 lg:row-span-2">
      <SectionHeader num="07" title="Options Flow" meta={`${rows.length} UNDERLYINGS`} />
      <Panel className="mt-3 p-0 md:p-0">
        <div className="overflow-x-auto">
          <table className="w-full min-w-[640px] border-collapse">
            <thead>
              <tr className="border-b border-hair bg-panel2">
                <Th label="Ticker" sort={sort} onSort={onSort} />
                <Th label="Expiry" sort={sort} onSort={onSort} />
                <Th label="P/C Vol" sortKey="pcr_vol" sort={sort} onSort={onSort} />
                <Th label="P/C OI" sortKey="pcr_oi" sort={sort} onSort={onSort} />
                <Th label="ATM IV" sortKey="atm_iv" sort={sort} onSort={onSort} />
                <Th label="Exp Move ±%" sortKey="exp_move" sort={sort} onSort={onSort} />
                <Th label="Signal" sort={sort} onSort={onSort} />
                <th className="w-8" />
              </tr>
            </thead>
            <tbody>
              {sorted.map((r, i) => {
                const isOpen = open === r.ticker
                return (
                  <Fragment key={r.ticker}>
                    <motion.tr
                      layout="position"
                      onClick={() => setOpen(isOpen ? null : r.ticker)}
                      className={cn(
                        'cursor-pointer border-b border-hair transition-colors hover:bg-panel2',
                        isOpen && 'bg-panel2',
                        SIGNAL_TINT[r.signal.toLowerCase()],
                      )}
                      initial={{ opacity: 0, y: 8 }}
                      whileInView={{ opacity: 1, y: 0 }}
                      viewport={{ once: true, amount: 0.3 }}
                      transition={{ delay: i * 0.05, duration: 0.3, ease: EASE }}
                    >
                      <td className="px-3 py-2.5 font-mono text-[12px] font-bold text-ink">
                        {r.ticker}
                      </td>
                      <td className="px-3 py-2.5 font-mono text-[12px] tabular-nums text-inkdim">
                        {r.expiry}
                      </td>
                      <td className="px-3 py-2.5 font-mono text-[12px] tabular-nums text-ink">
                        {r.pcr_vol === null ? '—' : r.pcr_vol.toFixed(2)}
                      </td>
                      <td className="px-3 py-2.5 font-mono text-[12px] tabular-nums text-ink">
                        {r.pcr_oi === null ? '—' : r.pcr_oi.toFixed(2)}
                      </td>
                      <td className="px-3 py-2.5 font-mono text-[12px] tabular-nums text-ink">
                        {r.atm_iv === null ? '—' : `${r.atm_iv}%`}
                      </td>
                      <td className="px-3 py-2.5 font-mono text-[12px] tabular-nums text-ink">
                        {r.exp_move === null ? '—' : `±${r.exp_move.toFixed(1)}%`}
                      </td>
                      <td className="px-3 py-2.5">
                        <BiasChip bias={r.signal} />
                      </td>
                      <td className="pr-3">
                        <ChevronDown
                          className={cn(
                            'h-3.5 w-3.5 text-inkfaint transition-transform duration-200',
                            isOpen && 'rotate-180',
                          )}
                        />
                      </td>
                    </motion.tr>
                    <AnimatePresence>
                      {isOpen && (
                        <tr key={`${r.ticker}-detail`}>                          <td colSpan={8} className="border-b border-hair p-0">
                            <motion.div
                              initial={{ height: 0, opacity: 0 }}
                              animate={{ height: 'auto', opacity: 1 }}
                              exit={{ height: 0, opacity: 0 }}
                              transition={{ duration: 0.2, ease: 'easeInOut' }}
                              className="overflow-hidden"
                            >
                              <p className="px-3 py-2.5 text-[12px] leading-relaxed text-inkdim">
                                {dash(r.detail)}
                              </p>
                            </motion.div>
                          </td>
                        </tr>
                      )}
                    </AnimatePresence>
                  </Fragment>
                )
              })}
            </tbody>
          </table>
        </div>
      </Panel>
    </section>
  )
}
