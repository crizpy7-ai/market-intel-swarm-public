import { motion } from 'framer-motion'
import type { SwarmRun } from '@/lib/swarm-api'
import { fmtChg, fmtLongDate, fmtUtcTime } from '@/lib/swarm-api'
import { CountUp } from '@/components/ui/count-up'
import { ParticleSwarm } from '@/components/dashboard/ParticleSwarm'
import { cn } from '@/lib/utils'

const EASE = [0.16, 1, 0.3, 1] as [number, number, number, number]

interface RunHeaderProps {
  run: SwarmRun
  isFallback: boolean
  isArchive: boolean
}

/** The four load-bearing numbers of the day: ES, VIX, 10Y, WTI. */
function miniStats(run: SwarmRun) {
  const find = (sym: string) => run.overnight.find((o) => o.symbol === sym)
  return [
    { label: 'ES=F', item: find('ES=F'), warn: false },
    { label: 'VIX', item: find('^VIX'), warn: true },
    { label: '10Y', item: find('^TNX'), warn: true },
    { label: 'WTI', item: find('CL=F'), warn: true },
  ]
}

export function RunHeader({ run, isFallback, isArchive }: RunHeaderProps) {
  const eyebrow = `RUN ${run.run_date} · GENERATED ${fmtUtcTime(run.generated_at_utc)} UTC · ${(
    run.session_label || ''
  ).toUpperCase()}`
  const words = fmtLongDate(run.run_date).split(' ')
  const stats = miniStats(run)

  const anchors = [
    { href: '#stage-playbook', label: 'PLAYBOOK ↓' },
    { href: '#stage-risks', label: 'RISKS ↓' },
    { href: '#stage-technicals', label: 'TECHNICALS ↓' },
  ]

  return (
    <section className="relative overflow-hidden border-b border-hair">
      <ParticleSwarm />
      <div className="relative mx-auto grid max-w-[1440px] grid-cols-1 gap-8 px-4 pb-12 pt-16 md:px-6 md:pt-20 lg:grid-cols-12">
        {/* Left: eyebrow + date + thesis */}
        <div className="lg:col-span-8">
          <div className="flex flex-wrap items-center gap-3">
            <motion.p
              className="font-mono text-[11px] tracking-[0.12em] text-inkdim"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.6 }}
            >
              {eyebrow}
            </motion.p>
            {isFallback && (
              <span className="rounded-[2px] border border-warn/50 bg-warn/10 px-1.5 py-0.5 font-mono text-[10px] uppercase tracking-[0.1em] text-warn">
                OFFLINE SNAPSHOT
              </span>
            )}
            {isArchive && (
              <span className="rounded-[2px] border border-warn/50 bg-warn/10 px-1.5 py-0.5 font-mono text-[10px] uppercase tracking-[0.1em] text-warn">
                ARCHIVE VIEW — {run.run_date}
              </span>
            )}
          </div>

          <h1 className="mt-4 font-display text-[28px] font-bold leading-[1.1] tracking-[-0.02em] text-ink md:text-[40px]">
            {words.map((w, i) => (
              <motion.span
                key={`${w}-${i}`}
                className="mr-[0.28em] inline-block"
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.15 + i * 0.07, duration: 0.6, ease: EASE }}
              >
                {w}
              </motion.span>
            ))}
            <motion.span
              className="block text-inkdim"
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.15 + words.length * 0.07, duration: 0.6, ease: EASE }}
            >
              PRE-MARKET BRIEF
            </motion.span>
          </h1>

          <motion.p
            className="mt-4 max-w-[560px] text-[18px] font-medium text-ink"
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5, duration: 0.5, ease: EASE }}
          >
            {run.sentiment.composite}
          </motion.p>

          <motion.div
            className="mt-6 flex flex-wrap gap-2"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.7, duration: 0.4 }}
          >
            {anchors.map((a) => (
              <a
                key={a.href}
                href={a.href}
                className="rounded-[2px] border border-hair px-2 py-1 font-mono text-[10px] uppercase tracking-[0.1em] text-inkdim transition-colors hover:border-phosphor/60 hover:text-phosphor"
              >
                {a.label}
              </a>
            ))}
          </motion.div>
        </div>

        {/* Right: 2×2 mini-stat grid */}
        <div className="grid grid-cols-2 gap-3 lg:col-span-4">
          {stats.map((s, i) => {
            const price = s.item?.price ?? null
            const chg = s.item?.chg ?? null
            const upColor = (chg ?? 0) >= 0
            return (
              <motion.div
                key={s.label}
                className="rounded border border-hair bg-panel p-3"
                initial={{ opacity: 0, x: 24 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.4 + i * 0.08, duration: 0.5, ease: EASE }}
              >
                <p className="font-mono text-[10px] uppercase tracking-[0.1em] text-inkfaint">
                  {s.label}
                  {s.item?.warn && <span className="ml-1.5 text-warn">▲ WATCH</span>}
                </p>
                <p className="mt-1.5 text-[22px] font-semibold leading-none">
                  {price !== null ? (
                    <CountUp
                      value={price}
                      digits={price < 10 ? 3 : 2}
                      grouped
                      className="text-ink"
                    />
                  ) : (
                    <span className="font-mono text-inkfaint">—</span>
                  )}
                </p>
                <p
                  className={cn(
                    'mt-1.5 font-mono text-[12px] tabular-nums',
                    s.warn ? 'text-warn' : upColor ? 'text-up' : 'text-down',
                  )}
                >
                  {fmtChg(chg)}
                </p>
              </motion.div>
            )
          })}
        </div>
      </div>
    </section>
  )
}
