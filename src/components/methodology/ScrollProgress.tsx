import { useRef } from 'react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { useGSAP } from '@gsap/react'

gsap.registerPlugin(ScrollTrigger, useGSAP)

/**
 * Methodology-only scroll progress bar: 2px teal line fixed under the
 * navbar (56px), filling with page scroll — the "pipeline progress" metaphor.
 * GSAP ScrollTrigger, scrubbed; disabled by the global reduced-motion path
 * (it simply tracks scroll, no loop).
 */
export function ScrollProgress() {
  const barRef = useRef<HTMLDivElement>(null)

  useGSAP(() => {
    const st = ScrollTrigger.create({
      start: 0,
      end: () => document.documentElement.scrollHeight - window.innerHeight,
      scrub: 0.3,
      onUpdate(self) {
        if (barRef.current) {
          gsap.set(barRef.current, { scaleX: self.progress })
        }
      },
    })
    return () => st.kill()
  })

  return (
    <div
      aria-hidden
      className="pointer-events-none fixed left-0 right-0 top-14 z-40 h-[2px]"
    >
      <div
        ref={barRef}
        className="h-full w-full origin-left bg-phosphor"
        style={{ transform: 'scaleX(0)' }}
      />
    </div>
  )
}
