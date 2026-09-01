import { useState } from 'react'
import { motion } from 'framer-motion'
import type { Headline } from '@/lib/swarm-api'
import { ToneChip } from '@/components/ui/chips'
import { Panel } from '@/components/ui/panel'
import { SectionHeader } from '@/components/ui/section-header'
import { cn } from '@/lib/utils'

const EASE = [0.16, 1, 0.3, 1] as [number, number, number, number]

/** 03 / BREAKING NEWS — headline list; risk rows pinned with red left border. */
export function Headlines({ items }: { items: Headline[] }) {
  const [selected, setSelected] = useState<number | null>(null)

  return (
    <section id="stage-headlines" className="lg:col-span-7">
      <SectionHeader num="03" title="Breaking News" meta={`${items.length} WIRES`} />
      <Panel className="mt-3 divide-y divide-hair p-0 md:p-0">
        {items.map((h, i) => (
          <motion.button
            key={i}
            type="button"
            onClick={() => setSelected(selected === i ? null : i)}
            className={cn(
              'flex w-full cursor-pointer items-start gap-3 px-4 py-3.5 text-left transition-colors md:px-5',
              'hover:bg-panel2',
              selected === i && 'bg-panel2',
              h.tone === 'risk' && 'border-l-2 border-l-down',
            )}
            initial={{ opacity: 0, y: 12 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.4 }}
            transition={{ delay: i * 0.07, duration: 0.4, ease: EASE }}
          >
            <motion.span
              initial={{ scale: 0.8, opacity: 0 }}
              whileInView={{ scale: 1, opacity: 1 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.07 + 0.15, type: 'spring', stiffness: 400, damping: 20 }}
            >
              <ToneChip tone={h.tone} label={h.tag} />
            </motion.span>
            <p className="text-[14px] leading-[1.5] text-ink">{h.text}</p>
          </motion.button>
        ))}
      </Panel>
    </section>
  )
}
