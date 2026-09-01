import { useEffect, useRef, useState } from 'react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { useGSAP } from '@gsap/react'
import { STAGES } from '@/components/methodology/stages'
import { cn } from '@/lib/utils'

gsap.registerPlugin(ScrollTrigger, useGSAP)

const N = STAGES.length
/** Stage 11 (index 10) gets the amber VERIFYING… beat. */
const VERIFY_INDEX = 10

/**
 * Section 2 — the pinned pipeline scroller (desktop ≥1024px, motion-safe).
 *
 * The section pins for ~250vh; scroll progress drives the spine fill
 * (scrubbed, via gsap.set on a ref) and the active stage index (React state,
 * ≤14 transitions). The giant counter flips out (y −20) / in (y +20, 250ms)
 * on each stage change. GSAP-only component tree — no Framer Motion here.
 */
export function PipelineScroller() {
  const rootRef = useRef<HTMLDivElement>(null)
  const fillRef = useRef<HTMLDivElement>(null)
  const flipRef = useRef<HTMLDivElement>(null)
  const [active, setActive] = useState(0)
  const [displayed, setDisplayed] = useState(0)

  useGSAP(
    () => {
      const st = ScrollTrigger.create({
        trigger: rootRef.current,
        start: 'top top',
        end: '+=250%',
        pin: true,
        scrub: 0.5,
        anticipatePin: 1,
        onUpdate(self) {
          const idx = Math.min(N - 1, Math.floor(self.progress * N))
          setActive((prev) => (prev === idx ? prev : idx))
          if (fillRef.current) {
            gsap.set(fillRef.current, { scaleY: self.progress })
          }
        },
      })
      return () => st.kill()
    },
    { scope: rootRef },
  )

  /* Counter/name/description flip: old y −20 fade out, new y +20 fade in. */
  useEffect(() => {
    const el = flipRef.current
    if (!el || active === displayed) return
    gsap.killTweensOf(el)
    gsap.to(el, {
      y: -20,
      autoAlpha: 0,
      duration: 0.12,
      ease: 'power1.in',
      overwrite: true,
      onComplete: () => {
        setDisplayed(active)
        requestAnimationFrame(() => {
          gsap.fromTo(
            el,
            { y: 20, autoAlpha: 0 },
            { y: 0, autoAlpha: 1, duration: 0.25, ease: 'power2.out' },
          )
        })
      },
    })
  }, [active, displayed])

  const stage = STAGES[displayed]

  return (
    <div ref={rootRef} className="relative h-[100dvh] overflow-hidden">
      <div className="mx-auto grid h-full w-full max-w-[1440px] grid-cols-[45%_55%] items-center gap-10 px-6">
        {/* Left — counter + stage copy */}
        <div className="relative">
          <div
            aria-hidden
            className="pointer-events-none absolute -top-24 left-0 select-none font-mono text-[180px] font-bold leading-none text-ink/[0.08]"
          >
            {stage.num}
          </div>
          <p className="font-mono text-[10px] uppercase tracking-[0.14em] text-inkfaint">
            THE PIPELINE — STAGE {stage.num} OF 14
          </p>
          <div ref={flipRef} className="relative mt-6">
            <div className="font-mono text-[96px] font-bold leading-none tabular-nums text-ink">
              {stage.num}
            </div>
            <h3 className="mt-4 font-display text-[28px] font-bold tracking-[-0.02em] text-ink">
              {stage.name}
            </h3>
            <p className="mt-3 max-w-[420px] text-[14px] leading-[1.55] text-inkdim">
              {stage.desc}
            </p>
            {displayed === VERIFY_INDEX && (
              <p className="verifying-blink mt-4 font-mono text-[10px] uppercase tracking-[0.14em] text-warn">
                VERIFYING…
              </p>
            )}
          </div>
        </div>

        {/* Right — 14-node spine */}
        <div className="relative flex h-[72dvh] flex-col justify-between py-1">
          {/* spine track + scroll-scrubbed fill */}
          <div
            aria-hidden
            className="absolute bottom-[6px] left-[6px] top-[6px] w-px bg-hair"
          />
          <div
            ref={fillRef}
            aria-hidden
            className="absolute bottom-[6px] left-[6px] top-[6px] w-px origin-top bg-phosphor"
            style={{ transform: 'scaleY(0)' }}
          />
          {STAGES.map((s, i) => {
            const isActive = i === active
            const isPassed = i < active
            const isVerify = i === VERIFY_INDEX && isActive
            return (
              <div key={s.num} className="relative z-10 flex items-center gap-4">
                <span
                  aria-hidden
                  className={cn(
                    'h-3 w-3 shrink-0 rounded-[1px] border transition-colors duration-300',
                    isVerify
                      ? 'border-warn bg-warn'
                      : isActive
                        ? 'border-phosphor bg-phosphor'
                        : isPassed
                          ? 'border-phosphor/50 bg-phosphor/30'
                          : 'border-bright bg-abyss',
                  )}
                />
                <span
                  className={cn(
                    'font-mono text-[10px] uppercase tracking-[0.12em] transition-colors duration-300',
                    isActive ? 'text-ink' : 'text-inkfaint',
                  )}
                >
                  {s.num} · {s.name}
                </span>
                {isVerify && (
                  <span className="verifying-blink font-mono text-[10px] uppercase tracking-[0.12em] text-warn">
                    VERIFYING…
                  </span>
                )}
              </div>
            )
          })}
        </div>
      </div>
    </div>
  )
}

/**
 * Compact 14-dot summary strip — rendered at the end of the pipeline
 * section, after the scroller unpins.
 */
export function PipelineSummaryStrip() {
  return (
    <div className="mx-auto w-full max-w-[1440px] px-4 pb-4 md:px-6">
      <div className="flex flex-wrap items-center gap-x-4 gap-y-3 rounded border border-hair bg-panel px-4 py-3 md:px-5">
        <span className="font-mono text-[10px] uppercase tracking-[0.12em] text-inkfaint">
          PIPELINE COMPLETE — 14 STAGES
        </span>
        <div className="flex flex-wrap items-center gap-1.5">
          {STAGES.map((s, i) => (
            <span
              key={s.num}
              title={`${s.num} · ${s.name}`}
              className={cn(
                'flex h-6 w-6 items-center justify-center rounded-[2px] border font-mono text-[9px] tabular-nums',
                i === N - 1
                  ? 'border-phosphor bg-phosphor/15 text-phosphor'
                  : 'border-hair bg-panel2 text-inkfaint',
              )}
            >
              {s.num}
            </span>
          ))}
        </div>
      </div>
    </div>
  )
}
