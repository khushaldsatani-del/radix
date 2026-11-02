import { useRef } from 'react'
import { gsap, useGSAP } from '../../lib/gsap.js'

// Both paths share the same commands so GSAP can interpolate between them.
const TANGLED =
  'M20 50 C50 6 70 94 100 50 S150 4 180 50 S230 96 260 50 S310 6 340 50 S390 92 420 50 S470 10 500 50'
const STRAIGHT =
  'M20 50 C50 50 70 50 100 50 S150 50 180 50 S230 50 260 50 S310 50 340 50 S390 50 420 50 S470 50 500 50'

// A tangled problem that straightens into a clean solution as it scrolls into view.
function MissionLine() {
  const ref = useRef(null)

  useGSAP(
    () => {
      if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return

      gsap
        .timeline({ scrollTrigger: { trigger: ref.current, start: 'top 90%', end: 'top 40%', scrub: 1 } })
        .fromTo('.mission-line__path', { attr: { d: TANGLED } }, { attr: { d: STRAIGHT }, ease: 'power2.inOut' })
        .fromTo(
          '.mission-line__end',
          { scale: 0.4, fill: '#ffffff', svgOrigin: '500 50' },
          { scale: 1, fill: '#c8f03c', svgOrigin: '500 50' },
          0.5,
        )
    },
    { scope: ref },
  )

  return (
    <div className="mission-line" ref={ref}>
      <svg viewBox="0 0 520 100" aria-hidden="true">
        <path className="mission-line__path" d={STRAIGHT} />
        <circle className="mission-line__start" cx="20" cy="50" r="7" />
        <circle className="mission-line__end" cx="500" cy="50" r="10" />
      </svg>
      <div className="mission-line__labels">
        <span>Problem</span>
        <span>Solution</span>
      </div>
    </div>
  )
}

export default MissionLine
