import { memo, useEffect, useRef } from 'react'

interface Particle {
  x: number
  y: number
  vx: number
  vy: number
  dx: number
  dy: number
  r: number
  green: boolean
}

const COUNT = 120
const LINK_DIST = 90

/**
 * Lightweight 2D particle-swarm canvas (~120 particles, faint teal/green,
 * connective lines <90px, gentle cursor repel, opacity 0.25).
 * Disabled under prefers-reduced-motion and on coarse pointers <768px.
 */
function ParticleSwarmInner() {
  const canvasRef = useRef<HTMLCanvasElement>(null)

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    const coarse = window.matchMedia('(pointer: coarse)').matches && window.innerWidth < 768
    if (reduced || coarse) return

    const ctx = canvas.getContext('2d')
    if (!ctx) return

    let w = 0
    let h = 0
    let raf = 0
    const particles: Particle[] = []
    const mouse = { x: -9999, y: -9999 }

    const resize = () => {
      const rect = canvas.getBoundingClientRect()
      const dpr = Math.min(window.devicePixelRatio || 1, 2)
      w = rect.width
      h = rect.height
      canvas.width = w * dpr
      canvas.height = h * dpr
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0)
    }
    resize()

    for (let i = 0; i < COUNT; i++) {
      particles.push({
        x: Math.random() * w,
        y: Math.random() * h,
        vx: (Math.random() - 0.5) * 0.25,
        vy: (Math.random() - 0.5) * 0.25,
        dx: 0,
        dy: 0,
        r: 1 + Math.random() * 1.2,
        green: Math.random() < 0.3,
      })
    }

    const onMove = (e: PointerEvent) => {
      const rect = canvas.getBoundingClientRect()
      mouse.x = e.clientX - rect.left
      mouse.y = e.clientY - rect.top
    }
    const onLeave = () => {
      mouse.x = -9999
      mouse.y = -9999
    }
    window.addEventListener('pointermove', onMove, { passive: true })
    window.addEventListener('pointerleave', onLeave)
    window.addEventListener('resize', resize)

    const step = () => {
      ctx.clearRect(0, 0, w, h)
      for (const p of particles) {
        // cursor repel — separate displacement with lerp decay
        const mdx = p.x + p.dx - mouse.x
        const mdy = p.y + p.dy - mouse.y
        const md2 = mdx * mdx + mdy * mdy
        if (md2 < 10000 && md2 > 0.01) {
          const md = Math.sqrt(md2)
          const f = ((100 - md) / 100) * 0.6
          p.dx += (mdx / md) * f
          p.dy += (mdy / md) * f
        }
        p.dx *= 0.95
        p.dy *= 0.95
        p.x += p.vx
        p.y += p.vy
        if (p.x < 0) p.x = w
        if (p.x > w) p.x = 0
        if (p.y < 0) p.y = h
        if (p.y > h) p.y = 0
      }

      // connective lines
      ctx.lineWidth = 0.5
      for (let i = 0; i < particles.length; i++) {
        const a = particles[i]
        const ax = a.x + a.dx
        const ay = a.y + a.dy
        for (let j = i + 1; j < particles.length; j++) {
          const b = particles[j]
          const bx = b.x + b.dx
          const by = b.y + b.dy
          const ddx = ax - bx
          const ddy = ay - by
          const d2 = ddx * ddx + ddy * ddy
          if (d2 < LINK_DIST * LINK_DIST) {
            const alpha = (1 - Math.sqrt(d2) / LINK_DIST) * 0.25
            ctx.strokeStyle = `rgba(94, 234, 212, ${alpha.toFixed(3)})`
            ctx.beginPath()
            ctx.moveTo(ax, ay)
            ctx.lineTo(bx, by)
            ctx.stroke()
          }
        }
      }

      // dots
      for (const p of particles) {
        ctx.fillStyle = p.green
          ? 'rgba(46, 229, 160, 0.6)'
          : 'rgba(94, 234, 212, 0.6)'
        ctx.beginPath()
        ctx.arc(p.x + p.dx, p.y + p.dy, p.r, 0, Math.PI * 2)
        ctx.fill()
      }

      raf = requestAnimationFrame(step)
    }
    raf = requestAnimationFrame(step)

    return () => {
      cancelAnimationFrame(raf)
      window.removeEventListener('pointermove', onMove)
      window.removeEventListener('pointerleave', onLeave)
      window.removeEventListener('resize', resize)
    }
  }, [])

  return (
    <canvas
      ref={canvasRef}
      aria-hidden
      style={{
        position: 'absolute',
        inset: 0,
        width: '100%',
        height: '100%',
        opacity: 0.25,
        pointerEvents: 'none',
      }}
    />
  )
}

export const ParticleSwarm = memo(ParticleSwarmInner)
