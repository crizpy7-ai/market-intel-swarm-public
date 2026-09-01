import { useEffect, useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'

const BOOT_KEY = 'swarm-booted'

/**
 * 900ms "swarm boot" overlay — mono log lines stream in, then the overlay
 * wipes upward. Shown once per session, skippable on click, auto-skipped
 * for reduced-motion users.
 */
export function BootOverlay({ runDate }: { runDate: string }) {
  const [show, setShow] = useState(() => {
    if (typeof window === 'undefined') return false
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return false
    return !sessionStorage.getItem(BOOT_KEY)
  })
  const [lines, setLines] = useState(0)

  const dismiss = () => {
    sessionStorage.setItem(BOOT_KEY, '1')
    setShow(false)
  }

  useEffect(() => {
    if (!show) return
    const t1 = setTimeout(() => setLines(1), 150)
    const t2 = setTimeout(() => setLines(2), 450)
    const t3 = setTimeout(() => setLines(3), 700)
    const t4 = setTimeout(dismiss, 1400)
    return () => {
      clearTimeout(t1)
      clearTimeout(t2)
      clearTimeout(t3)
      clearTimeout(t4)
    }
  }, [show])

  const log = [
    '> connecting to swarm…',
    '> 14 stages complete',
    `> rendering run ${runDate}`,
  ]

  return (
    <AnimatePresence>
      {show && (
        <motion.div
          className="fixed inset-0 z-[80] flex cursor-pointer items-center justify-center bg-abyss"
          onClick={dismiss}
          exit={{ y: '-100%' }}
          transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
        >
          <div className="w-[320px] font-mono text-[13px] leading-7 text-phosphor">
            {log.slice(0, lines).map((l) => (
              <motion.p key={l} initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
                {l}
              </motion.p>
            ))}
            <span className="inline-block h-4 w-2 animate-blink bg-phosphor align-middle" />
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
