import { Link } from 'react-router-dom'
import { useSwarmRun } from '@/lib/swarm-api'

const FALLBACK_DISCLAIMER =
  'Research/educational analysis only — NOT financial advice. 0DTE/short-dated options can go to zero. Verify all data at the open.'

const LINKS = [
  { to: '/', label: 'Dashboard' },
  { to: '/playbook', label: 'Playbook' },
  { to: '/history', label: 'History' },
  { to: '/methodology', label: 'Methodology' },
]

export default function Footer() {
  const { run, lastSyncAt } = useSwarmRun()
  const disclaimer = run.disclaimer || FALLBACK_DISCLAIMER
  const sync = lastSyncAt
    ? `${String(lastSyncAt.getUTCHours()).padStart(2, '0')}:${String(
        lastSyncAt.getUTCMinutes(),
      ).padStart(2, '0')} UTC`
    : '--:-- UTC'

  return (
    <footer className="border-t border-hair bg-abyss">
      <div className="mx-auto grid max-w-[1440px] gap-8 px-4 py-10 md:grid-cols-3 md:px-6">
        {/* Col 1 — brand */}
        <div>
          <div className="flex items-center gap-2.5">
            <img src="/logo.svg" alt="" className="h-5 w-5" />
            <span className="font-display text-[13px] font-bold tracking-[0.2em] text-ink">
              SWARM
            </span>
          </div>
          <p className="mt-3 font-mono text-[11px] uppercase tracking-[0.12em] text-inkdim">
            SWARM — Pre-Market Intelligence
          </p>
          <p className="mt-2 text-[12px] leading-relaxed text-inkfaint">
            A 14-stage AI research pipeline rendered as a terminal.
          </p>
        </div>

        {/* Col 2 — links */}
        <div>
          <p className="font-mono text-[10px] uppercase tracking-[0.12em] text-inkfaint">
            NAVIGATE
          </p>
          <ul className="mt-3 space-y-2">
            {LINKS.map((l) => (
              <li key={l.to}>
                <Link
                  to={l.to}
                  className="text-[13px] text-inkdim transition-colors hover:text-phosphor"
                >
                  {l.label}
                </Link>
              </li>
            ))}
          </ul>
          <p className="mt-4 font-mono text-[10px] uppercase tracking-[0.1em] text-inkfaint">
            Data: Yahoo Finance · SEC EDGAR · News wires
          </p>
        </div>

        {/* Col 3 — disclaimer */}
        <div className="border-l-2 border-warn pl-4">
          <p className="mb-2 font-mono text-[10px] uppercase tracking-[0.12em] text-warn">
            DISCLAIMER
          </p>
          <p className="text-[10.5px] leading-relaxed text-inkdim">{disclaimer}</p>
        </div>
      </div>
      <div className="border-t border-hair">
        <div className="mx-auto flex max-w-[1440px] flex-wrap items-center justify-between gap-2 px-4 py-4 md:px-6">
          <p className="font-mono text-[10px] uppercase tracking-[0.1em] text-inkfaint">
            © 2026 SWARM · For research/education only — not financial advice
          </p>
          <p className="font-mono text-[10px] uppercase tracking-[0.1em] text-inkfaint">
            Last sync {sync}
          </p>
        </div>
      </div>
    </footer>
  )
}
