import { useEffect, useLayoutEffect, useRef, useState } from 'react'
import { ScrollTrigger } from '../../lib/gsap.js'
import RevealText from './RevealText.jsx'
import { TEAM } from './teamData.js'
import './TeamReveal.css'

// The headline lines. "\n" is the line break.
const phrases = [
  'Meet The Minds\nBehind Radix.',
  'Eight People.\nOne Root.',
  'Different Backgrounds,\nOne Shared Vision.',
]

// The photo at each index changes the headline to the next phrase once it passes.
// One more phrase than swap points.
const swapAt = [2, 5]

// Staggered placements. Percentages are of the page width.
// lead = space before the photo, width = its size, drop = how far it hangs below the row's top.
const rowLayouts = [
  [
    { lead: '10%', width: '21%', aspect: '379 / 444', phone: { lead: '4%', width: '40%' } },
    { lead: '30%', width: '33.5%', aspect: '543 / 636', phone: { lead: '8%', width: '44%', drop: '34%' } },
  ],
  [
    { lead: '15%', width: '21%', aspect: '379 / 444', phone: { lead: '10%', width: '40%' } },
    { lead: '20.2%', width: '33.5%', drop: '18.4%', aspect: '543 / 636', phone: { lead: '2%', width: '44%', drop: '40%' } },
  ],
]

function toRows(members) {
  const rows = []
  for (let i = 0; i < members.length; i += 2) {
    const layout = rowLayouts[(i / 2) % rowLayouts.length]
    rows.push(members.slice(i, i + 2).map((m, j) => ({ ...m, ...layout[j], index: i + j })))
  }
  return rows
}

// A big headline sticks mid-screen while the team scrolls up beneath it in staggered rows.
// The headline inverts whatever passes behind it, and swaps phrase as marked photos pass.
function TeamReveal() {
  const sectionRef = useRef(null)
  const textRef = useRef(null)
  const [phrase, setPhrase] = useState(0)

  // Phones fetch and decode below-the-fold images late, which flashes empty boxes mid-scroll.
  // Decode every portrait up front so they're ready before they scroll into view.
  useEffect(() => {
    TEAM.forEach(({ photo }) => {
      const img = new Image()
      img.src = photo
      img.decode?.().catch(() => {})
    })
  }, [])

  // Change the phrase when a marked photo's bottom edge reaches the bottom of the headline,
  // and change it back when scrolling up.
  useLayoutEffect(() => {
    const text = textRef.current
    const figures = sectionRef.current.querySelectorAll('[data-swap]')
    const triggers = [...figures].map((figure) => {
      const step = Number(figure.dataset.swap)
      return ScrollTrigger.create({
        trigger: figure,
        start: () => `bottom ${window.innerHeight / 2 + text.offsetHeight / 2}px`,
        end: '+=1',
        onEnter: () => setPhrase(step),
        onLeaveBack: () => setPhrase(step - 1),
      })
    })
    return () => triggers.forEach((t) => t.kill())
  }, [])

  return (
    <section ref={sectionRef} className="team-reveal" id="team" data-liquid="team">
      <RevealText ref={textRef} text={phrases[phrase]} />

      {toRows(TEAM).map((row, r) => (
        <div key={r} className={`team-reveal__row${r === 0 ? ' is-first' : ''}`}>
          {row.map((m) => {
            const swapStep = swapAt.indexOf(m.index) + 1 // 0 = not a swap point
            return (
              <figure
                key={m.name}
                className="team-reveal__member"
                data-swap={swapStep || undefined}
                style={{
                  '--lead': m.lead,
                  '--width': m.width,
                  '--drop': m.drop,
                  '--aspect': m.aspect,
                  '--lead-phone': m.phone?.lead,
                  '--width-phone': m.phone?.width,
                  '--drop-phone': m.phone?.drop,
                }}
              >
                <div className="team-reveal__photo">
                  <img src={m.photo} alt={`${m.name}, ${m.role}`} loading="eager" />
                </div>
                <figcaption>
                  <strong>{m.name}</strong>
                  <span>{m.role}</span>
                </figcaption>
              </figure>
            )
          })}
        </div>
      ))}
    </section>
  )
}

export default TeamReveal
