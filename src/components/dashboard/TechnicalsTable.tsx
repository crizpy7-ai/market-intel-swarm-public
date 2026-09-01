import { Fragment, useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { ChevronDown } from 'lucide-react'
import type { TechnicalRow } from '@/lib/swarm-api'
import { fmtPrice } from '@/lib/swarm-api'
import { Panel } from '@/components/ui/panel'
import { SectionHeader } from '@/components/ui/section-header'
import { cn } from '@/lib/utils'

const EASE = [0.16, 1, 0.3, 1] as [number, number, number, number]

function rsiColor(rsi: number): string {
  if (rsi > 70) return '#FFB224' // overbought — amber
  if (rsi < 30) return '#FF5C6C' // oversold — red
  return '#2EE5A0' // neutral band — green
}

/** Tiny 6px inline RSI bar on a 0–100 scale. */
function RsiBar({ rsi }: { rsi: number }) {
  return (
    <span className="inline-flex items-center gap-2">
      <span className="tabular-nums">{rsi.toFixed(1)}</span>
      <span className="relative inline-block h-1.5 w-10 overflow-hidden rounded-[1px] bg-hair align-middle">
        <motion.span
          className="absolute inset-y-0 left-0"
          style={{ backgroundColor: rsiColor(rsi) }}
          initial={{ width: 0 }}
          whileInView={{ width: `${Math.min(100, rsi)}%` }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, ease: EASE }}
        />
      </span>
    </span>
  )
}

/** 60px range visual: lo20 → hi20 with a tick at last. */
function RangeVisual({ row }: { row: TechnicalRow }) {
  const span = row.hi20 - row.lo20
  const pos = span > 0 ? Math.max(0, Math.min(1, (row.last - row.lo20) / span)) : 0.5
  return (
    <span className="relative inline-block h-4 w-[60px] opacity-0 transition-opacity group-hover:opacity-100">
      <span className="absolute left-0 right-0 top-1/2 h-px -translate-y-1/2 bg-bright" />
      <span
        className="absolute top-1/2 h-2 w-[2px] -translate-y-1/2 bg-phosphor"
        style={{ left: `${pos * 100}%` }}
      />
    </span>
  )
}

const ladder = (levels: number[]) => levels.map((l) => fmtPrice(l, l % 1 ? 1 : 0)).join(' · ')

/** 10 / TECHNICALS — full-width sortable-free table with expandable S/R ladders. */
export function TechnicalsTable({ rows }: { rows: TechnicalRow[] }) {
  const [open, setOpen] = useState<string | null>(null)

  return (
    <section id="stage-technicals" className="lg:col-span-12">
      <SectionHeader num="10" title="Technicals" meta={`${rows.length} TICKERS`} />
      <Panel className="mt-3 p-0 md:p-0">
        <div className="overflow-x-auto">
          <table className="w-full min-w-[900px] border-collapse">
            <thead>
              <tr className="border-b border-hair bg-panel2">
                {['TICKER', 'LAST', 'RSI', 'MA20', 'MA50', '20D HI', '20D LO', 'ATR', 'SUPPORT', 'RESISTANCE'].map(
                  (h) => (
                    <th
                      key={h}
                      className="px-3 py-2 text-left font-mono text-[10px] font-medium uppercase tracking-[0.1em] text-inkfaint"
                    >
                      {h}
                    </th>
                  ),
                )}
                <th className="w-10" />
              </tr>
            </thead>
            <tbody>
              {rows.map((r, i) => {
                const aboveMa50 = r.last >= r.ma50
                const isOpen = open === r.ticker
                const atrPct = r.last > 0 ? (r.atr / r.last) * 100 : 0
                return (
                  <Fragment key={r.ticker}>
                    <motion.tr
                      onClick={() => setOpen(isOpen ? null : r.ticker)}
                      className={cn(
                        'group cursor-pointer border-b border-hair transition-colors hover:bg-panel2',
                        isOpen && 'bg-panel2',
                      )}
                      initial={{ opacity: 0, y: 8 }}
                      whileInView={{ opacity: 1, y: 0 }}
                      viewport={{ once: true, amount: 0.3 }}
                      transition={{ delay: i * 0.04, duration: 0.3, ease: EASE }}
                    >
                      <td className="px-3 py-2.5 font-mono text-[12px] font-bold text-ink">
                        {r.ticker}
                      </td>
                      <td
                        className={cn(
                          'px-3 py-2.5 font-mono text-[12px] tabular-nums',
                          aboveMa50 ? 'text-up' : 'text-down',
                        )}
                      >
                        {fmtPrice(r.last)}
                      </td>
                      <td className="px-3 py-2.5 font-mono text-[12px] text-ink">
                        <RsiBar rsi={r.rsi} />
                      </td>
                      <td className="px-3 py-2.5 font-mono text-[12px] tabular-nums text-inkdim">
                        {fmtPrice(r.ma20, 1)}
                      </td>
                      <td className="px-3 py-2.5 font-mono text-[12px] tabular-nums text-inkdim">
                        {fmtPrice(r.ma50, 1)}
                      </td>
                      <td className="px-3 py-2.5 font-mono text-[12px] tabular-nums text-inkdim">
                        {fmtPrice(r.hi20, 1)}
                      </td>
                      <td className="px-3 py-2.5 font-mono text-[12px] tabular-nums text-inkdim">
                        {fmtPrice(r.lo20, 1)}
                      </td>
                      <td className="px-3 py-2.5 font-mono text-[12px] tabular-nums text-ink">
                        {fmtPrice(r.atr)}
                      </td>
                      <td className="px-3 py-2.5 font-mono text-[11px] tabular-nums text-inkdim">
                        {ladder(r.support)}
                      </td>
                      <td className="px-3 py-2.5 font-mono text-[11px] tabular-nums text-inkdim">
                        {ladder(r.resistance)}
                      </td>
                      <td className="pr-3">
                        <span className="inline-flex items-center gap-1">
                          <RangeVisual row={r} />
                          <ChevronDown
                            className={cn(
                              'h-3.5 w-3.5 text-inkfaint transition-transform duration-200',
                              isOpen && 'rotate-180',
                            )}
                          />
                        </span>
                      </td>
                    </motion.tr>
                    <AnimatePresence>
                      {isOpen && (
                        <tr key={`${r.ticker}-detail`}>
                          <td colSpan={11} className="border-b border-hair bg-panel2/50 p-0">
                            <motion.div
                              initial={{ height: 0, opacity: 0 }}
                              animate={{ height: 'auto', opacity: 1 }}
                              exit={{ height: 0, opacity: 0 }}
                              transition={{ duration: 0.2, ease: 'easeInOut' }}
                              className="overflow-hidden"
                            >
                              <div className="grid gap-2 px-4 py-3 font-mono text-[12px] tabular-nums text-inkdim sm:grid-cols-3">
                                <p>
                                  <span className="text-inkfaint">SUPPORT LADDER </span>
                                  {ladder(r.support)}
                                </p>
                                <p>
                                  <span className="text-inkfaint">RESISTANCE LADDER </span>
                                  {ladder(r.resistance)}
                                </p>
                                <p>
                                  <span className="text-inkfaint">ATR CTX </span>1 ATR = $
                                  {fmtPrice(r.atr)} ≈ {atrPct.toFixed(1)}% of price
                                </p>
                              </div>
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
