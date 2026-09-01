import { motion } from 'framer-motion'

const EASE: [number, number, number, number] = [0.16, 1, 0.3, 1]

interface SwitchBranches {
  head: string
  up: string | null
  down: string | null
}

/**
 * Split the master_switch string into a head line plus the `>` (calls/longs)
 * and `<` (puts/shorts) branch clauses. Falls back to the raw string when no
 * branch markers are present.
 */
function parseMasterSwitch(raw: string): SwitchBranches {
  const upMatch = raw.match(/>([^;<]*)/)
  const downMatch = raw.match(/<([^;]*)/)
  if (!upMatch && !downMatch) return { head: raw, up: null, down: null }

  const firstIdx = Math.min(
    upMatch?.index ?? Number.POSITIVE_INFINITY,
    downMatch?.index ?? Number.POSITIVE_INFINITY,
  )
  const head = raw.slice(0, firstIdx).trim()
  const clean = (s: string) => s.replace(/\s*[;.]\s*$/, '').trim()

  return {
    head: head || raw,
    up: upMatch ? clean(`>${upMatch[1]}`) : null,
    down: downMatch ? clean(`<${downMatch[1]}`) : null,
  }
}

/**
 * Master switch banner: bg-panel, 2px amber left border, amber tag, the
 * switch condition in mono, and the two outcome branches split into
 * green/red mini-rows.
 */
export function MasterSwitch({ text }: { text: string }) {
  const { head, up, down } = parseMasterSwitch(text)

  return (
    <motion.section
      aria-label="Master switch"
      className="relative rounded border border-hair border-l-2 border-l-warn bg-panel p-4 md:p-5"
      initial={{ opacity: 0, y: -16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, ease: EASE }}
    >
      {/* one-time amber border pulse */}
      <motion.span
        aria-hidden
        className="pointer-events-none absolute inset-0 rounded border-2 border-warn"
        initial={{ opacity: 0 }}
        animate={{ opacity: [0, 0.6, 0] }}
        transition={{ duration: 0.9, delay: 0.5, times: [0, 0.35, 1] }}
      />

      <p className="font-mono text-[10px] uppercase tracking-[0.12em] text-warn">
        MASTER SWITCH
      </p>
      <p className="mt-2 font-mono text-[14px] leading-relaxed text-ink">{head}</p>

      {(up || down) && (
        <div className="mt-3 flex flex-col gap-2 border-t border-hair pt-3 md:flex-row md:gap-8">
          {up && (
            <motion.p
              className="flex items-start gap-2 font-mono text-[11px] uppercase leading-relaxed tracking-[0.06em] text-up"
              initial={{ opacity: 0, x: 12 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.3, delay: 0.35, ease: EASE }}
            >
              <span aria-hidden className="mt-px shrink-0">
                ▲
              </span>
              {up}
            </motion.p>
          )}
          {down && (
            <motion.p
              className="flex items-start gap-2 font-mono text-[11px] uppercase leading-relaxed tracking-[0.06em] text-down"
              initial={{ opacity: 0, x: -12 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.3, delay: 0.45, ease: EASE }}
            >
              <span aria-hidden className="mt-px shrink-0">
                ▼
              </span>
              {down}
            </motion.p>
          )}
        </div>
      )}
    </motion.section>
  )
}
