import { useRef } from 'react'
import { gsap, useGSAP } from '../../lib/gsap.js'
import { SPRINT_DAYS, SPRINT_LEGEND } from './aboutData.js'

// Seven cells fill one by one like a sprint playing out, then reset and repeat while visible.
function SprintWeek() {
  const ref = useRef(null)

  useGSAP(
    () => {
      const days = gsap.utils.toArray('.sprint__day')
      if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
        days.forEach((day) => day.classList.add('is-on'))
        return
      }

      const tl = gsap.timeline({ repeat: -1, repeatDelay: 0.6, paused: true })
      days.forEach((day, i) => {
        tl.call(() => day.classList.add('is-on'), null, i * 0.35)
      })
      tl.call(() => days.forEach((day) => day.classList.remove('is-on')), null, days.length * 0.35 + 1.4)

      gsap.timeline({
        scrollTrigger: {
          trigger: ref.current,
          start: 'top 90%',
          end: 'bottom 10%',
          onToggle: (self) => (self.isActive ? tl.play() : tl.pause()),
        },
      })
    },
    { scope: ref },
  )

  return (
    <div className="sprint" ref={ref}>
      <div className="sprint__days" aria-hidden="true">
        {SPRINT_DAYS.map((kind, i) => (
          <span key={i} className={`sprint__day sprint__day--${kind}`} />
        ))}
      </div>
      <ul className="sprint__legend">
        {SPRINT_LEGEND.map((item) => (
          <li key={item.key}>
            <span className={`sprint__swatch sprint__day--${item.key}`} aria-hidden="true" />
            {item.label}
          </li>
        ))}
      </ul>
    </div>
  )
}

export default SprintWeek
