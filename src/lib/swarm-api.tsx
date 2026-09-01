/**
 * SWARM data layer — contract for all pages.
 *
 * Fetches the AI Market Intelligence Swarm's daily run from Supabase PostgREST,
 * polls the latest-run endpoint every 5 minutes, supports `?date=YYYY-MM-DD`
 * archive views, and falls back to the bundled snapshot
 * (`src/data/fallback-run.json`) on any error/timeout.
 */
import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
} from 'react'
import type { ReactNode } from 'react'
import fallbackSnapshot from '@/data/fallback-run.json'

/* ------------------------------------------------------------------ */
/* Types — mirror the payload schema exactly                           */
/* ------------------------------------------------------------------ */

export interface OvernightItem {
  symbol: string
  name: string
  price: number
  chg: number
  note: string
  warn?: boolean
}

export interface GlobalMarket {
  name: string
  price: number
  chg: number
  state: 'live' | 'closed' | string
  note: string
}

export interface Headline {
  tag: string
  tone: 'risk' | 'bull' | 'bear' | 'neutral' | string
  text: string
}

export interface CalendarEvent {
  time: string
  event: string
  consensus: string
  prior: string
  importance: 'high' | 'med' | 'low' | string
}

export interface EarningsItem {
  ticker: string
  name: string
  est: string
  note: string
}

export interface Earnings {
  bmo: EarningsItem[]
  amc: EarningsItem[]
  week: EarningsItem[]
}

export interface SecFiling {
  ticker: string
  date: string
  item: string
  description: string
}

export type OptionSignal = 'bullish' | 'bearish' | 'defensive' | 'neutral' | string

export interface OptionsFlowRow {
  ticker: string
  expiry: string
  pcr_vol: number | null
  pcr_oi: number | null
  atm_iv: number | null
  exp_move: number | null
  signal: OptionSignal
  detail: string
}

export interface InstitutionalItem {
  tag: string
  text: string
}

export type GaugeBias =
  | 'bullish'
  | 'bearish'
  | 'defensive'
  | 'cautious'
  | 'neutral'
  | 'neutral-cautious'
  | string

export interface SentimentGauge {
  name: string
  reading: string
  bias: GaugeBias
}

export interface Sentiment {
  composite: string
  gauges: SentimentGauge[]
}

export interface TechnicalRow {
  ticker: string
  last: number
  rsi: number
  ma20: number
  ma50: number
  hi20: number
  lo20: number
  atr: number
  support: number[]
  resistance: number[]
}

export interface CrossVerification {
  claim: string
  agree: string
  evidence: string
  verdict: 'confirmed' | 'confirmed w/ event risk' | 'watch' | string
}

export interface Risk {
  risk: string
  severity: 'high' | 'medium' | 'low' | string
  likelihood: string
  note: string
}

export interface Opportunity {
  rank: number
  name: string
  thesis: string
  confidence: number
}

export interface PlaybookOption {
  underlying: string
  contract: string
  entry: string
  target: string
  stop: string
  confidence: number
  rationale: string
  invalidation: string
}

export interface PlaybookStock {
  ticker: string
  bias: string
  catalyst: string
  levels: string
  invalidation: string
}

export interface Playbook {
  master_switch: string
  calls: PlaybookOption[]
  puts: PlaybookOption[]
  stocks: PlaybookStock[]
}

export interface SwarmRun {
  run_date: string
  generated_at_utc: string
  market_status: string
  session_label: string
  overnight: OvernightItem[]
  global_markets: GlobalMarket[]
  headlines: Headline[]
  calendar: CalendarEvent[]
  earnings: Earnings
  sec_filings: SecFiling[]
  options_flow: OptionsFlowRow[]
  institutional: InstitutionalItem[]
  sentiment: Sentiment
  technicals: TechnicalRow[]
  cross_verification: CrossVerification[]
  risks: Risk[]
  opportunities: Opportunity[]
  playbook: Playbook
  disclaimer: string
}

/** Row shape returned by the PostgREST history endpoint. */
export interface SwarmRunSummary {
  run_date: string
  created_at: string
}

/* ------------------------------------------------------------------ */
/* Endpoints                                                           */
/* ------------------------------------------------------------------ */

const REST_BASE = 'https://bjnkgxkcbbnbtazelsjs.supabase.co/rest/v1/swarm_runs'
const API_KEY = 'sb_publishable_F49fzNl_CTWUdJy5ZdMDMw_MFrIOXw-'

const HEADERS: HeadersInit = {
  apikey: API_KEY,
  Authorization: `Bearer ${API_KEY}`,
}

