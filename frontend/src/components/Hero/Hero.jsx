import { useRef } from 'react'
import { gsap, useGSAP } from '../../lib/gsap.js'
import LiquidGrid from './LiquidGrid.jsx'
import './Hero.css'

function CubesIcon() {
  return (
    <svg className="hero__cubes" viewBox="0 0 48 48" aria-hidden="true">
      <rect x="5" y="17" width="16" height="16" rx="4" fill="var(--lavender)" transform="rotate(-18 13 25)" />
      <rect x="18" y="8" width="16" height="16" rx="4" fill="#8784e8" transform="rotate(12 26 16)" />
      <rect x="24" y="24" width="16" height="16" rx="4" fill="var(--lavender)" transform="rotate(-8 32 32)" />
      <rect x="15" y="22" width="12" height="12" rx="3" fill="#6f6bd9" transform="rotate(25 21 28)" />
    </svg>
  )
}

function Hero() {
  const heroRef = useRef(null)

  useGSAP(
    () => {
      if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return

      gsap
        .timeline({ defaults: { ease: 'power3.out' } })
        .from('.hero__line > span', { yPercent: 110, duration: 0.9, stagger: 0.1 })
        .from('.hero__hl', { backgroundSize: '0% 100%', duration: 0.8, stagger: 0.15 }, '-=0.4')
        .from('.hero__text', { y: 16, opacity: 0, duration: 0.7 }, '-=0.5')

      gsap.to('.hero__cubes', { y: -4, rotate: 8, duration: 2, ease: 'sine.inOut', yoyo: true, repeat: -1 })
    },
    { scope: heroRef },
  )

  return (
    <section className="hero" ref={heroRef}>
      <div className="hero__content">
        <h1 className="hero__title">
          <span className="hero__line">
            <span>
              Discover the joy of <CubesIcon />
            </span>
          </span>
          <span className="hero__line">
            <span>
              <span className="hero__hl">effortless</span> digital products
            </span>
          </span>
          <span className="hero__line">
            <span>
              that grow <span className="hero__hl">with Radix.</span>
            </span>
          </span>
        </h1>
        <p className="hero__text">
          Radix builds rooted, scalable software for teams that want to move fast without
          shaking their foundations, from the first idea all the way to production.
        </p>
      </div>

      <div className="hero__visual">
        <LiquidGrid />
      </div>
    </section>
  )
}

export default Hero
