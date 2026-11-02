import { useRef } from 'react'
import { gsap, useGSAP } from '../../lib/gsap.js'
import { R_PIXELS } from './aboutData.js'

const CELL = 40
const COLS = R_PIXELS[0].length
const ROWS = R_PIXELS.length
const CELLS = R_PIXELS.flatMap((row, y) =>
  [...row].map((bit, x) => ({ x: x * CELL, y: y * CELL, letter: bit === '1' })),
)

// A pixel "R" drawn with the hero's gooey cells. Cells pop in on scroll
// and swell like liquid around the pointer.
function NameCells() {
  const ref = useRef(null)

  useGSAP(
    (context, contextSafe) => {
      const rects = gsap.utils.toArray('rect')
      gsap.set(rects, { transformOrigin: '50% 50%' })
      if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return

      gsap.from(rects, {
        scale: 0,
        duration: 1,
        ease: 'elastic.out(1, 0.6)',
        stagger: { each: 0.025, from: 'random' },
        scrollTrigger: { trigger: ref.current, start: 'top 85%' },
      })

      const svg = ref.current
      const card = svg.closest('[data-card]') ?? svg
      const cells = rects.map((rect) => ({
        cx: +rect.getAttribute('x') + CELL / 2,
        cy: +rect.getAttribute('y') + CELL / 2,
        scale: gsap.quickTo(rect, 'scale', { duration: 0.6, ease: 'elastic.out(1, 0.5)' }),
      }))

      const onMove = contextSafe((e) => {
        const box = svg.getBoundingClientRect()
        const px = ((e.clientX - box.left) / box.width) * (COLS * CELL + 20) - 10
        const py = ((e.clientY - box.top) / box.height) * (ROWS * CELL + 20) - 10
        for (const cell of cells) {
          const d = Math.hypot(px - cell.cx, py - cell.cy)
          cell.scale(1 + Math.max(0, 1 - d / (CELL * 2.2)) * 0.3)
        }
      })
      const onLeave = contextSafe(() => cells.forEach((cell) => cell.scale(1)))

      card.addEventListener('pointermove', onMove)
      card.addEventListener('pointerleave', onLeave)
      return () => {
        card.removeEventListener('pointermove', onMove)
        card.removeEventListener('pointerleave', onLeave)
      }
    },
    { scope: ref },
  )

  const letterCells = CELLS.filter((cell) => cell.letter)

  return (
    <svg ref={ref} className="name-cells" viewBox={`-10 -10 ${COLS * CELL + 20} ${ROWS * CELL + 20}`} aria-hidden="true">
      <defs>
        <filter id="name-goo" x="-20%" y="-20%" width="140%" height="140%" colorInterpolationFilters="sRGB">
          <feGaussianBlur in="SourceGraphic" stdDeviation="5" result="blur" />
          <feColorMatrix in="blur" values="1 0 0 0 0  0 1 0 0 0  0 0 1 0 0  0 0 0 22 -10" />
        </filter>
      </defs>
      <g fill="var(--dot)">
        {CELLS.map((cell, i) => (
          <circle key={i} cx={cell.x + CELL / 2} cy={cell.y + CELL / 2} r="2" />
        ))}
      </g>
      <g filter="url(#name-goo)" fill="var(--lime)">
        {letterCells.map((cell, i) => (
          <rect key={i} x={cell.x} y={cell.y} width={CELL} height={CELL} rx="4" />
        ))}
      </g>
    </svg>
  )
}

export default NameCells
