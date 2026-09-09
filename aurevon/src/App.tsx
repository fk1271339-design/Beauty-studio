 import { useEffect, useState } from 'react'
import { Flower2 } from 'lucide-react'

// ─── Easing constants (exact spec) ───────────────────────────────────
const E_ENTER = 'cubic-bezier(0.16, 1, 0.3, 1)'
const E_OVERLAY = 'cubic-bezier(0.76, 0, 0.24, 1)'

// ─── Nav links ────────────────────────────────────────────────────────
const NAV_LINKS = ['Home', 'Story', 'Collection', 'Inquire']

// ─── Small line-counter badge for overlay ────────────────────────────
const OVERLAY_META = ['Paris · London · New York', '© 2026 Aurevon']

export default function App() {
  const [navMounted, setNavMounted]     = useState(false)
  const [heroMounted, setHeroMounted]   = useState(false)
  const [scrolled, setScrolled]         = useState(false)
  const [overlayOpen, setOverlayOpen]   = useState(false)
  const [videoError, setVideoError]     = useState(false)

  // ── Mount & scroll ────────────────────────────────────────────────
  useEffect(() => {
    const t1 = setTimeout(() => setNavMounted(true), 100)
    const t2 = setTimeout(() => setHeroMounted(true), 300)
    const onScroll = () => setScrolled(window.scrollY > 40)
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => {
      clearTimeout(t1)
      clearTimeout(t2)
      window.removeEventListener('scroll', onScroll)
    }
  }, [])

  // ── Body scroll lock ──────────────────────────────────────────────
  useEffect(() => {
    document.body.style.overflow = overlayOpen ? 'hidden' : ''
    return () => { document.body.style.overflow = '' }
  }, [overlayOpen])

  const closeOverlay  = () => setOverlayOpen(false)
  const toggleOverlay = () => setOverlayOpen(o => !o)

  // ── Reusable entrance style ───────────────────────────────────────
  const enter = (delay: number, ready = navMounted) => ({
    opacity:    ready ? 1 : 0,
    transform:  ready ? 'translateY(0px)' : 'translateY(-14px)',
    transition: `opacity 700ms ${E_ENTER} ${delay}ms, transform 700ms ${E_ENTER} ${delay}ms`,
  })

  // ── Hero content entrance ─────────────────────────────────────────
  const heroEnter = (delay: number) => ({
    opacity:    heroMounted ? 1 : 0,
    transform:  heroMounted ? 'translateY(0px)' : 'translateY(28px)',
    transition: heroMounted
      ? `opacity 900ms ${E_ENTER} ${delay}ms, transform 900ms ${E_ENTER} ${delay}ms`
      : 'none',
  })

  return (
    <div className="bg-black min-h-[100dvh]">

      {/* ═══════════════════ NAVBAR ═══════════════════ */}
      <header
        role="banner"
        className={[
          'fixed top-0 left-0 w-full z-50 transition-all duration-500',
          scrolled
            ? 'bg-black/80 backdrop-blur-md border-b border-white/[0.06]'
            : 'bg-transparent',
        ].join(' ')}
      >
        <div className="max-w-[1440px] mx-auto px-6 md:px-10 flex items-center justify-between h-16 md:h-20">

          {/* Logo */}
          <a
            href="#"
            className="text-white text-xl md:text-2xl font-semibold tracking-tight z-50 no-select"
            style={enter(0)}
          >
            Aurevon
          </a>

          {/* ── Desktop: Navigate pill (center) ── */}
          <div className="hidden md:flex items-center" style={enter(200)}>
            <button
              onClick={toggleOverlay}
              className="
                flex items-center gap-2 px-5 py-[9px] rounded-full
                border border-white/20 text-white/90 text-sm font-medium
                hover:bg-white/10 hover:border-white/40
                active:scale-95
                transition-all duration-300 no-select touch-target
              "
              aria-expanded={overlayOpen}
              aria-label={overlayOpen ? 'Close navigation' : 'Open navigation'}
            >
              <span
                style={{
                  display: 'inline-block',
                  transition: `opacity 250ms ${E_OVERLAY}`,
                }}
              >
                {overlayOpen ? 'Close' : 'Navigate'}
              </span>
            </button>
          </div>

          {/* ── Desktop: Flower icon (right) ── */}
          <div className="hidden md:flex items-center" style={enter(400)}>
            <Flower2
              className="w-7 h-7 text-white/90 hover:text-white transition-colors duration-300"
              strokeWidth={1.25}
            />
          </div>

          {/* ── Mobile: Hamburger (right) ── */}
          <button
            onClick={toggleOverlay}
            className="
              md:hidden flex flex-col items-center justify-center
              w-11 h-11 -mr-2 no-select touch-target
            "
            aria-expanded={overlayOpen}
            aria-label="Toggle menu"
            style={enter(200)}
          >
            <span
              className="block w-6 h-[1.5px] bg-white rounded-full origin-center"
              style={{
                transform: overlayOpen
                  ? 'rotate(45deg) translate(0px, 5px)'
                  : 'none',
                transition: `transform 500ms ${E_OVERLAY}`,
              }}
            />
            <span
              className="block w-6 h-[1.5px] bg-white rounded-full origin-center mt-[7px]"
              style={{
                transform: overlayOpen
                  ? 'rotate(-45deg) translate(0px, -5px)'
                  : 'none',
                opacity: overlayOpen ? 1 : 1,
                transition: `transform 500ms ${E_OVERLAY}`,
              }}
            />
          </button>

        </div>
      </header>

      {/* ═══════════════════ FULLSCREEN OVERLAY ═══════════════════ */}
      <div
        role="dialog"
        aria-modal="true"
        aria-hidden={!overlayOpen}
        aria-label="Navigation menu"
        className="fixed inset-0 z-40 bg-black flex flex-col overlay-scroll"
        style={{
          opacity:    overlayOpen ? 1 : 0,
          visibility: overlayOpen ? 'visible' : 'hidden',
          transition: `opacity 700ms ${E_OVERLAY}, visibility 700ms ${E_OVERLAY}`,
        }}
      >
        {/* Subtle noise texture layer */}
        <div
          className="absolute inset-0 pointer-events-none grain-overlay opacity-[0.03]"
          style={{
            backgroundImage: 'url("data:image/svg+xml,%3Csvg viewBox=\'0 0 256 256\' xmlns=\'http://www.w3.org/2000/svg\'%3E%3Cfilter id=\'noise\'%3E%3CfeTurbulence type=\'fractalNoise\' baseFrequency=\'0.9\' numOctaves=\'4\' stitchTiles=\'stitch\'/%3E%3C/filter%3E%3Crect width=\'100%25\' height=\'100%25\' filter=\'url(%23noise)\'/%3E%3C/svg%3E")',
          }}
        />

        {/* ── Thin top accent line ── */}
        <div
          className="absolute top-0 left-0 w-full h-[1px] bg-gradient-to-r from-transparent via-white/20 to-transparent"
          style={{
            opacity:    overlayOpen ? 1 : 0,
            transition: `opacity 600ms ${E_OVERLAY} 300ms`,
          }}
        />

        {/* ── Centered nav links ── */}
        <nav
          className="flex-1 flex flex-col items-center justify-center gap-6 sm:gap-8 px-6"
          aria-label="Main navigation"
        >
          {NAV_LINKS.map((link, i) => {
            const openDelay = 150 + i * 80
            return (
              <a
                key={link}
                href="#"
                onClick={closeOverlay}
                className="
                  font-instrument text-white
                  text-[2.75rem] sm:text-5xl md:text-6xl
                  hover:opacity-50
                  active:opacity-30
                  transition-opacity duration-150
                  no-select leading-none
                  group relative
                "
                style={{
                  opacity:    overlayOpen ? 1 : 0,
                  transform:  overlayOpen ? 'translateY(0px)' : 'translateY(20px)',
                  transition: overlayOpen
                    ? `opacity 600ms ${E_OVERLAY} ${openDelay}ms, transform 600ms ${E_OVERLAY} ${openDelay}ms`
                    : `opacity 300ms ${E_OVERLAY} 0ms, transform 300ms ${E_OVERLAY} 0ms`,
                }}
              >
                {/* Italic hover decoration */}
                <span className="inline-block group-hover:italic transition-all duration-300">
                  {link}
                </span>
              </a>
            )
          })}
        </nav>

        {/* ── Bottom meta row ── */}
        <div
          className="flex flex-col sm:flex-row items-center justify-between gap-2 px-6 md:px-10 pb-8 pb-safe"
          style={{
            opacity:    overlayOpen ? 1 : 0,
            transform:  overlayOpen ? 'translateY(0px)' : 'translateY(10px)',
            transition: overlayOpen
              ? `opacity 600ms ${E_OVERLAY} 500ms, transform 600ms ${E_OVERLAY} 500ms`
              : `opacity 300ms ${E_OVERLAY} 0ms, transform 300ms ${E_OVERLAY} 0ms`,
          }}
        >
          {OVERLAY_META.map(m => (
            <span key={m} className="text-white/25 text-xs tracking-widest uppercase font-light">
              {m}
            </span>
          ))}
          <div className="flex items-center gap-3">
            <a href="#" className="text-white/25 hover:text-white/60 text-xs tracking-widest uppercase transition-colors duration-200">
              Instagram
            </a>
            <span className="text-white/10 text-xs">·</span>
            <a href="#" className="text-white/25 hover:text-white/60 text-xs tracking-widest uppercase transition-colors duration-200">
              Pinterest
            </a>
          </div>
        </div>
      </div>

      {/* ═══════════════════ HERO ═══════════════════ */}
      <section
        className="relative w-full h-[100dvh] overflow-hidden flex items-end justify-center"
        aria-label="Hero"
      >
        {/* ── Background video ── */}
        <div
          className="absolute inset-0"
          style={{
            opacity:    heroMounted ? 1 : 0,
            transform:  heroMounted ? 'scale(1)' : 'scale(1.05)',
            transition: `opacity 1400ms ${E_ENTER}, transform 1400ms ${E_ENTER}`,
          }}
        >
          {!videoError ? (
            <video
              src="https://d8j0ntlcm91z4.cloudfront.net/user_38xzZboKViGWJOttwIXH07lWA1P/hf_20260819_212700_3bb9329b-5c50-4257-a09b-ca85cf3654a3.mp4"
              autoPlay
              muted
              loop
              playsInline
              className="w-full h-full object-cover"
              onError={() => setVideoError(true)}
            />
          ) : (
            /* Fallback: dark gradient when video fails */
            <div className="w-full h-full bg-gradient-to-br from-neutral-900 via-black to-neutral-950" />
          )}
        </div>

        {/* ── Bottom vignette for legibility ── */}
        <div
          className="absolute inset-0 pointer-events-none"
          style={{
            background: `
              linear-gradient(
                to top,
                rgba(0,0,0,0.72) 0%,
                rgba(0,0,0,0.35) 30%,
                rgba(0,0,0,0.05) 60%,
                transparent 100%
              )
            `,
          }}
        />

        {/* ── Left edge vignette (subtle) ── */}
        <div
          className="absolute inset-0 pointer-events-none hidden sm:block"
          style={{
            background: 'linear-gradient(to right, rgba(0,0,0,0.25) 0%, transparent 40%)',
          }}
        />

        {/* ── Foreground text block ── */}
        <div className="relative z-10 w-full max-w-4xl mx-auto px-6 md:px-10 pb-16 md:pb-24 pb-safe-xl text-center">

          {/* Small label / eyebrow */}
          <div
            className="flex items-center justify-center gap-3 mb-5 md:mb-6"
            style={heroEnter(200)}
          >
            <span className="block w-8 h-[1px] bg-white/40 rounded-full" />
            <span className="text-white/50 text-xs tracking-[0.3em] uppercase font-light">
              Private Collection 2026
            </span>
            <span className="block w-8 h-[1px] bg-white/40 rounded-full" />
          </div>

          {/* H1 */}
          <h1
            className="
              font-instrument text-white
              text-[clamp(2.25rem,8vw,4.75rem)]
              leading-[0.95]
              mb-5 md:mb-6
            "
            style={heroEnter(400)}
          >
            A carefully curated
            <br className="hidden sm:block" />
            {' '}collection beyond compare
          </h1>

          {/* Subcopy */}
          <p
            className="text-white/65 text-base md:text-[1.1rem] mb-8 md:mb-10 max-w-sm sm:max-w-md mx-auto leading-relaxed"
            style={heroEnter(600)}
          >
            Reserve your place in our private gallery.
          </p>

          {/* CTA group */}
          <div
            className="flex flex-col sm:flex-row items-center justify-center gap-3 sm:gap-4"
            style={heroEnter(800)}
          >
            <a
              href="#"
              className="
                inline-flex items-center justify-center
                px-8 py-3.5 rounded-full
                bg-white text-black
                text-sm md:text-base font-medium
                hover:bg-white/90 active:scale-95
                transition-all duration-300
                w-full sm:w-auto min-w-[180px]
                touch-target
              "
            >
              Join the waitlist
            </a>
            <a
              href="#"
              className="
                inline-flex items-center justify-center gap-2
                px-8 py-3.5 rounded-full
                border border-white/25 text-white/80
                text-sm md:text-base font-medium
                hover:bg-white/10 hover:border-white/50 hover:text-white
                active:scale-95
                transition-all duration-300
                w-full sm:w-auto min-w-[180px]
                touch-target
              "
            >
              Learn more
              <svg
                width="14" height="14" viewBox="0 0 14 14" fill="none"
                className="opacity-60"
              >
                <path d="M1 7h12M8 2l5 5-5 5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </a>
          </div>

          {/* Scroll hint (desktop only) */}
          <div
            className="hidden md:flex flex-col items-center gap-2 mt-10 opacity-30"
            style={heroEnter(1000)}
          >
            <span className="text-white text-[0.6rem] tracking-[0.35em] uppercase">Scroll</span>
            <div className="w-[1px] h-8 bg-white/50 overflow-hidden relative">
              <div
                className="absolute top-0 left-0 w-full h-1/2 bg-white"
                style={{ animation: 'scrollDown 2s ease-in-out infinite' }}
              />
            </div>
          </div>
        </div>

        {/* ── Bottom-left editorial label ── */}
        <div
          className="absolute left-6 md:left-10 bottom-6 md:bottom-8 z-10 hidden sm:flex flex-col gap-1"
          style={heroEnter(1100)}
        >
          <span className="text-white/25 text-[0.6rem] tracking-[0.3em] uppercase">Est. 2026</span>
          <span className="text-white/25 text-[0.6rem] tracking-[0.3em] uppercase">Aurevon Studio</span>
        </div>

        {/* ── Bottom-right — flower badge ── */}
        <div
          className="absolute right-6 md:right-10 bottom-6 md:bottom-8 z-10 hidden sm:block badge-pulse"
          style={heroEnter(1100)}
        >
          <Flower2 className="w-5 h-5 text-white/30" strokeWidth={1} />
        </div>

      </section>

      {/* Inline keyframe for scroll indicator */}
      <style>{`
        @keyframes scrollDown {
          0%   { transform: translateY(-100%); }
          100% { transform: translateY(300%); }
        }
      `}</style>

    </div>
  )
}
