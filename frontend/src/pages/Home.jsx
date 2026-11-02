import { useRef } from 'react'
import { gsap, useGSAP } from '../lib/gsap.js'
import Navbar from '../components/Navbar/Navbar.jsx'
import Hero from '../components/Hero/Hero.jsx'
import About from '../components/About/About.jsx'
import Team from '../components/Team/Team.jsx'
import Footer from '../components/Footer/Footer.jsx'

function Home() {
  const pageRef = useRef(null)

  useGSAP(
    () => {
      if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return
      // The phone menu is left out: it starts hidden and controls its own visibility.
      gsap.from('.navbar > :not(.navbar__menu), [data-reveal]', {
        y: 20,
        opacity: 0,
        duration: 0.6,
        stagger: 0.06,
        delay: 0.6,
        ease: 'power3.out',
      })
    },
    { scope: pageRef },
  )

  // About sits outside the hero wrapper, which gets pinned while scrolling.
  return (
    <>
      {/* Anchor for "#top" links; the hero itself moves while pinned, so it can't be the target. */}
      <span id="top" aria-hidden="true" />
      <main className="page" ref={pageRef} data-pin-scope data-liquid="hero">
        <Navbar />
        <Hero />
      </main>
      <About />
      <Team />
      <Footer />
    </>
  )
}

export default Home
