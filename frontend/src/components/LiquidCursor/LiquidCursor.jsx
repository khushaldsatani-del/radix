import { useRef } from 'react'
import { gsap, useGSAP } from '../../lib/gsap.js'
import { watchLiquidSection } from '../../lib/liquidTheme.js'
import './LiquidCursor.css'

const TRAIL = [
  { follow: 0.35, size: 22 },
  { follow: 0.26, size: 19 },
  { follow: 0.2, size: 16 },
  { follow: 0.16, size: 13 },
  { follow: 0.13, size: 10 },
  { follow: 0.1, size: 7 },
]
const HOVER_SCALE = 1.8

// A gooey drop with a trailing tail that follows the pointer anywhere in the window
// and takes on the colour of the section it is over.
function LiquidCursor() {
  const svgRef = useRef(null)
  const groupRef = useRef(null)

  useGSAP((context, contextSafe) => {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return

    const svg = svgRef.current
    const blobs = [...svg.querySelectorAll('circle')].map((el, i) => ({ el, ...TRAIL[i], x: 0, y: 0, r: 0 }))
    const pointer = { x: 0, y: 0, px: 0, py: 0, speed: 0, active: false, hover: false }

    const unwatch = watchLiquidSection(
      contextSafe((name, theme) => {
        gsap.to(groupRef.current, { fill: theme.cursor, duration: 0.8, ease: 'power2.out', overwrite: true })
      }),
    )

    const tick = () => {
      const dr = gsap.ticker.deltaRatio(60)
      const speed = Math.hypot(pointer.x - pointer.px, pointer.y - pointer.py)
      pointer.speed += (speed - pointer.speed) * 0.2
      pointer.px = pointer.x
      pointer.py = pointer.y

      const stretch = 1 + Math.min(pointer.speed / 40, 0.6)
      let leader = pointer
      blobs.forEach((blob, i) => {
        const k = 1 - Math.pow(1 - blob.follow, dr)
        blob.x += (leader.x - blob.x) * k
        blob.y += (leader.y - blob.y) * k
        const grow = i === 0 && pointer.hover ? HOVER_SCALE : stretch
        const target = pointer.active ? blob.size * grow : 0
        blob.r += (target - blob.r) * (1 - Math.pow(0.85, dr))
        blob.el.setAttribute('cx', blob.x)
        blob.el.setAttribute('cy', blob.y)
        blob.el.setAttribute('r', Math.max(0, blob.r))
        leader = blob
      })
    }

    const onMove = (e) => {
      // Touch screens have no cursor to follow, and a finger would hide the drop anyway.
      if (e.pointerType === 'touch') return
      if (!pointer.active) {
        pointer.px = e.clientX
        pointer.py = e.clientY
        for (const blob of blobs) {
          blob.x = e.clientX
          blob.y = e.clientY
        }
      }
      pointer.x = e.clientX
      pointer.y = e.clientY
      pointer.active = true
      pointer.hover = !!e.target.closest?.('a, button, [data-cursor-grow]')
    }

    const onOut = (e) => {
      if (!e.relatedTarget) pointer.active = false
    }

    window.addEventListener('pointermove', onMove, { passive: true })
    document.addEventListener('pointerout', onOut)
    gsap.ticker.add(tick)

    return () => {
      gsap.ticker.remove(tick)
      unwatch()
      window.removeEventListener('pointermove', onMove)
      document.removeEventListener('pointerout', onOut)
    }
  })

  return (
    <svg ref={svgRef} className="liquid-cursor" aria-hidden="true">
      <defs>
        <filter id="cursor-goo" x="-50%" y="-50%" width="200%" height="200%" colorInterpolationFilters="sRGB">
          <feGaussianBlur in="SourceGraphic" stdDeviation="9" result="blur" />
          <feColorMatrix in="blur" values="1 0 0 0 0  0 1 0 0 0  0 0 1 0 0  0 0 0 22 -10" />
        </filter>
      </defs>
      <g ref={groupRef} filter="url(#cursor-goo)" style={{ fill: 'var(--lime)' }}>
        {TRAIL.map((_, i) => (
          <circle key={i} r="0" />
        ))}
      </g>
    </svg>
  )
}

export default LiquidCursor
