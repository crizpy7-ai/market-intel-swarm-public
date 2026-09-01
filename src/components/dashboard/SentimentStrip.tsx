import { motion } from 'framer-motion'
import type { Sentiment } from '@/lib/swarm-api'
import { BiasChip } from '@/components/ui/chips'
import { Panel } from '@/components/ui/panel'
import { SectionHeader } from '@/components/ui/section-header'

const EASE = [0.16, 1, 0.3, 1] as [number, number, number, number]

function bucket(bias: string): 'bull' | 'neutral' | 'caution' | 'bear' {
  const b = bias.toLowerCase()
  if (b === 'bullish') return 'bull'
  if (b === 'bearish') return 'bear'
  if (b === 'defensive' || b === 'cautious' || b === 'neutral-cautious') return 'caution'
  return 'neutral'
}

const SEG_COLORS: Record<string, string> = {
  bull: '#2EE5A0',
  neutral: '#4A5668',
  caution: '#FFB224',
  bear: '#FF5C6C',
}

/** 09 / SENTIMENT COMPOSITE — verdict + balance bar + gauge grid. */
export function SentimentStrip({ sentiment }: { sentiment: Sentiment }) {
  const gauges = sentiment.gauges
  const tally: Record<string, number> = { bull: 0, neutral: 0, caution: 0, bear: 0 }
  for (const g of gauges) tally[bucket(g.bias)]++
  const total = gauges.length || 1
  const segments = (['bull', 'neutral', 'caution', 'bear'] as const).filter((b) => tally[b] > 0)
  // Needle: net position from 0 (all bear) to 100 (all bull).
  const net =
    ((tally.bull * 1 + tally.neutral * 0.5 + tally.caution * 0.35 + tally.bear * 0) / total) * 100

  return (
    <section id="stage-sentiment" className="lg:col-span-12">
      <SectionHeader num="09" title="Sentiment Composite" meta={`${gauges.length} GAUGES`} />
      <Panel className="mt-3">
        <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
          {/* Left: verdict + balance bar */}
          <div>
            <p className="font-display text-[20px] font-medium leading-snug text-ink">
              {sentiment.composite}
            </p>
            <div className="relative mt-5">
              <div className="flex h-2 w-full overflow-hidden rounded-[2px] bg-hair">
                {segments.map((b, i) => (
                  <motion.div
                    key={b}
                    className="h-full"
                    style={{ backgroundColor: SEG_COLORS[b] }}
                    initial={{ width: 0 }}
                    whileInView={{ width: `${(tally[b] / total) * 100}%` }}
                    viewport={{ once: true, amount: 0.6 }}
                    transition={{ delay: i * 0.1, duration: 0.7, ease: EASE }}
                  />
                ))}
              </div>
              <motion.div
                className="absolute -top-1.5 h-5 w-[2px] bg-ink"
                style={{ left: `calc(${net}% - 1px)` }}
                initial={{ opacity: 0, y: -8 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: 0.6, type: 'spring', stiffness: 300, damping: 18 }}
                aria-hidden
              />
              <div className="mt-2 flex justify-between font-mono text-[9px] uppercase tracking-[0.1em] text-inkfaint">
                <span>BEARISH</span>
                <span>NEUTRAL</span>
                <span>BULLISH</span>
              </div>
            </div>
          </div>

          {/* Right: gauge mini-grid */}
          <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:col-span-2 xl:grid-cols-3">
            {gauges.map((g, i) => (
              <motion.div
                key={g.name}
                className="rounded border border-hair bg-panel2/50 p-3"
                initial={{ opacity: 0, y: 10 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, amount: 0.4 }}
                transition={{ delay: i * 0.06, duration: 0.35, ease: EASE }}
              >
                <p className="font-mono text-[10px] uppercase tracking-[0.1em] text-inkfaint">
                  {g.name}
                </p>
                <p className="mt-1 font-mono text-[12px] tabular-nums text-ink">{g.reading}</p>
                <div className="mt-2">
                  <BiasChip bias={g.bias} />
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </Panel>
    </section>
  )
}
