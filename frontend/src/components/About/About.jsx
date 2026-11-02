import { useRef } from 'react'
import { gsap, useGSAP } from '../../lib/gsap.js'
import HighlightShape from '../Hero/HighlightShape.jsx'
import MagneticButton from '../MagneticButton/MagneticButton.jsx'
import NameCells from './NameCells.jsx'
import ApproachSteps from './ApproachSteps.jsx'
import SprintWeek from './SprintWeek.jsx'
import MissionLine from './MissionLine.jsx'
import { VALUES } from './aboutData.js'
import './About.css'

const TILT = 4

function CardLabel({ children }) {
  return <span className="card__label">{children}</span>
}

function About() {
  const ref = useRef(null)

  useGSAP(
    (context, contextSafe) => {
      const cards = gsap.utils.toArray('[data-card]')
      const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches

      if (!reduce) {
        gsap
          .timeline({ scrollTrigger: { trigger: '.about__head', start: 'top 80%' } })
          .from('[data-reveal]', { y: 24, opacity: 0, duration: 0.8, stagger: 0.08, ease: 'power3.out' })
          .from('.about__line > span', { yPercent: 110, duration: 0.9, stagger: 0.1, ease: 'power3.out' }, 0)
          .from('.hero__hl-clip', { attr: { width: 0 }, duration: 1.1, ease: 'power2.inOut' }, 0.5)

        gsap.from(cards, {
          y: 60,
          opacity: 0,
          duration: 1,
          stagger: 0.08,
          ease: 'power3.out',
          scrollTrigger: { trigger: '.bento', start: 'top 85%' },
        })
      }

      // Each card tilts gently towards the pointer and a soft spotlight follows it.
      if (reduce || !window.matchMedia('(hover: hover)').matches) return
      const offs = cards.map((card) => {
        const rx = gsap.quickTo(card, 'rotationX', { duration: 0.6, ease: 'power3.out' })
        const ry = gsap.quickTo(card, 'rotationY', { duration: 0.6, ease: 'power3.out' })
        gsap.set(card, { transformPerspective: 1000 })

        const onMove = contextSafe((e) => {
          const box = card.getBoundingClientRect()
          const x = (e.clientX - box.left) / box.width
          const y = (e.clientY - box.top) / box.height
          card.style.setProperty('--mx', `${x * 100}%`)
          card.style.setProperty('--my', `${y * 100}%`)
          rx((0.5 - y) * TILT)
          ry((x - 0.5) * TILT)
        })
        const onLeave = contextSafe(() => {
          rx(0)
          ry(0)
        })
        card.addEventListener('pointermove', onMove)
        card.addEventListener('pointerleave', onLeave)
        return () => {
          card.removeEventListener('pointermove', onMove)
          card.removeEventListener('pointerleave', onLeave)
        }
      })
      return () => offs.forEach((off) => off())
    },
    { scope: ref },
  )

  return (
    <section className="about" id="about" data-liquid="about" ref={ref}>
      <div className="about__head">
        <div className="about__intro">
          <span className="about__label" data-reveal>
            About Radix
          </span>
          <h2 className="about__title">
            <HighlightShape />
            <span className="about__line">
              <span>Software engineered</span>
            </span>
            <span className="about__line">
              <span>
                from the <span className="hero__hl">root,</span>
              </span>
            </span>
            <span className="about__line">
              <span>
                <span className="hero__hl">not the surface.</span>
              </span>
            </span>
          </h2>
        </div>
        <div className="about__aside">
          <p className="about__lead" data-reveal>
            Radix takes its name from the Latin word for root. We are a team of eight who dig into the real
            problem first, then design and build software that stays solid as it grows.
          </p>
          <div data-reveal>
            <MagneticButton href="#contact">Work with us</MagneticButton>
          </div>
        </div>
      </div>

      <div className="bento">
        <article className="card card--name" data-card>
          <CardLabel>The name</CardLabel>
          <NameCells />
          <div className="card__foot">
            <p className="name__word">
              Radix <span>/ˈreɪ.dɪks/ · Latin, root</span>
            </p>
            <p className="card__text">A reminder to build from the foundation up, never from the surface down.</p>
          </div>
        </article>

        <article className="card card--mission" data-card>
          <CardLabel>Our mission</CardLabel>
          <h3 className="card__title">Turn complex problems into simple, well-engineered software.</h3>
          <p className="card__text">
            We work closely with the people we build for, understand what truly matters, and deliver reliable
            solutions that create lasting value long after launch.
          </p>
          <MissionLine />
        </article>

        <article className="card card--approach" data-card>
          <CardLabel>Our approach</CardLabel>
          <h3 className="card__title">From the source of a problem to a solution that lasts.</h3>
          <ApproachSteps />
        </article>

        <article className="card card--vision" data-card>
          <CardLabel>Vision</CardLabel>
          <p className="vision__text">Make everyday challenges feel effortless.</p>
          <p className="card__text">Technology that creates real, lasting value for people.</p>
        </article>

        <article className="card card--values" data-card>
          <CardLabel>What we value</CardLabel>
          <h3 className="card__title">Five principles behind every line of code.</h3>
          <ul className="chips">
            {VALUES.map((value) => (
              <li key={value} className="chip">
                {value}
              </li>
            ))}
          </ul>
        </article>

        <article className="card card--rhythm" data-card>
          <CardLabel>How we work</CardLabel>
          <h3 className="card__title">Agile, one week at a time.</h3>
          <SprintWeek />
        </article>
      </div>
    </section>
  )
}

export default About
