import { motion } from 'framer-motion'

const EASE = [0.16, 1, 0.3, 1] as [number, number, number, number]

const CELLS = [
  {
    label: 'SOURCE',
    text: 'Runs are written by the swarm each U.S. trading day before the open and stored in Supabase. The archive reads the same table the dashboard polls.',
  },
  {
    label: 'FIDELITY',
    text: 'Archived briefs render the exact payload captured at generation time — no hindsight edits. Stale data is labeled with its generation timestamp.',
  },
  {
    label: 'OFFLINE MODE',
    text: "If the archive can't be reached, the app falls back to the bundled snapshot (Sep 1, 2026) and says so on every view.",
  },
] as const

/**
 * "How archiving works" — quiet 3-col band under the archive list.
 * Cells fade up 12px, stagger 0.08s; top hairline draws with the section.
 */
export function ArchiveNote() {
  return (
    <section className="mt-10">
      <motion.div
        aria-hidden
        className="h-px origin-left bg-hair"
        initial={{ scaleX: 0 }}
        whileInView={{ scaleX: 1 }}
        viewport={{ once: true, amount: 0.5 }}
        transition={{ duration: 0.4, ease: EASE }}
      />
      <div className="grid gap-6 pt-6 md:grid-cols-3 md:gap-8">
        {CELLS.map((cell, i) => (
          <motion.div
            key={cell.label}
            initial={{ opacity: 0, y: 12 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.3 }}
            transition={{ duration: 0.45, delay: i * 0.08, ease: EASE }}
          >
            <p className="font-mono text-[10px] uppercase tracking-[0.12em] text-inkfaint">
              {cell.label}
            </p>
            <p className="mt-2 text-[12.5px] leading-relaxed text-inkdim">
              {cell.text}
            </p>
          </motion.div>
        ))}
      </div>
    </section>
  )
}
