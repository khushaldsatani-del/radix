import { useRef } from 'react'
import { gsap, useGSAP } from '../../lib/gsap.js'
import { TEAM } from './teamData.js'
import './Team.css'

// Two portraits per row; pair them up so each row can be offset differently.
const ROWS = TEAM.reduce((rows, member, i) => {
  if (i % 2 === 0) rows.push([])
  rows[rows.length - 1].push(member)
  return rows
}, [])

function Team() {
  const ref = useRef(null)

  useGSAP(
    () => {
      const section = ref.current
      if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return

      // The title holds in place while the portraits scroll over it.
      gsap
        .timeline({
          scrollTrigger: {
            trigger: section,
            start: 'top top',
            end: 'bottom bottom',
            pin: '.team__stage',
            pinSpacing: false,
            scrub: true,
          },
        })
        .fromTo('.team__title', { scale: 1 }, { scale: 0.9, ease: 'none', duration: 1 })
        // The note bows out early so captions never scroll over it.
        .to('.team__note', { opacity: 0, ease: 'none', duration: 0.08 }, 0.04)

      gsap.from('.team__title-line > span', {
        yPercent: 110,
        duration: 1.1,
        stagger: 0.1,
        ease: 'power4.out',
        scrollTrigger: { trigger: section, start: 'top 70%' },
      })

      gsap.utils.toArray('.member').forEach((member) => {
        const speed = Number(member.dataset.speed)
        const travel = () => window.innerHeight * 0.35 * (speed - 1)

        // Faster portraits travel further than the page; slower ones lag behind it.
        gsap.fromTo(
          member,
          { y: () => travel() },
          {
            y: () => -travel(),
            ease: 'none',
            scrollTrigger: { trigger: member, start: 'top bottom', end: 'bottom top', scrub: true, invalidateOnRefresh: true },
          },
        )

        const frame = member.querySelector('.member__frame')
        const photo = member.querySelector('.member__photo')
        gsap
          .timeline({ scrollTrigger: { trigger: member, start: 'top 92%' } })
          .fromTo(frame, { clipPath: 'inset(100% 0% 0% 0%)' }, { clipPath: 'inset(0% 0% 0% 0%)', duration: 1.2, ease: 'power4.out' })
          .from(photo, { scale: 1.3, duration: 1.6, ease: 'power3.out' }, 0)
          .from(member.querySelectorAll('.member__meta > *'), { y: 16, opacity: 0, duration: 0.7, stagger: 0.08, ease: 'power3.out' }, 0.4)
      })
    },
    { scope: ref },
  )

  return (
    <section className="team" id="team" data-liquid="team" ref={ref}>
      <div className="team__stage">
        <h2 className="team__title">
          <span className="team__title-line">
            <span>Our</span>
          </span>
          <span className="team__title-line">
            <span>team</span>
          </span>
        </h2>
        <p className="team__note">
          Eight people, different backgrounds, one root. Meet the minds who plan, design, build and test
          everything Radix ships.
        </p>
      </div>

      <div className="team__grid">
        {ROWS.map((row, r) => (
          <div key={r} className={`team__row team__row--${r % 4}`}>
            {row.map((member) => (
              <figure key={member.name} className="member" data-speed={member.speed}>
                <div className="member__frame">
                  <img className="member__photo" src={member.photo} alt={`${member.name}, ${member.role}`} decoding="async" />
                </div>
                <figcaption className="member__meta">
                  <span className="member__name">{member.name}</span>
                  <span className="member__role">{member.role}</span>
                </figcaption>
              </figure>
            ))}
          </div>
        ))}
      </div>
    </section>
  )
}

export default Team
