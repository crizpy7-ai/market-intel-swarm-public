# Pre-Market Intelligence Swarm

An auto-refreshing web dashboard that operationalizes an **AI pre-market research swarm** for U.S. equities. Each trading day before the open, an agent pipeline runs 14 research stages and publishes a **Day Trading Playbook**. This app renders the latest run plus full run history.

![og-image](public/og-image.png)

## The 14 stages (each daily run)

1. Overnight scan (index futures, VIX, 10Y yield, DXY, WTI, gold, BTC)
2. Global markets (Nikkei, Hang Seng, Shanghai, DAX, Euro Stoxx, FTSE)
3. Futures detail
4. Breaking news
5. Economic calendar
6. Earnings radar (BMO / AMC / week)
7. SEC filings scan (EDGAR 8-K events)
8. Options flow (put/call ratios, ATM IV, expected move, OI walls, volume leaders)
9. Institutional activity
10. Sentiment composite
11. Technical levels (RSI-14, 20/50-DMA, 20-day range, ATR-14, S/R ladders)
12. Cross-verification (multi-source signal agreement)
13. Risk assessment (severity × likelihood matrix)
14. Opportunity ranking (confidence-scored)

**Playbook:** top 3 call options, top 3 put options, 3–5 day-trading stock setups — each with entry zone, profit target, stop-loss, rationale, confidence score, and invalidating conditions. Educational research only — not financial advice.

## Architecture

```
Agent (Kimi) ── runs on a weekday 8:00 AM ET cron ──► collects data
  (Yahoo Finance + SEC EDGAR plugins, web news) ──► synthesizes payload JSON
  ──► POST /rest/v1/swarm_runs (Supabase PostgREST)

Browser app (React + Vite) ──► GET latest run / history from Supabase
  ──► polls every 5 min ──► falls back to src/data/fallback-run.json offline
```

- **Frontend:** React 19 + TypeScript, Vite 7, Tailwind 3.4, shadcn/ui, Framer Motion, GSAP, Lenis
- **Data store:** Supabase Postgres, table `public.swarm_runs (id uuid pk, run_date date, created_at timestamptz, session_label text, payload jsonb)`, RLS with public `SELECT` and constrained `INSERT` (`session_label = 'pre-market'`)
- **Routes:** `/` dashboard (accepts `?date=YYYY-MM-DD`), `/playbook`, `/history`, `/methodology`

## Develop

```bash
npm install
npm run dev
npm run build
```

## Payload schema

See `src/lib/swarm-api.tsx` for the typed `SwarmRun` interface — it is the single source of truth and matches the JSONB payload produced by the agent run. A full example lives in `src/data/fallback-run.json` (Sep 1, 2026 run).

## Disclaimer

All content is research/educational analysis, not financial advice. 0DTE and short-dated options can expire worthless.
