import type { Grade } from '@/lib/swarm-api'

export interface GradeCounts {
  wins: number
  losses: number
  flats: number
  opens: number
}

/** Tally WIN / LOSS / FLAT / OPEN results for a set of graded picks. */
export function countResults(grades: Grade[]): GradeCounts {
  const c: GradeCounts = { wins: 0, losses: 0, flats: 0, opens: 0 }
  for (const g of grades) {
    const r = g.result.toUpperCase()
    if (r === 'WIN') c.wins += 1
    else if (r === 'LOSS') c.losses += 1
    else if (r === 'FLAT') c.flats += 1
    else c.opens += 1
  }
  return c
}

/**
 * Realized win rate: WIN / (WIN + LOSS). FLAT (never triggered) and OPEN
 * (not yet graded) are excluded. Returns null when there are no decided
 * picks (avoid showing a meaningless 0%).
 */
export function winRate(c: Pick<GradeCounts, 'wins' | 'losses'>): number | null {
  const decided = c.wins + c.losses
  if (decided === 0) return null
  return (c.wins / decided) * 100
}

/** Distinct session (run_date) count. */
export function sessionCount(grades: Grade[]): number {
  return new Set(grades.map((g) => g.run_date)).size
}

/** Percent label with en-dash fallback for undecided buckets. */
export function fmtRate(rate: number | null, digits = 1): string {
  return rate === null ? '—' : `${rate.toFixed(digits)}%`
}
