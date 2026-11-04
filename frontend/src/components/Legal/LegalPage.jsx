import { useRef } from 'react'
import { gsap, useGSAP } from '../../lib/gsap.js'
import Link from '../Link.jsx'
import logo from '../../assets/logo.png'
import DisclaimerBar from './DisclaimerBar.jsx'
import Footer from '../Footer/Footer.jsx'
import './Legal.css'

function LegalPage({ page }) {
  const ref = useRef(null)

  useGSAP(
    () => {
      if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return
      gsap.from('.legal__head > *, .legal__section', {
        y: 24,
        opacity: 0,
        duration: 0.8,
        stagger: 0.06,
        ease: 'power3.out',
      })
    },
    { scope: ref, dependencies: [page], revertOnUpdate: true },
  )

  return (
    <>
      <span id="top" aria-hidden="true" />
      <div className="legal" ref={ref}>
        <DisclaimerBar />
        <header className="legal__bar">
          <Link className="navbar__brand" to="/">
            <img src={logo} alt="" width="32" height="32" />
            <span>RADIX</span>
          </Link>
          <Link className="legal__back" to="/">
            <span aria-hidden="true">←</span> Back to home
          </Link>
        </header>

        <main className="legal__main">
          <div className="legal__head">
            <span className="legal__label">{page.label}</span>
            <h1 className="legal__title">{page.title}</h1>
            {page.intro && <p className="legal__intro">{page.intro}</p>}
          </div>
          {page.sections.map((section) => (
            <section key={section.heading} className="legal__section">
              <h2>{section.heading}</h2>
              {section.body}
            </section>
          ))}
        </main>
      </div>
      <Footer />
    </>
  )
}

export default LegalPage
