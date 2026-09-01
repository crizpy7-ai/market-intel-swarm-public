import type { OvernightItem } from '@/lib/swarm-api'

function TapeItem({ item }: { item: OvernightItem }) {
  const up = item.chg >= 0
  return (
    <span className="inline-flex items-center gap-2 whitespace-nowrap">
      {item.warn && <span className="h-3 w-[2px] bg-warn" aria-hidden />}
      <span className="text-inkdim">{item.symbol}</span>
      <span className="font-medium text-ink">
        {item.price.toLocaleString('en-US', {
          minimumFractionDigits: item.price < 10 ? 3 : 2,
          maximumFractionDigits: item.price < 10 ? 3 : 2,
        })}
      </span>
      <span className={up ? 'text-up' : 'text-down'}>
        {up ? '▲' : '▼'}
        {Math.abs(item.chg).toFixed(2)}%
      </span>
    </span>
  )
}

/**
 * 40px infinite marquee strip of all overnight instruments.
 * CSS animation, 40s loop, pauses on hover; reduced-motion → static wrap.
 */
export function TickerTape({ items }: { items: OvernightItem[] }) {
  if (!items.length) return null
  const doubled = [...items, ...items]

  return (
    <div className="group relative h-10 overflow-hidden border-b border-hair bg-panel">
      <div className="flex h-full w-max animate-marquee items-center gap-8 px-4 font-mono text-[12px] tabular-nums group-hover:[animation-play-state:paused] motion-reduce:w-full motion-reduce:animate-none motion-reduce:flex-wrap motion-reduce:justify-start motion-reduce:gap-4 motion-reduce:py-2 motion-reduce:h-auto">
        {doubled.map((item, i) => (
          <span key={`${item.symbol}-${i}`} className="inline-flex items-center gap-8">
            <TapeItem item={item} />
            <span className="text-inkfaint" aria-hidden>
              ·
            </span>
          </span>
        ))}
      </div>
    </div>
  )
}
