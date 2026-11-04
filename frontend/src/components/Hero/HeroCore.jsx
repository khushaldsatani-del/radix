import { useRef } from 'react'
import { gsap, ScrollTrigger, useGSAP } from '../../lib/gsap.js'

const SIZE = 500
const C = SIZE / 2

// Eight circuit roots radiating from the core, each with one 45° bend like the logo's roots.
const ROOTS = Array.from({ length: 8 }, (_, k) => {
  const a = (k * Math.PI) / 4 - Math.PI / 2
  const bend = a + ((k % 2 ? 1 : -1) * Math.PI) / 4
  const pt = (r, angle = a, from = [C, C]) => [from[0] + Math.cos(angle) * r, from[1] + Math.sin(angle) * r]
  const p0 = pt(78)
  const p1 = pt(138)
  const p2 = pt(46, bend, p1)
  const p3 = pt(52, a, p2)
  const f = ([x, y]) => `${x.toFixed(1)} ${y.toFixed(1)}`
  return { d: `M${f(p0)} L${f(p1)} L${f(p2)} L${f(p3)}`, end: p3 }
})

// Liquid blobs: one wobbling core plus orbiters. Opposite-turning lime and lavender orbiters
// keep pulling apart and merging through the goo filter.
const LIME_BLOBS = [
  { r: 56, orbit: 0, speed: 0, phase: 0 },
  { r: 28, orbit: 74, speed: 0.55, phase: 0 },
  { r: 22, orbit: 88, speed: 0.4, phase: 2.2 },
  { r: 18, orbit: 66, speed: 0.7, phase: 4.1 },
]
const LAVENDER_BLOBS = [
  { r: 26, orbit: 96, speed: -0.45, phase: 1 },
  { r: 20, orbit: 82, speed: -0.6, phase: 3.3 },
  { r: 16, orbit: 104, speed: -0.35, phase: 5.2 },
]

