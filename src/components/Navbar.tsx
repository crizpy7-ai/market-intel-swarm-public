import { useEffect, useState } from 'react'
import { Link, NavLink } from 'react-router-dom'
import { AnimatePresence, motion } from 'framer-motion'
import { Menu, RefreshCw, X } from 'lucide-react'
import { POLL_INTERVAL_S, useSwarmRun } from '@/lib/swarm-api'
import { cn } from '@/lib/utils'

const NAV_LINKS = [
  { to: '/', label: 'DASHBOARD' },
  { to: '/playbook', label: 'PLAYBOOK' },
  { to: '/history', label: 'HISTORY' },
  { to: '/track-record', label: 'TRACK RECORD' },
  { to: '/methodology', label: 'METHODOLOGY' },
]

function useEtClock(): string {
  const [now, setNow] = useState('--:--:--')
  useEffect(() => {
    const fmt = new Intl.DateTimeFormat('en-US', {
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit',
      hour12: false,
      timeZone: 'America/New_York',
    })
    const tick = () => setNow(fmt.format(new Date()))
    tick()
    const id = setInterval(tick, 1000)
    return () => clearInterval(id)
  }, [])
  return now
}

/** 20px SVG countdown ring — teal stroke depletes over the poll interval. */
function CountdownRing({ secondsLeft }: { secondsLeft: number }) {
  const r = 8
  const c = 2 * Math.PI * r
  const frac = Math.max(0, Math.min(1, secondsLeft / POLL_INTERVAL_S))
  return (
    <svg width="20" height="20" viewBox="0 0 20 20" className="-rotate-90" aria-hidden>
      <circle cx="10" cy="10" r={r} fill="none" stroke="#1B2534" strokeWidth="2" />
      <circle
        cx="10"
        cy="10"
        r={r}
        fill="none"
        stroke="#5EEAD4"
        strokeWidth="2"
        strokeLinecap="round"
        strokeDasharray={c}
        strokeDashoffset={c * (1 - frac)}
        className="transition-[stroke-dashoffset] duration-1000 ease-linear"
      />
    </svg>
  )
}

function StatusPill() {
  const { run, isFallback } = useSwarmRun()
  const status = (run.market_status || 'open').toLowerCase()
  const session = (run.session_label || 'pre-market').toUpperCase()

  if (status === 'holiday' || status === 'closed') {
    return (
      <span className="flex items-center gap-1.5 rounded-[2px] border border-warn/50 bg-warn/10 px-2 py-1 font-mono text-[10px] uppercase tracking-[0.1em] text-warn">
        <span className="h-1.5 w-1.5 rounded-full bg-warn" />
        {session} · {status === 'holiday' ? 'HOLIDAY' : 'CLOSED'}
      </span>
    )
  }
  return (
    <span className="flex items-center gap-1.5 rounded-[2px] border border-up/40 bg-up/10 px-2 py-1 font-mono text-[10px] uppercase tracking-[0.1em] text-up">
      <span className="h-1.5 w-1.5 animate-pulse-dot rounded-full bg-up" />
      {session} · OPEN
      {isFallback && <span className="ml-1 text-warn">· OFFLINE</span>}
    </span>
  )
}

