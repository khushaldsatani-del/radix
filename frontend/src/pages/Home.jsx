import { useRef } from 'react'
import { gsap, useGSAP } from '../lib/gsap.js'
import Navbar from '../components/Navbar/Navbar.jsx'
import Hero from '../components/Hero/Hero.jsx'
import FeatureStrip from '../components/FeatureStrip/FeatureStrip.jsx'

function Home() {
  const pageRef = useRef(null)

  useGSAP(
    () => {
      if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return
      gsap.from('.navbar > *, [data-reveal]', {
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
    <main className="page" ref={pageRef} data-pin-scope>
      <div className="page__card">
        <Navbar />
        <Hero />
        <FeatureStrip />
      </div>
    </main>
  )
}

export default Home
