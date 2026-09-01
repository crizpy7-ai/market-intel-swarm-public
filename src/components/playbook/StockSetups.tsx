import { useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { BiasChip } from '@/components/ui/chips'
import { SectionHeader } from '@/components/ui/section-header'
import type { PlaybookStock } from '@/lib/swarm-api'
import { cn } from '@/lib/utils'

const EASE: [number, number, number, number] = [0.16, 1, 0.3, 1]

/** Core direction of a bias string like "long (momentum only)". */
function coreBias(bias: string): 'long' | 'short' | 'neutral' {
  const b = bias.toLowerCase()
  if (b.startsWith('long')) return 'long'
  if (b.startsWith('short')) return 'short'
  return 'neutral'
}

/** Parenthetical detail of the bias, e.g. "momentum only". */
function biasDetail(bias: string): string | null {
  const m = bias.match(/\(([^)]*)\)/)
  return m ? m[1] : null
}

interface RowTag {
  label: string
  tone: 'warn' | 'teal'
}

/** Derive the desk tags (MOMENTUM / RSI — SIZE SMALL / BMO TODAY) from the row data. */
function deriveTags(stock: PlaybookStock): RowTag[] {
  const tags: RowTag[] = []
  const bias = stock.bias.toLowerCase()
  if (bias.includes('momentum only')) tags.push({ label: 'MOMENTUM', tone: 'warn' })

  const rsiMatch = `${stock.levels} ${stock.invalidation}`.match(/RSI\s*(\d{2})/i)
  if (rsiMatch && Number(rsiMatch[1]) >= 70) {
    tags.push({ label: `RSI ${rsiMatch[1]} — SIZE SMALL`, tone: 'warn' })
  }

  if (/BMO today/i.test(stock.catalyst)) tags.push({ label: 'BMO TODAY', tone: 'teal' })
  return tags
}

const TAG_STYLES: Record<RowTag['tone'], string> = {
  warn: 'border-warn/50 bg-warn/10 text-warn',
  teal: 'border-phosphor/50 bg-phosphor/10 text-phosphor',
}

/**
 * Day-trade stock setups: dense desk-blotter rows (ticker + bias chip +
 * catalyst + levels + red invalidation). Click expands an inline detail
 * panel restating levels/invalidation at larger type.
 */
export function StockSetups({ stocks }: { stocks: PlaybookStock[] }) {
  const [open, setOpen] = useState<number | null>(null)

  return (
    <section className="mt-12">
      <SectionHeader
        num="03"
        title="Day-Trade Stock Setups"
        meta={`${stocks.length} SETUPS`}
        id="stock-setups"
      />

      <div className="mt-4 divide-y divide-hair border-y border-hair">
        {stocks.map((s, i) => {
          const core = coreBias(s.bias)
          const detail = biasDetail(s.bias)
          const tags = deriveTags(s)
          const isOpen = open === i
          const long = core === 'long'

          return (
            <div key={`${s.ticker}-${i}`}>
              <motion.div
                role="button"
                tabIndex={0}
                aria-expanded={isOpen}
                onClick={() => setOpen((cur) => (cur === i ? null : i))}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' || e.key === ' ') {
                    e.preventDefault()
                    setOpen((cur) => (cur === i ? null : i))
                  }
                }}
                className="grid cursor-pointer grid-cols-1 gap-2 px-2 py-3.5 transition-colors hover:bg-panel2 lg:grid-cols-[190px_minmax(0,1fr)_minmax(0,1.2fr)_minmax(0,1fr)] lg:items-start lg:gap-4"
                initial={{ opacity: 0, x: -16 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true, amount: 0.4 }}
                transition={{ duration: 0.4, delay: i * 0.05, ease: EASE }}
              >
                {/* Ticker + bias + tags */}
                <div>
                  <div className="flex flex-wrap items-center gap-1.5">
                    <span className="font-mono text-[16px] font-bold tabular-nums text-ink">
                      {s.ticker}
                    </span>
                    <BiasChip bias={core} />
                    {tags.map((t) => (
                      <span
                        key={t.label}
                        className={cn(
                          'inline-flex items-center rounded-[2px] border px-1.5 py-0.5',
                          'font-mono text-[10px] uppercase leading-none tracking-[0.1em]',
                          TAG_STYLES[t.tone],
                        )}
                      >
                        {t.label}
                      </span>
                    ))}
                  </div>
                  {detail && (
                    <p className="mt-1 font-mono text-[10px] uppercase tracking-[0.08em] text-inkfaint">
                      ({detail})
                    </p>
                  )}
                  {/* bias underline bar draws in */}
                  <motion.span
                    aria-hidden
                    className={cn(
                      'mt-1.5 block h-[2px] w-10 origin-left',
                      core === 'neutral' ? 'bg-inkfaint' : long ? 'bg-up' : 'bg-down',
                    )}
                    initial={{ scaleX: 0 }}
                    whileInView={{ scaleX: 1 }}
                    viewport={{ once: true, amount: 0.6 }}
                    transition={{ duration: 0.4, delay: 0.15 + i * 0.05, ease: EASE }}
                  />
                </div>

                {/* Catalyst */}
                <p className="text-[12.5px] leading-relaxed text-inkdim">{s.catalyst}</p>

                {/* Levels */}
                <p className="font-mono text-[12.5px] leading-relaxed tabular-nums text-ink">
                  {s.levels}
                </p>

                {/* Invalidation */}
                <p className="flex items-start gap-1.5 text-[12px] leading-relaxed text-down/80">
                  <span aria-hidden className="mt-px shrink-0 text-down">
                    ✕
                  </span>
                  {s.invalidation}
                </p>
              </motion.div>

              {/* Inline detail panel */}
              <AnimatePresence initial={false}>
                {isOpen && (
                  <motion.div
                    key="detail"
                    className="overflow-hidden"
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: 'auto', opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.25, ease: EASE }}
                  >
                    <div className="grid grid-cols-1 gap-4 border-t border-hair bg-panel2/50 px-2 py-4 lg:grid-cols-2">
                      <div>
                        <p className="font-mono text-[10px] uppercase tracking-[0.12em] text-inkfaint">
                          LEVELS — {s.ticker}
                        </p>
                        <p className="mt-1.5 font-mono text-[13.5px] leading-relaxed tabular-nums text-ink">
                          {s.levels}
                        </p>
                      </div>
                      <div className="border-l-2 border-l-down bg-down/[0.08] px-3 py-2.5">
                        <p className="font-mono text-[10px] uppercase tracking-[0.12em] text-down">
                          INVALIDATION
                        </p>
                        <p className="mt-1.5 text-[13.5px] leading-relaxed text-ink/90">
                          {s.invalidation}
                        </p>
                      </div>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          )
        })}
      </div>
    </section>
  )
}
