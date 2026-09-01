/** The 14 swarm stages — single source of truth for the methodology page. */
export interface SwarmStage {
  num: string
  name: string
  desc: string
}

export const STAGES: SwarmStage[] = [
  { num: '01', name: 'Overnight Scan', desc: 'Futures, VIX, yields, dollar, oil, gold, BTC priced before dawn.' },
  { num: '02', name: 'Global Markets', desc: "Asia closes and Europe's session read for overnight risk transfer." },
  { num: '03', name: 'Breaking News', desc: 'Wires scanned; headlines tagged by tone and market relevance.' },
  { num: '04', name: 'Economic Calendar', desc: "The day's prints ranked by market-moving potential." },
  { num: '05', name: 'Earnings Watch', desc: "BMO/AMC reporters plus the week's bellwethers." },
  { num: '06', name: 'SEC Filings', desc: '8-Ks and material events pulled from EDGAR overnight.' },
  { num: '07', name: 'Options Flow', desc: 'Put/call ratios, IV, expected moves, and where the walls sit.' },
  { num: '08', name: 'Institutional Activity', desc: '13F flows, positioning shifts, sector-level smart money.' },
  { num: '09', name: 'Sentiment Composite', desc: 'Five gauges fused into one hedged-or-not verdict.' },
  { num: '10', name: 'Technical Analysis', desc: 'RSI, moving averages, ATR, and the S/R ladder per ticker.' },
  { num: '11', name: 'Cross-Verification', desc: 'Every major claim re-checked against independent evidence.' },
  { num: '12', name: 'Risk Assessment', desc: 'Tail risks mapped by severity and likelihood.' },
  { num: '13', name: 'Opportunity Ranking', desc: 'Setups scored 0–100 and ranked against each other.' },
  { num: '14', name: 'Playbook Synthesis', desc: 'The final brief: calls, puts, stock setups, invalidations.' },
]