function HeroCore() {
  const ref = useRef(null)

  useGSAP(
    (context, contextSafe) => {
      const svg = ref.current
      const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches
      const state = { burst: 0, near: 0, px: 0, py: 0, active: false }

      const blobs = [
        ...gsap.utils.toArray('.core__lime circle').map((el, i) => ({ el, ...LIME_BLOBS[i] })),
        ...gsap.utils.toArray('.core__lavender circle').map((el, i) => ({ el, ...LAVENDER_BLOBS[i] })),
      ].map((b, i) => ({ ...b, ox: 0, oy: 0, follow: 0.04 + (i % 4) * 0.025, grow: 1 }))

      const place = (time) => {
        for (const b of blobs) {
          const wobble = Math.sin(time * 1.3 + b.phase) * 6
          const orbit = b.orbit * (1 + state.burst * 0.9) + (b.orbit ? wobble : 0)
          const angle = time * b.speed + b.phase
          const x = C + Math.cos(angle) * orbit + b.ox
          const y = C + Math.sin(angle * 1.1) * orbit + b.oy
          const r = b.orbit ? b.r : b.r * (1 + Math.sin(time * 1.6) * 0.05) * (1 + state.near * 0.12)
          b.el.setAttribute('cx', x.toFixed(1))
          b.el.setAttribute('cy', y.toFixed(1))
          b.el.setAttribute('r', (r * b.intro).toFixed(1))
        }
      }

      blobs.forEach((b) => (b.intro = reduce ? 1 : 0))

      if (reduce) {
        place(0)
        return
      }

      // Signals: small drops travel out along the roots, like data flowing from the source.
      const signals = gsap.utils.toArray('.core__signal').map((dot, i) =>
        gsap
          .timeline({ paused: true, repeat: -1, repeatDelay: 1.2 + (i % 3) * 0.4, delay: i * 0.3 })
          .set(dot, { opacity: 1 })
          .to(dot, {
            motionPath: { path: `.core__root:nth-of-type(${i + 1})`, align: `.core__root:nth-of-type(${i + 1})`, alignOrigin: [0.5, 0.5] },
            duration: 1.8,
            ease: 'power1.inOut',
          })
          .to(dot, { opacity: 0, duration: 0.3 }, '-=0.3'),
      )

      // Intro: roots grow out of the core, nodes pop, the liquid swells into place.
      gsap
        .timeline({ delay: 0.3 })
        .from('.core__ring', { opacity: 0, scale: 0.8, svgOrigin: `${C} ${C}`, duration: 1.2, stagger: 0.15, ease: 'power3.out' })
        .to(blobs, { intro: 1, duration: 1.2, stagger: 0.06, ease: 'elastic.out(1, 0.55)' }, 0.1)
        .from('.core__root', { drawSVG: 0, duration: 1.1, stagger: 0.07, ease: 'power2.inOut' }, 0.4)
        .from('.core__node', { scale: 0, transformOrigin: '50% 50%', duration: 0.5, stagger: 0.07, ease: 'back.out(3)' }, 1.1)
        .add(() => signals.forEach((s) => s.play()), 1.4)

      gsap.to('.core__node', { scale: 1.25, transformOrigin: '50% 50%', duration: 1.2, stagger: { each: 0.15, repeat: -1, yoyo: true }, ease: 'sine.inOut', delay: 2 })
      gsap.to('.core__ring--inner', { rotation: 360, svgOrigin: `${C} ${C}`, duration: 40, ease: 'none', repeat: -1 })
      gsap.to('.core__ring--outer', { rotation: -360, svgOrigin: `${C} ${C}`, duration: 70, ease: 'none', repeat: -1 })

      // Scroll: the whole piece eases back as the hero leaves.
      gsap.to(svg, {
        scale: 0.9,
        opacity: 0.5,
        ease: 'none',
        scrollTrigger: { trigger: svg, start: 'center center', end: 'bottom top', scrub: true },
      })

      // Pointer: the liquid leans towards the cursor (or finger), each blob with its own lag.
      const toSvg = (clientX, clientY) => {
        const box = svg.getBoundingClientRect()
        return [((clientX - box.left) / box.width) * SIZE, ((clientY - box.top) / box.height) * SIZE]
      }
      const onMove = (e) => {
        const p = e.touches ? e.touches[0] : e
        if (!p) return
        ;[state.px, state.py] = toSvg(p.clientX, p.clientY)
        state.active = true
      }
      const onLeave = () => {
        state.active = false
      }
      const onDown = contextSafe((e) => {
        onMove(e)
        gsap.fromTo(state, { burst: 0 }, { burst: 1, duration: 0.35, ease: 'power2.out', yoyo: true, repeat: 1, repeatDelay: 0.05, overwrite: true })
      })

      let visible = true
      const tick = (time) => {
        if (!visible) return
        const dx = state.active ? state.px - C : 0
        const dy = state.active ? state.py - C : 0
        const dist = Math.hypot(dx, dy)
        const pull = Math.min(dist, 220) / (dist || 1)
        state.near += ((state.active && dist < 140 ? 1 : 0) - state.near) * 0.08
        for (const b of blobs) {
          b.ox += (dx * pull * 0.2 - b.ox) * b.follow
          b.oy += (dy * pull * 0.2 - b.oy) * b.follow
        }
        place(time)
      }
      gsap.ticker.add(tick)

      const area = svg.closest('.hero') ?? svg
      area.addEventListener('pointermove', onMove)
      area.addEventListener('pointerleave', onLeave)
      area.addEventListener('touchmove', onMove, { passive: true })
      area.addEventListener('touchend', onLeave, { passive: true })
      svg.addEventListener('pointerdown', onDown)
      const watcher = ScrollTrigger.create({
        trigger: svg,
        start: 'top bottom',
        end: 'bottom top',
        onToggle: (self) => (visible = self.isActive),
      })

      return () => {
        gsap.ticker.remove(tick)
        area.removeEventListener('pointermove', onMove)
        area.removeEventListener('pointerleave', onLeave)
        area.removeEventListener('touchmove', onMove)
        area.removeEventListener('touchend', onLeave)
        svg.removeEventListener('pointerdown', onDown)
        watcher.kill()
      }
    },
    { scope: ref },
  )

  return (
    <svg ref={ref} className="core" viewBox={`0 0 ${SIZE} ${SIZE}`} role="img" aria-label="Animated liquid core with circuit roots">
      <defs>
        <filter id="core-goo" x="-20%" y="-20%" width="140%" height="140%" colorInterpolationFilters="sRGB">
          <feGaussianBlur in="SourceGraphic" stdDeviation="9" result="blur" />
          <feColorMatrix in="blur" values="1 0 0 0 0  0 1 0 0 0  0 0 1 0 0  0 0 0 22 -10" />
        </filter>
        <radialGradient id="core-glow">
          <stop offset="0" stopColor="#a9a6f6" stopOpacity="0.35" />
          <stop offset="0.6" stopColor="#c8f03c" stopOpacity="0.08" />
          <stop offset="1" stopColor="#ffffff" stopOpacity="0" />
        </radialGradient>
      </defs>

      <circle cx={C} cy={C} r={C} fill="url(#core-glow)" />
      <circle className="core__ring core__ring--outer" cx={C} cy={C} r="226" />
      <circle className="core__ring core__ring--inner" cx={C} cy={C} r="118" />

      <g className="core__roots">
        {ROOTS.map((root) => (
          <path key={root.d} className="core__root" d={root.d} />
        ))}
      </g>
      {ROOTS.map((root, i) => (
        <circle
          key={i}
          className={`core__node${i % 3 === 0 ? ' core__node--lime' : i % 3 === 1 ? ' core__node--lavender' : ''}`}
          cx={root.end[0]}
          cy={root.end[1]}
          r="6"
        />
      ))}

      <g className="core__lavender" filter="url(#core-goo)">
        {LAVENDER_BLOBS.map((_, i) => (
          <circle key={i} cx={C} cy={C} r="0" />
        ))}
      </g>
      <g className="core__lime" filter="url(#core-goo)">
        {LIME_BLOBS.map((_, i) => (
          <circle key={i} cx={C} cy={C} r="0" />
        ))}
      </g>

      {ROOTS.map((_, i) => (
        <circle key={i} className={`core__signal core__signal--${i % 2 ? 'lavender' : 'lime'}`} r="4.5" opacity="0" />
      ))}
    </svg>
  )
}

export default HeroCore
