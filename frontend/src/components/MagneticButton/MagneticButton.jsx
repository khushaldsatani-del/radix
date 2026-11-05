import { useRef } from 'react'
import { gsap, useGSAP } from '../../lib/gsap.js'
import './MagneticButton.css'

function MagneticButton({ children, href = '#', size = 'md', onClick }) {
  const ref = useRef(null)

  useGSAP(
    (context, contextSafe) => {
      const el = ref.current
      const xTo = gsap.quickTo(el, 'x', { duration: 0.4, ease: 'power3.out' })
      const yTo = gsap.quickTo(el, 'y', { duration: 0.4, ease: 'power3.out' })

      const onMove = contextSafe((e) => {
        const { left, top, width, height } = el.getBoundingClientRect()
        xTo((e.clientX - (left + width / 2)) * 0.3)
        yTo((e.clientY - (top + height / 2)) * 0.3)
      })
      const onLeave = contextSafe(() => {
        xTo(0)
        yTo(0)
      })

      el.addEventListener('pointermove', onMove)
      el.addEventListener('pointerleave', onLeave)
      return () => {
        el.removeEventListener('pointermove', onMove)
        el.removeEventListener('pointerleave', onLeave)
      }
    },
    { scope: ref },
  )

  return (
    <a ref={ref} href={href} className={`magnetic-btn magnetic-btn--${size}`} onClick={onClick}>
      <span>{children}</span>
    </a>
  )
}

export default MagneticButton
