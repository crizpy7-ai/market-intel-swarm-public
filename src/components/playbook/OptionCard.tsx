import { motion } from 'framer-motion'
import { X } from 'lucide-react'
import { ConfidenceMeter } from '@/components/ui/confidence-meter'
import type { PlaybookOption } from '@/lib/swarm-api'
import { cn } from '@/lib/utils'

const EASE: [number, number, number, number] = [0.16, 1, 0.3, 1]

/**
 * Best-effort reward fraction (0..1) parsed from the level strings, e.g.
 * entry "$1.30–$1.60", target "$2.40–$3.00 (stk …)", stop "$0.85 (−45%)".
 * Falls back to a 2:1 reward:risk split when parsing fails.
 */
function rewardFraction(entry: string, target: string, stop: string): number {
  const nums = (s: string) => (s.match(/\d+(?:\.\d+)?/g) ?? []).map(Number)
  const e = nums(entry)
  const t = nums(target)
  const s = nums(stop)
  if (!e.length || !t.length || !s.length) return 2 / 3
  const entryMid = e.length >= 2 ? (e[0] + e[1]) / 2 : e[0]
  const targetMid = t.length >= 2 ? (t[0] + t[1]) / 2 : t[0]
  const risk = entryMid - s[0]
  const reward = targetMid - entryMid
  if (risk <= 0 || reward <= 0) return 2 / 3
  return reward / (reward + risk)
}

interface LadderRow {
  label: string
  value: string
  tick: string
  text: string
}

interface OptionCardProps {
  opt: PlaybookOption
  kind: 'call' | 'put'
  index: number
  expanded: boolean
  onToggle: () => void
}

/**
 * Trade card: underlying/contract + confidence meter, levels ladder with
 * proportional reward:risk bar, clamped rationale, and a red-emphasized
 * invalidation block. Click toggles full-width detail mode.
 */
export function OptionCard({ opt, kind, index, expanded, onToggle }: OptionCardProps) {
  const isCall = kind === 'call'
  const rewardFrac = rewardFraction(opt.entry, opt.target, opt.stop)

  const ladder: LadderRow[] = [
    { label: 'ENTRY', value: opt.entry, tick: 'bg-inkfaint', text: 'text-ink' },
    { label: 'TARGET', value: opt.target, tick: 'bg-up', text: 'text-up' },
    { label: 'STOP', value: opt.stop, tick: 'bg-down', text: 'text-down' },
  ]

  return (
    <motion.article
      layout="position"
      role="button"
      tabIndex={0}
      aria-expanded={expanded}
      onClick={onToggle}
      onKeyDown={(e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault()
          onToggle()
        }
      }}
      className={cn(
        'group relative cursor-pointer overflow-hidden rounded border border-hair bg-panel p-4 transition-colors duration-200 hover:-translate-y-0.5 hover:border-bright md:p-5',
        expanded && 'lg:col-span-3',
      )}
      initial={{ opacity: 0, y: 28 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.15 }}
      transition={{
        duration: 0.5,
        delay: index * 0.09,
        ease: EASE,
        layout: { duration: 0.3 },
      }}
    >
      {/* 2px family accent line on the top edge */}
      <span
        aria-hidden
        className={cn('absolute inset-x-0 top-0 h-[2px]', isCall ? 'bg-up' : 'bg-down')}
      />

      {/* Top row: underlying + contract / confidence */}
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0">
          <h3 className="font-display text-[20px] font-bold leading-none text-ink">
            {opt.underlying}
          </h3>
          <p className="mt-1.5 font-mono text-[12px] text-inkdim">{opt.contract}</p>
        </div>
        <div className="flex shrink-0 items-start gap-2 pt-1">
          <div className="w-20 md:w-24">
            <p className="mb-1 text-right font-mono text-[9px] uppercase tracking-[0.12em] text-inkfaint">
              CONF
            </p>
            <ConfidenceMeter score={opt.confidence} />
          </div>
          {expanded && (
            <button
              type="button"
              aria-label="Collapse card"
              onClick={(e) => {
                e.stopPropagation()
                onToggle()
              }}
              className="cursor-pointer rounded-[2px] border border-hair p-1 text-inkdim transition-colors hover:border-bright hover:bg-panel2 hover:text-ink"
            >
              <X className="h-3.5 w-3.5" />
            </button>
          )}
        </div>
      </div>

      {/* Levels ladder */}
      <div className="mt-4 space-y-1.5">
        {ladder.map((row, i) => (
          <motion.div
            key={row.label}
            className="flex items-baseline gap-2.5"
            initial={{ opacity: 0, x: -10 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, amount: 0.6 }}
            transition={{ duration: 0.3, delay: 0.2 + index * 0.09 + i * 0.05, ease: EASE }}
          >
            <span aria-hidden className={cn('h-3.5 w-[2px] shrink-0 self-center', row.tick)} />
            <span className="w-12 shrink-0 font-mono text-[10px] uppercase tracking-[0.1em] text-inkfaint">
              {row.label}
            </span>
            <span
              className={cn(
                'font-mono text-[12px] tabular-nums md:text-[13px]',
                row.text,
              )}
            >
              {row.value}
            </span>
          </motion.div>
        ))}

        {/* Proportional reward:risk bar */}
        <div className="flex items-center gap-2.5 pt-1">
          <span className="h-3.5 w-[2px] shrink-0 bg-transparent" aria-hidden />
          <span className="w-12 shrink-0 font-mono text-[9px] uppercase tracking-[0.1em] text-inkfaint">
            R:R
          </span>
          <div className="flex h-[3px] flex-1 overflow-hidden rounded-[1px] bg-hair">
            <div className="h-full bg-up/70" style={{ width: `${rewardFrac * 100}%` }} />
            <div className="h-full flex-1 bg-down/70" />
          </div>
        </div>
      </div>

      {/* Rationale */}
      <div className="mt-4">
        <p className="font-mono text-[10px] uppercase tracking-[0.12em] text-inkfaint">
          RATIONALE
        </p>
        <p
          className={cn(
            'mt-1.5 text-[12.5px] leading-relaxed text-inkdim',
            !expanded && 'line-clamp-4',
          )}
        >
          {opt.rationale}
        </p>
        {!expanded && (
          <span className="mt-1 inline-block font-mono text-[10px] uppercase tracking-[0.1em] text-phosphor group-hover:underline">
            MORE
          </span>
        )}
      </div>

      {/* Invalidation — visually louder than rationale */}
      <div className="relative mt-4 overflow-hidden border-l-2 border-l-down">
        <motion.span
          aria-hidden
          className="absolute inset-0"
          initial={{ backgroundColor: 'rgba(255, 92, 108, 0)' }}
          whileInView={{
            backgroundColor: [
              'rgba(255, 92, 108, 0)',
              'rgba(255, 92, 108, 0.08)',
              'rgba(255, 92, 108, 0.04)',
              'rgba(255, 92, 108, 0.08)',
            ],
          }}
          viewport={{ once: true, amount: 0.6 }}
          transition={{ duration: 0.9, delay: 0.3 }}
        />
        <div className="relative px-3 py-2.5">
          <p className="font-mono text-[10px] uppercase tracking-[0.12em] text-down">
            INVALIDATION
          </p>
          <p
            className={cn(
              'mt-1.5 leading-relaxed text-ink/90',
              expanded ? 'text-[14px]' : 'text-[12.5px]',
            )}
          >
            {opt.invalidation}
          </p>
        </div>
      </div>
    </motion.article>
  )
}
