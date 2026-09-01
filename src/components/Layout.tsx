import { useEffect } from 'react'
import { Outlet } from 'react-router-dom'
import Lenis from 'lenis'
import Navbar from '@/components/Navbar'
import Footer from '@/components/Footer'

/**
 * App shell (nested-route pattern: renders <Outlet/>).
 * Sticky navbar stays in normal flow — no page needs offset bookkeeping.
 * Owns Lenis smooth scrolling and the global scanline overlay.
 */
export default function Layout() {
  useEffect(() => {
    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    if (reduced) return
    const lenis = new Lenis({ lerp: 0.1 })
    let raf = 0
    const loop = (time: number) => {
      lenis.raf(time)
      raf = requestAnimationFrame(loop)
    }
    raf = requestAnimationFrame(loop)
    return () => {
      cancelAnimationFrame(raf)
      lenis.destroy()
    }
  }, [])

  return (
    <div className="scanlines flex min-h-[100dvh] flex-col">
      <Navbar />
      <main className="flex-1">
        <Outlet />
      </main>
      <Footer />
    </div>
  )
}
