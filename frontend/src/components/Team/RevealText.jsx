import { useLayoutEffect, useRef, useState } from 'react'
import { gsap } from '../../lib/gsap.js'
import './RevealText.css'

function Words({ text }) {
  return text.split('\n').map((line, row) => (
    <span key={row} className="reveal-text__line">
      {line.split(' ').map((word, i) => (
        <span key={i}>
          {i > 0 && ' '}
          <span className="reveal-text__mask">
            <span className="reveal-text__word">{word}</span>
          </span>
        </span>
      ))}
    </span>
  ))
}

// Word-by-word swap: the old phrase slides up and out while the new one slides up into place.
function RevealText({ ref, text }) {
  const fromRef = useRef(null)
  const toRef = useRef(null)
  const [pair, setPair] = useState({ from: text, to: text })

  if (pair.to !== text) setPair({ from: pair.to, to: text })

  useLayoutEffect(() => {
    const outgoing = fromRef.current
    const leaving = outgoing.querySelectorAll('.reveal-text__word')
    const arriving = toRef.current.querySelectorAll('.reveal-text__word')

    if (pair.from === pair.to || window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      outgoing.style.visibility = 'hidden'
      return
    }

    outgoing.style.visibility = ''
    const tl = gsap.timeline({ onComplete: () => (outgoing.style.visibility = 'hidden') })
    tl.fromTo(leaving, { yPercent: 0 }, { yPercent: -115, duration: 0.5, ease: 'power3.in', stagger: 0.035 }).fromTo(
      arriving,
      { yPercent: 115 },
      { yPercent: 0, duration: 0.8, ease: 'power3.out', stagger: 0.05 },
      0.22,
    )
    return () => tl.kill()
  }, [pair])

  return (
    <p ref={ref} className="reveal-text">
      <span key={`from-${pair.from}`} ref={fromRef} className="reveal-text__layer" aria-hidden="true">
        <Words text={pair.from} />
      </span>
      <span key={`to-${pair.to}`} ref={toRef} className="reveal-text__layer">
        <Words text={pair.to} />
      </span>
    </p>
  )
}

export default RevealText
