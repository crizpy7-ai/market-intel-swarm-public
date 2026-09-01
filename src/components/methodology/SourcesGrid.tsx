import { useRef } from 'react'
import { motion, useInView } from 'framer-motion'
import { FileText, Newspaper, TrendingUp } from 'lucide-react'
import type { LucideIcon } from 'lucide-react'
import { SectionHeader } from '@/components/ui/section-header'
import { cn } from '@/lib/utils'

const EASE = [0.16, 1, 0.3, 1] as [number, number, number, number]

interface Source {
  icon: LucideIcon
  name: string
  desc: string
  tag: string
}

const SOURCES: Source[] = [
  {
    icon: TrendingUp,
    name: 'Yahoo Finance',
    desc: 'Quotes, futures, options chains, IV and expected moves across indices and single names.',
    tag: 'MARKET DATA',
  },
  {
    icon: FileText,
    name: 'SEC EDGAR',
    desc: '8-Ks, 10-Qs, and material filings pulled directly from the primary source.',
    tag: 'FILINGS',
  },
  {
    icon: Newspaper,
    name: 'News Wires',
    desc: 'Public financial news aggregated and tone-tagged for overnight developments.',
    tag: 'HEADLINES',
  },
]

/**
 * Section 3 — data sources grid. Cards stagger up 24px (0.08s); icons
 * draw in via stroke-dashoffset (600ms, see methodology.css); hairline
 * top borders sweep left→right.
 */
export function SourcesGrid() {
  const gridRef = useRef<HTMLDivElement>(null)
  // once:true → stays true after first entry; drives the icon draw class.
  const drawn = useInView(gridRef, { once: true, amount: 0.2 })

  return (
    <section className="mx-auto w-full max-w-[1440px] px-4 py-16 md:px-6">
      <SectionHeader num="SRC" title="Where the Data Comes From" meta="3 FEEDS" />
      <div ref={gridRef} className="mt-6 grid gap-3 md:grid-cols-3">
        {SOURCES.map((s, i) => (
          <motion.div
            key={s.name}
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.2 }}
            transition={{ duration: 0.5, delay: i * 0.08, ease: EASE }}
            className="relative overflow-hidden rounded border border-hair bg-panel p-4 md:p-5"
          >
            {/* hairline top border sweep */}
            <motion.span
              aria-hidden
              className="absolute left-0 top-0 h-px w-full origin-left bg-bright"
              initial={{ scaleX: 0 }}
              whileInView={{ scaleX: 1 }}
              viewport={{ once: true, amount: 0.2 }}
              transition={{ duration: 0.6, delay: i * 0.08 + 0.1, ease: EASE }}
            />
            <span
              className={cn('src-icon inline-flex text-phosphor', drawn && 'src-icon-on')}
              style={{ transitionDelay: `${i * 80}ms` }}
            >
              <s.icon className="h-5 w-5" strokeWidth={1.75} aria-hidden />
            </span>
            <h3 className="mt-4 font-display text-[15px] font-medium text-ink">
              {s.name}
            </h3>
            <p className="mt-2 text-[13px] leading-relaxed text-inkdim">{s.desc}</p>
            <p className="mt-4 border-t border-hair pt-3 font-mono text-[10px] uppercase tracking-[0.12em] text-inkfaint">
              {s.tag}
            </p>
          </motion.div>
        ))}
      </div>
    </section>
  )
}
