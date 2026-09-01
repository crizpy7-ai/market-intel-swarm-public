import { useEffect, useMemo, useState } from 'react'
import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { RotateCcw } from 'lucide-react'
import { fmtUtcTime } from '@/lib/swarm-api'
import type { SwarmRun } from '@/lib/swarm-api'

const EASE: [number, number, number, number] = [0.16, 1, 0.3, 1]

/** Word-level typewriter (~15ms/char) with reduced-motion bypass. */
function useTypedWords(text: string): { typed: string; done: boolean } {
  const words = useMemo(() => text.split(' '), [text])
  const [count, setCount] = useState(0)

  useEffect(() => {
    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    if (reduced) {
      setCount(words.length)
      return
    }
    setCount(0)
    const id = setInterval(() => {
      setCount((c) => {
        if (c >= words.length) {
          clearInterval(id)
          return c
        }
        return c + 1
      })
    }, 75) // ≈15ms/char at ~5 chars/word
    return () => clearInterval(id)
  }, [words])

  return { typed: words.slice(0, count).join(' '), done: count >= words.length }
}

interface PlaybookHeaderProps {
  run: SwarmRun
  isArchive: boolean
}

/**
 * Playbook page header: run eyebrow (+ ARCHIVE VIEW chip), animated title
 * with red underline draw under "PLAYBOOK", typed subtitle, validity cell,
 * and archive "return to latest" ghost button.
 */
export function PlaybookHeader({ run, isArchive }: PlaybookHeaderProps) {
  const calls = run.playbook.calls.length
  const puts = run.playbook.puts.length
  const stocks = run.playbook.stocks.length
  const subtitle = `${calls} CALLS · ${puts} PUTS · ${stocks} STOCK SETUPS · VALID ${run.run_date} SESSION ONLY`
  const { typed, done } = useTypedWords(subtitle)

  const words = ['DAY', 'TRADING', 'PLAYBOOK']

  return (
    <header className="pb-6 pt-[88px]">
      <div className="flex flex-wrap items-end justify-between gap-6">
        <div className="min-w-0">
          {/* Eyebrow */}
          <div className="flex flex-wrap items-center gap-2">
            <p className="font-mono text-[11px] uppercase tracking-[0.12em] text-inkdim">
              RUN {run.run_date} · GENERATED {fmtUtcTime(run.generated_at_utc)} UTC
            </p>
            {isArchive && (
              <span className="inline-flex items-center rounded-[2px] border border-warn/50 bg-warn/10 px-1.5 py-0.5 font-mono text-[10px] uppercase leading-none tracking-[0.1em] text-warn">
                ARCHIVE VIEW
              </span>
            )}
          </div>

          {/* Title — words slide up, red underline draws under PLAYBOOK */}
          <h1 className="mt-3 font-display text-[28px] font-bold leading-tight tracking-[-0.02em] text-ink md:text-[36px]">
            {words.map((w, i) => (
              <span key={w} className="inline-block overflow-hidden pb-1 align-bottom">
                <motion.span
                  className="mr-3 inline-block"
                  initial={{ y: 24, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  transition={{ duration: 0.5, delay: i * 0.06, ease: EASE }}
                >
                  {w === 'PLAYBOOK' ? (
                    <span className="relative inline-block">
                      {w}
                      <motion.span
                        aria-hidden
                        className="absolute -bottom-0.5 left-0 h-[2px] w-full origin-left bg-down"
                        initial={{ scaleX: 0 }}
                        animate={{ scaleX: 1 }}
                        transition={{ duration: 0.5, delay: 0.3, ease: EASE }}
                      />
                    </span>
                  ) : (
                    w
                  )}
                </motion.span>
              </span>
            ))}
          </h1>

          {/* Subtitle — types in */}
          <p className="mt-3 font-mono text-[12px] uppercase tracking-[0.08em] text-inkdim">
            {typed}
            {!done && (
              <span aria-hidden className="animate-caret-blink text-inkdim">
                ▍
              </span>
            )}
          </p>
        </div>

        {/* Right side (desktop): validity cell + archive return */}
        <div className="hidden flex-col items-end gap-3 md:flex">
          {isArchive && (
            <Link
              to="/playbook"
              className="inline-flex items-center gap-1.5 rounded-[2px] border border-hair px-2.5 py-1.5 font-mono text-[10px] uppercase tracking-[0.1em] text-inkdim transition-colors hover:border-bright hover:bg-panel2 hover:text-ink"
            >
              <RotateCcw className="h-3 w-3" />
              Return to latest run
            </Link>
          )}
          <div className="border-b border-warn pb-1">
            <p className="font-mono text-[10px] uppercase tracking-[0.12em] text-inkdim">
              EXPIRES AT CASH CLOSE <span className="text-warn">4:00 PM ET</span>
            </p>
          </div>
        </div>
      </div>

      {/* Mobile archive return */}
      {isArchive && (
        <Link
          to="/playbook"
          className="mt-4 inline-flex items-center gap-1.5 rounded-[2px] border border-hair px-2.5 py-1.5 font-mono text-[10px] uppercase tracking-[0.1em] text-inkdim transition-colors hover:border-bright hover:bg-panel2 hover:text-ink md:hidden"
        >
          <RotateCcw className="h-3 w-3" />
          Return to latest run
        </Link>
      )}
    </header>
  )
}