export default function Navbar() {
  const clock = useEtClock()
  const { secondsToNextPoll, refresh, refreshing, viewDate } = useSwarmRun()
  const [drawerOpen, setDrawerOpen] = useState(false)

  const mm = String(Math.floor(secondsToNextPoll / 60)).padStart(2, '0')
  const ss = String(secondsToNextPoll % 60).padStart(2, '0')

  return (
    <header className="sticky top-0 z-50 h-14 border-b border-hair bg-abyss/92 backdrop-blur-md">
      <div className="mx-auto flex h-full max-w-[1440px] items-center gap-4 px-4 md:px-6">
        {/* Left: logo + wordmark */}
        <Link to="/" className="flex shrink-0 items-center gap-2.5">
          <img src="/logo.svg" alt="SWARM logo" className="h-6 w-6" />
          <span className="font-display text-[15px] font-bold tracking-[0.2em] text-ink">
            SWARM
          </span>
          <span className="hidden font-mono text-[10px] uppercase tracking-[0.12em] text-inkfaint sm:inline">
            PRE-MARKET INTELLIGENCE
          </span>
        </Link>

        {/* Center: nav links (desktop) */}
        <nav className="hidden flex-1 items-center justify-center gap-6 md:flex">
          {NAV_LINKS.map((link) => (
            <NavLink
              key={link.to}
              to={link.to}
              end={link.to === '/'}
              className={({ isActive }) =>
                cn(
                  'relative py-1 font-mono text-[11px] uppercase tracking-[0.14em] transition-colors',
                  'after:absolute after:inset-x-0 after:-bottom-[2px] after:h-[2px] after:transition-colors',
                  isActive
                    ? 'text-phosphor after:bg-phosphor'
                    : 'text-inkdim after:bg-transparent hover:text-phosphor',
                )
              }
            >
              {link.label}
            </NavLink>
          ))}
        </nav>

        {/* Right cluster */}
        <div className="ml-auto flex items-center gap-3 md:ml-0">
          <StatusPill />
          <span className="hidden font-mono text-[13px] tabular-nums text-inkdim sm:inline">
            {clock} <span className="text-inkfaint">ET</span>
          </span>
          <div className="hidden items-center gap-2 lg:flex">
            <CountdownRing secondsLeft={viewDate ? 0 : secondsToNextPoll} />
            <span className="font-mono text-[10px] uppercase tracking-[0.1em] text-inkfaint">
              {viewDate ? 'ARCHIVE' : `NEXT POLL ${mm}:${ss}`}
            </span>
          </div>
          <button
            onClick={refresh}
            aria-label="Refresh now"
            className="flex h-7 w-7 cursor-pointer items-center justify-center rounded-[2px] border border-hair text-inkdim transition-colors hover:border-bright hover:bg-panel2 hover:text-phosphor"
          >
            <RefreshCw className={cn('h-3.5 w-3.5', refreshing && 'animate-spin')} />
          </button>
          <button
            onClick={() => setDrawerOpen(true)}
            aria-label="Open menu"
            className="flex h-7 w-7 cursor-pointer items-center justify-center rounded-[2px] border border-hair text-inkdim transition-colors hover:border-bright hover:bg-panel2 md:hidden"
          >
            <Menu className="h-4 w-4" />
          </button>
        </div>
      </div>

      {/* Mobile drawer */}
      <AnimatePresence>
        {drawerOpen && (
          <motion.div
            className="fixed inset-0 z-[60] flex flex-col bg-abyss/98 backdrop-blur-lg md:hidden"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
          >
            <div className="flex h-14 items-center justify-between border-b border-hair px-4">
              <div className="flex items-center gap-2.5">
                <img src="/logo.svg" alt="" className="h-6 w-6" />
                <span className="font-display text-[15px] font-bold tracking-[0.2em] text-ink">
                  SWARM
                </span>
              </div>
              <button
                onClick={() => setDrawerOpen(false)}
                aria-label="Close menu"
                className="flex h-8 w-8 cursor-pointer items-center justify-center rounded-[2px] border border-hair text-inkdim"
              >
                <X className="h-4 w-4" />
              </button>
            </div>
            <nav className="flex flex-1 flex-col justify-center gap-2 px-8">
              {NAV_LINKS.map((link, i) => (
                <motion.div
                  key={link.to}
                  initial={{ opacity: 0, x: -24 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.05 * i, duration: 0.3 }}
                >
                  <NavLink
                    to={link.to}
                    end={link.to === '/'}
                    onClick={() => setDrawerOpen(false)}
                    className={({ isActive }) =>
                      cn(
                        'block border-b border-hair py-4 font-mono text-lg uppercase tracking-[0.18em]',
                        isActive ? 'text-phosphor' : 'text-inkdim',
                      )
                    }
                  >
                    {link.label}
                  </NavLink>
                </motion.div>
              ))}
            </nav>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  )
}
