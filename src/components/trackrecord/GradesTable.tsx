import { useMemo, useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { ChevronDown } from 'lucide-react'
import { Panel } from '@/components/ui/panel'
import { BiasChip } from '@/components/ui/chips'
import { ConfidenceMeter } from '@/components/ui/confidence-meter'
import { fmtPrice } from '@/lib/swarm-api'
import type { Grade } from '@/lib/swarm-api'
import { cn } from '@/lib/utils'

/* ------------------------------------------------------------------ */
/* Chips                                                               */
/* ------------------------------------------------------------------ */

const CHIP_BASE = cn(
  'inline-flex items-center rounded-[2px] border px-1.5 py-0.5',
  'font-mono text-[10px] uppercase leading-none tracking-[0.1em]',
)

function TypeChip({ type }: { type: string }) {
  const t = type.toLowerCase()
  const style =
    t === 'call'
      ? 'border-up/50 bg-up/10 text-up'
      : t === 'put'
        ? 'border-down/50 bg-down/10 text-down'
        : 'border-phosphor/50 bg-phosphor/10 text-phosphor'
  return <span className={cn(CHIP_BASE, style)}>{t.toUpperCase()}</span>
}

function ResultChip({ result }: { result: string }) {
  const r = result.toUpperCase()
  const style =
    r === 'WIN'
      ? 'border-up/50 bg-up/10 text-up'
      : r === 'LOSS'
        ? 'border-down/50 bg-down/10 text-down'
        : r === 'FLAT'
          ? 'border-warn/50 bg-warn/10 text-warn'
          : 'border-bright bg-panel2 text-inkdim'
  return <span className={cn(CHIP_BASE, style)}>{r}</span>
}

/* ------------------------------------------------------------------ */
/* Filters                                                             */
/* ------------------------------------------------------------------ */

type ResultFilter = 'ALL' | 'WINS' | 'LOSSES' | 'FLAT'
type TypeFilter = 'ALL' | 'CALL' | 'PUT' | 'STOCK'

const RESULT_FILTERS: ResultFilter[] = ['ALL', 'WINS', 'LOSSES', 'FLAT']
const TYPE_FILTERS: TypeFilter[] = ['ALL', 'CALL', 'PUT', 'STOCK']

function FilterButton({
  label,
  active,
  onClick,
}: {
  label: string
  active: boolean
  onClick: () => void
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-pressed={active}
      className={cn(
        'cursor-pointer rounded-[2px] border px-3 py-1.5 font-mono text-[10px] uppercase tracking-[0.1em]',
        'transition-colors duration-150',
        active
          ? 'border-bright bg-panel2 text-phosphor'
          : 'border-hair text-inkdim hover:border-bright hover:bg-panel2 hover:text-ink',
      )}
    >
      {label}
    </button>
  )
}

/* ------------------------------------------------------------------ */
/* Table                                                               */
/* ------------------------------------------------------------------ */

const HEADERS = [
  'DATE',
  'TICKER',
  'CONTRACT',
  'TYPE',
  'DIR',
  'ENTRY',
  'TARGET',
  'STOP',
  'CONF',
  'RESULT',
]

function gradeKey(g: Grade): string {
  return `${g.run_date}|${g.underlying}|${g.contract}`
}

function OhlcCell({ label, value }: { label: string; value: number }) {
  return (
    <div className="flex flex-col gap-1">
      <span className="font-mono text-[10px] uppercase tracking-[0.1em] text-inkfaint">
        {label}
      </span>
      <span className="font-mono text-[13px] font-medium tabular-nums text-ink">
        {fmtPrice(value)}
      </span>
    </div>
  )
}

/**
 * Graded picks table — date-desc, filterable by result and pick type.
 * Clicking a row expands the grading note plus the session's O/H/L/C.
 */
export function GradesTable({ grades }: { grades: Grade[] }) {
  const [resultFilter, setResultFilter] = useState<ResultFilter>('ALL')
  const [typeFilter, setTypeFilter] = useState<TypeFilter>('ALL')
  const [openKey, setOpenKey] = useState<string | null>(null)

  const rows = useMemo(() => {
    return grades
      .filter((g) => {
        if (resultFilter === 'WINS') return g.result.toUpperCase() === 'WIN'
        if (resultFilter === 'LOSSES') return g.result.toUpperCase() === 'LOSS'
        if (resultFilter === 'FLAT') return g.result.toUpperCase() === 'FLAT'
        return true
      })
      .filter((g) => typeFilter === 'ALL' || g.pick_type.toUpperCase() === typeFilter)
      .slice()
      .sort(
        (a, b) =>
          b.run_date.localeCompare(a.run_date) || a.underlying.localeCompare(b.underlying),
      )
  }, [grades, resultFilter, typeFilter])

  return (
    <Panel className="overflow-hidden p-0 md:p-0">
      {/* Filter toggle row */}
      <div className="flex flex-wrap items-center gap-x-6 gap-y-3 border-b border-hair px-4 py-3 md:px-5">
        <div className="flex flex-wrap items-center gap-2">
          <span className="font-mono text-[10px] uppercase tracking-[0.1em] text-inkfaint">
            RESULT
          </span>
          {RESULT_FILTERS.map((f) => (
            <FilterButton
              key={f}
              label={f}
              active={resultFilter === f}
              onClick={() => setResultFilter(f)}
            />
          ))}
        </div>
        <div className="flex flex-wrap items-center gap-2">
          <span className="font-mono text-[10px] uppercase tracking-[0.1em] text-inkfaint">
            TYPE
          </span>
          {TYPE_FILTERS.map((f) => (
            <FilterButton
              key={f}
              label={f === 'ALL' ? 'ALL TYPES' : `${f}S`}
              active={typeFilter === f}
              onClick={() => setTypeFilter(f)}
            />
          ))}
        </div>
        <span className="ml-auto font-mono text-[10px] uppercase tracking-[0.1em] text-inkfaint">
          {rows.length} OF {grades.length} PICKS
        </span>
      </div>

      {/* Table (horizontally scrollable on small screens) */}
      <div className="overflow-x-auto">
        <table className="w-full min-w-[1020px] border-collapse text-left">
          <thead>
            <tr className="border-b border-hair bg-panel2">
              {HEADERS.map((h) => (
                <th
                  key={h}
                  scope="col"
                  className="whitespace-nowrap px-4 py-2.5 font-mono text-[10px] font-medium uppercase tracking-[0.1em] text-inkfaint first:pl-4 last:pr-4 md:first:pl-5 md:last:pr-5"
                >
                  {h}
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-hair">
            {rows.length === 0 && (
              <tr>
                <td
                  colSpan={HEADERS.length}
                  className="px-4 py-12 text-center font-mono text-[12px] text-inkfaint md:px-5"
                >
                  &gt; no picks match the current filter
                </td>
              </tr>
            )}
            {rows.map((g) => {
              const key = gradeKey(g)
              const open = openKey === key
              return [
                <tr
                  key={key}
                  onClick={() => setOpenKey(open ? null : key)}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') {
                      e.preventDefault()
                      setOpenKey(open ? null : key)
                    }
                  }}
                  tabIndex={0}
                  aria-expanded={open}
                  className={cn(
                    'cursor-pointer transition-colors duration-150 hover:bg-panel2 focus:bg-panel2 focus:outline-none',
                    open && 'bg-panel2',
                  )}
                >
                  <td className="whitespace-nowrap px-4 py-3 font-mono text-[12px] tabular-nums text-inkdim md:pl-5">
                    <span className="mr-1.5 inline-flex align-middle">
                      <ChevronDown
                        className={cn(
                          'h-3.5 w-3.5 text-inkfaint transition-transform duration-150',
                          open && 'rotate-180 text-phosphor',
                        )}
                        aria-hidden
                      />
                    </span>
                    {g.run_date}
                  </td>
                  <td className="whitespace-nowrap px-4 py-3 font-mono text-[13px] font-semibold tabular-nums text-ink">
                    {g.underlying}
                  </td>
                  <td className="whitespace-nowrap px-4 py-3 font-mono text-[12px] text-inkdim">
                    {g.contract}
                  </td>
                  <td className="whitespace-nowrap px-4 py-3">
                    <TypeChip type={g.pick_type} />
                  </td>
                  <td className="whitespace-nowrap px-4 py-3">
                    <BiasChip bias={g.direction} />
                  </td>
                  <td className="whitespace-nowrap px-4 py-3 font-mono text-[12px] tabular-nums text-inkdim">
                    {g.entry}
                  </td>
                  <td className="whitespace-nowrap px-4 py-3 font-mono text-[12px] tabular-nums text-inkdim">
                    {g.target}
                  </td>
                  <td className="whitespace-nowrap px-4 py-3 font-mono text-[12px] tabular-nums text-inkdim">
                    {g.stop}
                  </td>
                  <td className="whitespace-nowrap px-4 py-3">
                    <div className="w-[88px]">
                      <ConfidenceMeter score={g.confidence} height={3} />
                    </div>
                  </td>
                  <td className="whitespace-nowrap px-4 py-3 md:pr-5">
                    <ResultChip result={g.result} />
                  </td>
                </tr>,
                <AnimatePresence key={`${key}::detail`} initial={false}>
                  {open && (
                    <tr>
                      <td colSpan={HEADERS.length} className="bg-panel2/60 px-4 py-0 md:px-5">
                        <motion.div
                          initial={{ opacity: 0 }}
                          animate={{ opacity: 1 }}
                          exit={{ opacity: 0 }}
                          transition={{ duration: 0.15 }}
                          className="grid gap-4 py-4 md:grid-cols-[1fr_auto] md:items-start md:gap-10"
                        >
                          <div>
                            <p className="font-mono text-[10px] uppercase tracking-[0.1em] text-inkfaint">
                              GRADING NOTE
                            </p>
                            <p className="mt-1.5 max-w-[640px] font-sans text-[13px] leading-[1.55] text-inkdim">
                              {g.result_note || '—'}
                            </p>
                          </div>
                          <div className="grid shrink-0 grid-cols-4 gap-6">
                            <OhlcCell label="OPEN" value={g.day_open} />
                            <OhlcCell label="HIGH" value={g.day_high} />
                            <OhlcCell label="LOW" value={g.day_low} />
                            <OhlcCell label="CLOSE" value={g.day_close} />
                          </div>
                        </motion.div>
                      </td>
                    </tr>
                  )}
                </AnimatePresence>,
              ]
            })}
          </tbody>
        </table>
      </div>
    </Panel>
  )
}
