import { useRef } from 'react'
import { gsap, useGSAP } from '../lib/gsap.js'
import DisclaimerBar from '../components/Legal/DisclaimerBar.jsx'
import Navbar from '../components/Navbar/Navbar.jsx'
import Hero from '../components/Hero/Hero.jsx'
import About from '../components/About/About.jsx'
import TeamReveal from '../components/Team/TeamReveal.jsx'
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

  return (
    <>
      <span id="top" aria-hidden="true" />
      <main className="page" ref={pageRef} data-liquid="hero">
        <DisclaimerBar />
        <Navbar />
        <Hero />
      </main>
      <About />
      <TeamReveal />
      <Footer home />
    </>
  )
}

export default Home