const LATEST_URL = `${REST_BASE}?select=run_date,created_at,payload&order=run_date.desc&limit=1`
const HISTORY_URL = `${REST_BASE}?select=run_date,created_at&order=run_date.desc&limit=30`
const dayUrl = (date: string) =>
  `${REST_BASE}?select=run_date,created_at,payload&run_date=eq.${date}`

export const POLL_INTERVAL_S = 300
const FETCH_TIMEOUT_MS = 6000

/* ------------------------------------------------------------------ */
/* Low-level fetch helpers                                             */
/* ------------------------------------------------------------------ */

async function fetchJson<T>(url: string): Promise<T> {
  const controller = new AbortController()
  const timer = setTimeout(() => controller.abort(), FETCH_TIMEOUT_MS)
  try {
    const res = await fetch(url, { headers: HEADERS, signal: controller.signal })
    if (!res.ok) throw new Error(`PostgREST ${res.status}`)
    return (await res.json()) as T
  } finally {
    clearTimeout(timer)
  }
}

interface RunRow {
  run_date: string
  created_at: string
  payload: SwarmRun
}

/** Fetch the latest run. Throws on any error/timeout/non-200/empty result. */
export async function fetchLatestRun(): Promise<SwarmRun> {
  const rows = await fetchJson<RunRow[]>(LATEST_URL)
  if (!rows.length) throw new Error('no runs')
  return rows[0].payload
}

/** Fetch a single archived run by date (YYYY-MM-DD). */
export async function fetchRunByDate(date: string): Promise<SwarmRun> {
  const rows = await fetchJson<RunRow[]>(dayUrl(date))
  if (!rows.length) throw new Error(`no run for ${date}`)
  return rows[0].payload
}

/** Fetch the archive list (last 30 runs). */
export async function fetchRunHistory(): Promise<SwarmRunSummary[]> {
  return fetchJson<SwarmRunSummary[]>(HISTORY_URL)
}

/** Bundled offline snapshot (Sep 1, 2026 run). */
export function getFallbackRun(): SwarmRun {
  return fallbackSnapshot as unknown as SwarmRun
}

/* ------------------------------------------------------------------ */
/* React hook + provider                                               */
/* ------------------------------------------------------------------ */

export interface SwarmRunState {
  /** Current run payload (never null after first load — falls back to snapshot). */
  run: SwarmRun
  loading: boolean
  refreshing: boolean
  /** True when rendering the bundled snapshot because the fetch failed. */
  isFallback: boolean
  /** Archived date being viewed (?date=YYYY-MM-DD), or null for latest. */
  viewDate: string | null
  setViewDate: (date: string | null) => void
  /** Seconds until the next automatic poll (paused while viewing an archive date). */
  secondsToNextPoll: number
  /** run_date of a newly detected run awaiting user/auto load, else null. */
  newRunDate: string | null
  loadNewRun: () => void
  dismissNewRun: () => void
  /** Manual refresh ("Refresh now"). */
  refresh: () => void
  /** Last successful (or fallback) load time. */
  lastSyncAt: Date | null
}

const SwarmRunContext = createContext<SwarmRunState | null>(null)

