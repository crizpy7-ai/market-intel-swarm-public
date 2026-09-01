import { useState } from 'react'
import { motion } from 'framer-motion'
import type { Risk } from '@/lib/swarm-api'
import { SeverityDot } from '@/components/ui/chips'
import { Panel } from '@/components/ui/panel'
import { SectionHeader } from '@/components/ui/section-header'
import { cn } from '@/lib/utils'

const EASE = [0.16, 1, 0.3, 1] as [number, number, number, number]

function xPos(likelihood: string): number {
  const l = likelihood.toLowerCase()
  if (l === 'low') return 0.15
  if (l === 'medium' || l === 'med') return 0.45
  if (l === 'med-high') return 0.68
  if (l === 'high') return 0.85
  return 0.95 // "—" / unknown → parked at right edge
}

function yPos(severity: string): number {
  const s = severity.toLowerCase()
  if (s === 'high') return 0.25
  if (s === 'medium' || s === 'med') return 0.65
  return 0.85
}

/** 12 / RISK MATRIX — likelihood × severity scatter + legend. */
export function RiskMatrix({ risks }: { risks: Risk[] }) {
  const [hovered, setHovered] = useState<number | null>(null)

  return (
    <section id="stage-risks" className="lg:col-span-6">
      <SectionHeader num="12" title="Risk Matrix" meta={`${risks.length} RISKS`} />
      <Panel className="mt-3">
        <div className="relative h-[220px]">
          {/* axes */}
          <motion.div
            className="absolute bottom-6 left-8 right-2 h-px origin-left bg-bright"
            initial={{ scaleX: 0 }}
            whileInView={{ scaleX: 1 }}
            viewport={{ once: true, amount: 0.4 }}
            transition={{ duration: 0.5, ease: EASE }}
            aria-hidden
          />
          <motion.div
            className="absolute bottom-6 left-8 top-2 w-px origin-bottom bg-bright"
            initial={{ scaleY: 0 }}
            whileInView={{ scaleY: 1 }}
            viewport={{ once: true, amount: 0.4 }}
            transition={{ duration: 0.5, ease: EASE }}
            aria-hidden
          />
          <span className="absolute -bottom-0 left-8 font-mono text-[9px] uppercase tracking-[0.1em] text-inkfaint">
            LIKELIHOOD →
          </span>
          <span className="absolute left-0 top-2 -rotate-90 font-mono text-[9px] uppercase tracking-[0.1em] text-inkfaint">
            SEVERITY ↑
          </span>

          {/* risk squares */}
          {risks.map((r, i) => {
            const x = xPos(r.likelihood)
            const y = yPos(r.severity)
            const unknown = r.likelihood === '—' || r.likelihood === '-'
            const active = hovered === i
            return (
              <motion.div
                key={r.risk}
                className="absolute"
                style={{
                  left: `calc(2rem + (100% - 3.25rem) * ${x})`,
                  top: `calc(0.5rem + (100% - 2.5rem) * ${y})`,
                }}
                initial={{ scale: 0, opacity: 0 }}
                whileInView={{ scale: 1, opacity: 1 }}
                viewport={{ once: true }}
                transition={{ delay: 0.4 + i * 0.07, type: 'spring', stiffness: 380, damping: 16 }}
              >
                <button
                  type="button"
                  onMouseEnter={() => setHovered(i)}
                  onMouseLeave={() => setHovered(null)}
                  onFocus={() => setHovered(i)}
                  onBlur={() => setHovered(null)}
                  className={cn(
                    'relative flex h-3.5 w-3.5 cursor-pointer items-center justify-center rounded-[1px] transition-transform',
                    r.severity.toLowerCase() === 'high' ? 'bg-down' : 'bg-warn',
                    active && 'scale-125 ring-1 ring-ink',
                  )}
                  aria-label={r.risk}
                >
                  {unknown && (
                    <span className="font-mono text-[9px] font-bold text-abyss">?</span>
                  )}
                </button>
                {/* tooltip */}
                {active && (
                  <div className="absolute left-4 top-0 z-10 w-44 rounded border border-bright bg-panel2 p-2 shadow-lg">
                    <p className="text-[11px] font-medium text-ink">{r.risk}</p>
                    <p className="mt-0.5 text-[10px] leading-snug text-inkdim">{r.note}</p>
                  </div>
                )}
              </motion.div>
            )
          })}
        </div>

        {/* legend */}
        <div className="mt-4 space-y-1.5 border-t border-hair pt-3">
          {risks.map((r, i) => (
            <button
              key={r.risk}
              type="button"
              onMouseEnter={() => setHovered(i)}
              onMouseLeave={() => setHovered(null)}
              className={cn(
                'flex w-full cursor-pointer items-baseline gap-2 rounded px-1.5 py-1 text-left transition-colors',
                hovered === i ? 'bg-panel2' : 'hover:bg-panel2/60',
              )}
            >
              <SeverityDot severity={r.severity} className="translate-y-[-1px]" />
              <span className="shrink-0 text-[12px] font-medium text-ink">{r.risk}</span>
              <span className="truncate text-[11px] text-inkdim">{r.note}</span>
              <span className="ml-auto shrink-0 font-mono text-[10px] uppercase text-inkfaint">
                {r.likelihood}
              </span>
            </button>
          ))}
        </div>
      </Panel>
    </section>
  )
}
