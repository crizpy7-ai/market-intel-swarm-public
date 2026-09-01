import { motion, useReducedMotion } from 'framer-motion'
import { HeroStatement } from '@/components/methodology/HeroStatement'
import {
  PipelineScroller,
  PipelineSummaryStrip,
} from '@/components/methodology/PipelineScroller'
import { PipelineList } from '@/components/methodology/PipelineList'
import { SourcesGrid } from '@/components/methodology/SourcesGrid'
import { ConfidenceExplainer } from '@/components/methodology/ConfidenceExplainer'
import { Limitations } from '@/components/methodology/Limitations'
import { ScrollProgress } from '@/components/methodology/ScrollProgress'
import '@/components/methodology/methodology.css'

/**
 * Methodology (`/methodology`) — how the swarm works. The one editorial
 * page: hero statement → GSAP-pinned 14-stage pipeline scroller → data
 * sources grid → confidence-score explainer → limitations + disclaimer.
 *
 * The GSAP scroll machinery (pinned scroller, progress bar) is isolated in
 * its own components; Framer Motion handles everything else. Reduced motion:
 * no pin — the pipeline renders as a simple numbered list.
 */
export default function Methodology() {
  const reduced = useReducedMotion() ?? false

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.2 }}
    >
      <ScrollProgress />
      <HeroStatement />

      {/* Section 2 — the pipeline */}
      {reduced ? (
        <div className="py-8">
          <PipelineList />
        </div>
      ) : (
        <>
          <div className="hidden lg:block">
            <PipelineScroller />
          </div>
          <div className="py-8 lg:hidden">
            <PipelineList />
          </div>
        </>
      )}
      <PipelineSummaryStrip />

      <SourcesGrid />
      <ConfidenceExplainer />
      <Limitations />
    </motion.div>
  )
}