export function SwarmRunProvider({ children }: { children: ReactNode }) {
  const [run, setRun] = useState<SwarmRun>(() => getFallbackRun())
  const [loading, setLoading] = useState(true)
  const [refreshing, setRefreshing] = useState(false)
  const [isFallback, setIsFallback] = useState(false)
  const [viewDate, setViewDate] = useState<string | null>(null)
  const [secondsToNextPoll, setSecondsToNextPoll] = useState(POLL_INTERVAL_S)
  const [newRunDate, setNewRunDate] = useState<string | null>(null)
  const [lastSyncAt, setLastSyncAt] = useState<Date | null>(null)

  const runRef = useRef(run)
  const viewDateRef = useRef(viewDate)
  const mountedRef = useRef(true)
  useEffect(() => {
    runRef.current = run
    viewDateRef.current = viewDate
  }, [run, viewDate])

  const applyRun = useCallback((payload: SwarmRun, fallback: boolean) => {
    if (!mountedRef.current) return
    setRun(payload)
    setIsFallback(fallback)
    setLastSyncAt(new Date())
    setLoading(false)
    setRefreshing(false)
  }, [])

  const loadLatest = useCallback(
    async (opts?: { detectOnly?: boolean }) => {
      try {
        const latest = await fetchLatestRun()
        const current = runRef.current
        if (
          opts?.detectOnly &&
          !isFallbackDate(current) &&
          latest.run_date !== current.run_date
        ) {
          if (mountedRef.current) setNewRunDate(latest.run_date)
          return
        }
        applyRun(latest, false)
        if (mountedRef.current) setNewRunDate(null)
      } catch {
        if (opts?.detectOnly) return
        applyRun(getFallbackRun(), true)
      }
    },
    [applyRun],
  )

  const loadArchive = useCallback(
    async (date: string) => {
      setLoading(true)
      try {
        const archived = await fetchRunByDate(date)
        applyRun(archived, false)
      } catch {
        applyRun(getFallbackRun(), true)
      }
    },
    [applyRun],
  )

  // React to viewDate changes (archive mode vs latest mode).
  useEffect(() => {
    if (viewDate) {
      void loadArchive(viewDate)
    } else {
      setLoading(true)
      void loadLatest()
      setSecondsToNextPoll(POLL_INTERVAL_S)
    }
  }, [viewDate, loadLatest, loadArchive])

  // Countdown ticker — 1s resolution; polls at zero in "latest" mode.
  useEffect(() => {
    const id = setInterval(() => {
      setSecondsToNextPoll((s) => {
        if (viewDateRef.current) return s // no polling in archive mode
        if (s <= 1) {
          void loadLatest({ detectOnly: !isFallbackDate(runRef.current) })
          return POLL_INTERVAL_S
        }
        return s - 1
      })
    }, 1000)
    return () => clearInterval(id)
  }, [loadLatest])

  // Auto-load a newly detected run after 5s unless the user is mid-page.
  useEffect(() => {
    if (!newRunDate) return
    const id = setTimeout(() => {
      if (window.scrollY < 160) void loadLatest()
    }, 5000)
    return () => clearTimeout(id)
  }, [newRunDate, loadLatest])

  useEffect(() => {
    mountedRef.current = true
    return () => {
      mountedRef.current = false
    }
  }, [])

  const refresh = useCallback(() => {
    setRefreshing(true)
    setSecondsToNextPoll(POLL_INTERVAL_S)
    if (viewDateRef.current) {
      void loadArchive(viewDateRef.current)
    } else {
      void loadLatest()
    }
  }, [loadLatest, loadArchive])

  const loadNewRun = useCallback(() => {
    setNewRunDate(null)
    void loadLatest()
  }, [loadLatest])

  const dismissNewRun = useCallback(() => setNewRunDate(null), [])

  const value = useMemo<SwarmRunState>(
    () => ({
      run,
      loading,
      refreshing,
      isFallback,
      viewDate,
      setViewDate,
      secondsToNextPoll,
      newRunDate,
      loadNewRun,
      dismissNewRun,
      refresh,
      lastSyncAt,
    }),
    [
      run,
      loading,
      refreshing,
      isFallback,
      viewDate,
      secondsToNextPoll,
      newRunDate,
      loadNewRun,
      dismissNewRun,
      refresh,
      lastSyncAt,
    ],
  )

  return <SwarmRunContext.Provider value={value}>{children}</SwarmRunContext.Provider>
}

function isFallbackDate(run: SwarmRun): boolean {
  return run.run_date === getFallbackRun().run_date
}

/**
 * Access the shared swarm run. Pages consume this hook; the provider lives
 * once near the router root (see App.tsx).
 */
export function useSwarmRun(): SwarmRunState {
  const ctx = useContext(SwarmRunContext)
  if (!ctx) throw new Error('useSwarmRun must be used inside <SwarmRunProvider>')
  return ctx
}

/* ------------------------------------------------------------------ */
/* Small formatting helpers shared by pages                            */
/* ------------------------------------------------------------------ */

/** Em-dash for missing numeric/string values. */
export function dash(v: number | string | null | undefined): string {
  return v === null || v === undefined || v === '' ? '—' : String(v)
}

/** Format a signed percentage change with explicit sign. */
export function fmtChg(chg: number | null | undefined, digits = 2): string {
  if (chg === null || chg === undefined) return '—'
  const sign = chg > 0 ? '+' : chg < 0 ? '−' : ''
  return `${sign}${Math.abs(chg).toFixed(digits)}%`
}

/** Format a price with thousands separators. */
export function fmtPrice(n: number | null | undefined, digits = 2): string {
  if (n === null || n === undefined) return '—'
  return n.toLocaleString('en-US', {
    minimumFractionDigits: digits,
    maximumFractionDigits: digits,
  })
}

/** "HH:MM" UTC from an ISO timestamp. */
export function fmtUtcTime(iso: string): string {
  const d = new Date(iso)
  if (Number.isNaN(d.getTime())) return '--:--'
  return `${String(d.getUTCHours()).padStart(2, '0')}:${String(d.getUTCMinutes()).padStart(2, '0')}`
}

/** Long display date, e.g. " 1, 2026". */
export function fmtLongDate(runDate: string): string {
  const d = new Date(`${runDate}T12:00:00Z`)
  if (Number.isNaN(d.getTime())) return runDate
  return d.toLocaleDateString('en-US', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    timeZone: 'UTC',
  })
}
