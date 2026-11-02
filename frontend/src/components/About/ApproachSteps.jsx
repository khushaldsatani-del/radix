import { useEffect, useRef, useState } from 'react'
import { APPROACH } from './aboutData.js'

const STEP_MS = 2800

// Steps light up in turn while visible; hovering a step takes over.
function ApproachSteps() {
  const ref = useRef(null)
  const [active, setActive] = useState(0)
  const [inView, setInView] = useState(false)
  const [hovered, setHovered] = useState(false)

  useEffect(() => {
    const observer = new IntersectionObserver(([entry]) => setInView(entry.isIntersecting), { threshold: 0.4 })
    observer.observe(ref.current)
    return () => observer.disconnect()
  }, [])

  const playing = inView && !hovered && !window.matchMedia('(prefers-reduced-motion: reduce)').matches

  useEffect(() => {
    if (!playing) return
    const timer = setTimeout(() => setActive((i) => (i + 1) % APPROACH.length), STEP_MS)
    return () => clearTimeout(timer)
  }, [playing, active])

  return (
    <ol
      ref={ref}
      className={`approach${playing ? ' is-playing' : ''}`}
      style={{ '--step-ms': `${STEP_MS}ms` }}
      onPointerLeave={() => setHovered(false)}
    >
      {APPROACH.map((step, i) => (
        <li
          key={step.title}
          className={`approach__step${i === active ? ' is-active' : ''}`}
          onPointerEnter={() => {
            setHovered(true)
            setActive(i)
          }}
        >
          <span className="approach__bar" aria-hidden="true">
            <span key={active} />
          </span>
          <span className="approach__icon" aria-hidden="true">
            <svg viewBox="0 0 16 16">
              <path d={step.pixels} fillRule="evenodd" />
            </svg>
          </span>
          <span className="approach__index">0{i + 1}</span>
          <h4 className="approach__title">{step.title}</h4>
          <p className="approach__text">{step.text}</p>
        </li>
      ))}
    </ol>
  )
}

export default ApproachSteps
