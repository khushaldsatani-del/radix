import { useRef } from 'react'
import gsap from 'gsap'
import { useGSAP } from '@gsap/react'

gsap.registerPlugin(useGSAP)

function AnimatedText({ text }) {
  const heading = useRef(null)

  useGSAP(() => {
    gsap.from(heading.current, {
      y: 30,
      opacity: 0,
      duration: 1,
      ease: 'power2.out',
    })
  })

  return (
    <h1 ref={heading} className="animated-text">
      {text}
    </h1>
  )
}

export default AnimatedText
