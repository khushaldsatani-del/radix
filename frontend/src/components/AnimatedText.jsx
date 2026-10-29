import { useRef } from 'react'
import gsap from 'gsap'
import { useGSAP } from '@gsap/react'

gsap.registerPlugin(useGSAP)

function AnimatedText({ text }) {
  const container = useRef(null)

  useGSAP(
    () => {
      gsap
        .timeline()
        .from('.char', {
          y: 80,
          opacity: 0,
          rotateX: -90,
          stagger: 0.05,
          duration: 0.8,
          ease: 'back.out(1.7)',
        })
        .to('.char', {
          y: -10,
          stagger: { each: 0.05, repeat: -1, yoyo: true },
          duration: 0.6,
          ease: 'sine.inOut',
        })
    },
    { scope: container },
  )

  return (
    <h1 ref={container} className="animated-text" aria-label={text}>
      {text.split('').map((char, i) => (
        <span key={i} className="char" aria-hidden="true">
          {char === ' ' ? ' ' : char}
        </span>
      ))}
    </h1>
  )
}

export default AnimatedText
