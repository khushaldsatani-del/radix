import { useRef } from 'react'
import { gsap, ScrollTrigger, useGSAP } from '../../lib/gsap.js'
import { R_PIXELS, R_STROKE } from './aboutData.js'

const CELL = 40
const COLS = R_PIXELS[0].length
const ROWS = R_PIXELS.length
const LIME = '#c8f03c'
const LAVENDER = '#a9a6f6'
const DOTS = R_PIXELS.flatMap((row, y) => [...row].map((_, x) => ({ x: x * CELL, y: y * CELL })))

// A pixel "R" drawn with the hero's gooey cells. It writes itself on scroll like a pen
// (growing up the stem like a root), then a pulse runs along the same path every few seconds.
// Cells also swell like liquid around the pointer.
function NameCells() {
  const ref = useRef(null)

  useGSAP(
    (context, contextSafe) => {
      // Rendered in stroke order, so DOM order is drawing order.
      const rects = gsap.utils.toArray('rect')
      gsap.set(rects, { transformOrigin: '50% 50%' })
      if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return

      const svg = ref.current
      const pulse = gsap.timeline({ repeat: -1, repeatDelay: 2.4, paused: true })
      // Colours swap instantly: fading lime into lavender would pass through a muddy grey.
      pulse.to(rects, {
        keyframes: [
          { attr: { fill: LAVENDER }, duration: 0 },
          { y: -6, duration: 0.18, ease: 'power2.out' },
          { y: 0, duration: 0.3, ease: 'power2.in' },
          { attr: { fill: LIME }, duration: 0 },
        ],
        stagger: 0.07,
      })

      let revealed = false
      let inView = false
      const syncPulse = () => (revealed && inView ? pulse.play() : pulse.pause())

      gsap.from(rects, {
        scale: 0,
        duration: 0.7,
        ease: 'back.out(2.6)',
        stagger: 0.06,
        scrollTrigger: { trigger: svg, start: 'top 85%' },
        onComplete: () => {
          revealed = true
          syncPulse()
        },
      })

      ScrollTrigger.create({
        trigger: svg,
        start: 'top bottom',
        end: 'bottom top',
        onToggle: (self) => {
          inView = self.isActive
          syncPulse()
        },
      })

      const card = svg.closest('[data-card]') ?? svg
      const cells = rects.map((rect) => ({
        cx: +rect.getAttribute('x') + CELL / 2,
        cy: +rect.getAttribute('y') + CELL / 2,
        scale: gsap.quickTo(rect, 'scale', { duration: 0.6, ease: 'elastic.out(1, 0.5)' }),
      }))

      const onMove = contextSafe((e) => {
        if (!revealed) return
        const box = svg.getBoundingClientRect()
        const px = ((e.clientX - box.left) / box.width) * (COLS * CELL + 20) - 10
        const py = ((e.clientY - box.top) / box.height) * (ROWS * CELL + 20) - 10
        for (const cell of cells) {
          const d = Math.hypot(px - cell.cx, py - cell.cy)
          cell.scale(1 + Math.max(0, 1 - d / (CELL * 2.2)) * 0.3)
        }
      })
      const onLeave = contextSafe(() => revealed && cells.forEach((cell) => cell.scale(1)))

      card.addEventListener('pointermove', onMove)
      card.addEventListener('pointerleave', onLeave)
      return () => {
        card.removeEventListener('pointermove', onMove)
        card.removeEventListener('pointerleave', onLeave)
      }
    },
    { scope: ref },
  )

  return (
    <svg ref={ref} className="name-cells" viewBox={`-10 -10 ${COLS * CELL + 20} ${ROWS * CELL + 20}`} aria-hidden="true">
      <defs>
        <filter id="name-goo" x="-20%" y="-20%" width="140%" height="140%" colorInterpolationFilters="sRGB">
          <feGaussianBlur in="SourceGraphic" stdDeviation="5" result="blur" />
          <feColorMatrix in="blur" values="1 0 0 0 0  0 1 0 0 0  0 0 1 0 0  0 0 0 22 -10" />
        </filter>
      </defs>
      <g fill="var(--dot)">
        {DOTS.map((dot, i) => (
          <circle key={i} cx={dot.x + CELL / 2} cy={dot.y + CELL / 2} r="2" />
        ))}
      </g>
      <g filter="url(#name-goo)">
        {R_STROKE.map(([x, y]) => (
          <rect key={`${x}-${y}`} x={x * CELL} y={y * CELL} width={CELL} height={CELL} rx="4" fill={LIME} />
        ))}
      </g>
    </svg>
  )
}

export default NameCells
