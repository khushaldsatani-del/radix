import { useRef } from 'react'
import { gsap, useGSAP } from '../../lib/gsap.js'
import { U, COLS, ROWS, MAX_DELAY, grayCells, limeCells, lavenderCells } from './liquidGridData.js'

const WIDTH = COLS * U
const HEIGHT = ROWS * U
const RADIUS = U * 5
const LAYERS = { gray: grayCells, lime: limeCells, lavender: lavenderCells }
const PULL = { gray: 0.2, lime: 0.45, lavender: 0.45 }
const STIFFNESS = 0.06
const DAMPING = 0.84

function CellLayer({ layer, color, children }) {
  return (
    <g filter="url(#goo)" fill={color} data-group={layer}>
      {LAYERS[layer].map((cell, i) => (
        <rect
          key={i}
          data-layer={layer}
          data-index={i}
          width={U}
          height={U}
          rx={U * 0.08}
          transform={`translate(${cell.ax} ${cell.ay})`}
        />
      ))}
      {children}
    </g>
  )
}

function LiquidGrid() {
  const wrapRef = useRef(null)
  const svgRef = useRef(null)
  const linesRef = useRef(null)

  useGSAP(
    (context, contextSafe) => {
      if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return

      const svg = svgRef.current
      const wrap = wrapRef.current
      // Looked up from the DOM because a parent's ref isn't attached yet when this effect runs.
      const scope = wrap.closest('[data-pin-scope]') || wrap
      const ease = gsap.parseEase('power2.inOut')
      const clamp = gsap.utils.clamp(0, 1)

      const cells = [...svg.querySelectorAll('[data-layer]')].map((el) => {
        const { layer, index } = el.dataset
        return {
          el,
          ...LAYERS[layer][+index],
          pull: PULL[layer],
          hx: 0,
          hy: 0,
          ox: 0,
          oy: 0,
          vx: 0,
          vy: 0,
          s: 0,
          vs: 0,
          intro: 0,
          phase: Math.random() * Math.PI * 2,
        }
      })

      const mouse = { x: WIDTH / 2, y: HEIGHT / 2, px: WIDTH / 2, py: HEIGHT / 2, vx: 0, vy: 0, active: false }
      const morph = { p: 0 }
      let visible = true

      // One physics step at 60fps; the ticker runs extra steps when frames are slow.
      const simulate = () => {
        mouse.vx += (mouse.x - mouse.px - mouse.vx) * 0.25
        mouse.vy += (mouse.y - mouse.py - mouse.vy) * 0.25
        mouse.px = mouse.x
        mouse.py = mouse.y

        for (const c of cells) {
          const lp = ease(clamp((morph.p - c.delay) / (1 - MAX_DELAY)))
          c.hx = c.ax + (c.bx - c.ax) * lp + U / 2
          c.hy = c.ay + (c.by - c.ay) * lp + U / 2

          let tx = 0
          let ty = 0
          let ts = 0
          if (mouse.active) {
            const dx = mouse.x - c.hx
            const dy = mouse.y - c.hy
            const d = Math.hypot(dx, dy)
            if (d < RADIUS) {
              const t = 1 - d / RADIUS
              const f = t * t * (3 - 2 * t)
              tx = (dx * c.pull + mouse.vx * 2.5) * f
              ty = (dy * c.pull + mouse.vy * 2.5) * f
              ts = f * 0.35
            }
          }

          c.vx = (c.vx + (tx - c.ox) * STIFFNESS) * DAMPING
          c.vy = (c.vy + (ty - c.oy) * STIFFNESS) * DAMPING
          c.vs = (c.vs + (ts - c.s) * STIFFNESS) * DAMPING
          c.ox += c.vx
          c.oy += c.vy
          c.s += c.vs
        }
      }

      const draw = (time = 0) => {
        for (const c of cells) {
          const x = c.hx + c.ox + Math.sin(time * 1.2 + c.phase) * 1.5
          const y = c.hy + c.oy + Math.cos(time * 0.9 + c.phase) * 1.5
          const scale = Math.max(0, c.intro * (1 + c.s))
          c.el.setAttribute('transform', `translate(${x} ${y}) scale(${scale}) translate(${-U / 2} ${-U / 2})`)
        }
      }

      const tick = (time) => {
        if (!visible) return
        const steps = Math.min(4, Math.max(1, Math.round(gsap.ticker.deltaRatio(60))))
        for (let i = 0; i < steps; i++) simulate()
        draw(time)
      }

      simulate()
      draw()
      gsap.ticker.add(tick)

      gsap.to(cells, {
        intro: 1,
        duration: 1.1,
        ease: 'elastic.out(1, 0.55)',
        stagger: { each: 0.012, from: 'random' },
        delay: 0.3,
      })

      const toSvg = (e) => {
        const pt = svg.createSVGPoint()
        pt.x = e.clientX
        pt.y = e.clientY
        return pt.matrixTransform(svg.getScreenCTM().inverse())
      }

      const onMove = (e) => {
        const p = toSvg(e)
        if (!mouse.active) {
          mouse.px = p.x
          mouse.py = p.y
        }
        mouse.x = p.x
        mouse.y = p.y
        mouse.active = true
      }

      const onLeave = () => {
        mouse.active = false
      }

      // Click: send a ripple through nearby cells and throw off droplets.
      const onDown = contextSafe((e) => {
        const p = toSvg(e)
        for (const c of cells) {
          const dx = c.hx - p.x
          const dy = c.hy - p.y
          const d = Math.hypot(dx, dy) || 1
          if (d < U * 5) {
            const f = 1 - d / (U * 5)
            c.vx += (dx / d) * f * 14
            c.vy += (dy / d) * f * 14
            c.vs += f * 0.12
          }
        }

        const group = svg.querySelector(`[data-group="${Math.random() < 0.5 ? 'lime' : 'lavender'}"]`)
        for (let i = 0; i < 9; i++) {
          const drop = document.createElementNS('http://www.w3.org/2000/svg', 'circle')
          group.appendChild(drop)
          const angle = (i / 9) * Math.PI * 2 + Math.random() * 0.6
          const dist = gsap.utils.random(U, U * 3)
          gsap.fromTo(
            drop,
            { attr: { cx: p.x, cy: p.y, r: gsap.utils.random(12, 24) } },
            {
              attr: { cx: p.x + Math.cos(angle) * dist, cy: p.y + Math.sin(angle) * dist, r: 0 },
              duration: gsap.utils.random(0.9, 1.4),
              ease: 'expo.out',
              onComplete: () => drop.remove(),
            },
          )
        }
      })

      const onPointerUp = (e) => {
        if (e.pointerType !== 'mouse') onLeave()
      }

      // Touch: pointer events stop once a drag turns into a scroll, so follow the finger via touchmove.
      const onTouch = (e) => {
        if (e.touches[0]) onMove(e.touches[0])
      }

      scope.addEventListener('pointermove', onMove)
      scope.addEventListener('pointerleave', onLeave)
      scope.addEventListener('pointerup', onPointerUp)
      scope.addEventListener('touchstart', onTouch, { passive: true })
      scope.addEventListener('touchmove', onTouch, { passive: true })
      scope.addEventListener('touchend', onLeave, { passive: true })
      wrap.addEventListener('pointerdown', onDown)

      const observer = new IntersectionObserver(([entry]) => {
        visible = entry.isIntersecting
      })
      observer.observe(wrap)

      // Scroll: pin the hero on desktop while the colored cells flow into a new shape.
      const mm = gsap.matchMedia()
      mm.add({ desktop: '(min-width: 900px)', mobile: '(max-width: 899px)' }, (ctx) => {
        const { desktop } = ctx.conditions
        gsap
          .timeline({
            scrollTrigger: desktop
              ? { trigger: scope, start: 'top top', end: '+=120%', scrub: 1.2, pin: true }
              : { trigger: wrap, start: 'top 70%', end: 'bottom 10%', scrub: 1.2 },
          })
          .to(morph, { p: 1, ease: 'none' }, 0)
          .to(linesRef.current, { y: -U * 0.6, opacity: 0.4, ease: 'none' }, 0)
      })

      return () => {
        gsap.ticker.remove(tick)
        scope.removeEventListener('pointermove', onMove)
        scope.removeEventListener('pointerleave', onLeave)
        scope.removeEventListener('pointerup', onPointerUp)
        scope.removeEventListener('touchstart', onTouch)
        scope.removeEventListener('touchmove', onTouch)
        scope.removeEventListener('touchend', onLeave)
        wrap.removeEventListener('pointerdown', onDown)
        observer.disconnect()
        mm.revert()
      }
    },
    { scope: wrapRef },
  )

  const dots = []
  for (let x = 0; x <= COLS; x += 2) {
    for (let y = 0; y <= ROWS; y += 2) {
      dots.push(<circle key={`${x}-${y}`} cx={x * U} cy={y * U} r={1.8} />)
    }
  }

  return (
    <div className="liquid-grid" ref={wrapRef}>
      <svg
        ref={svgRef}
        viewBox={`${-U * 0.5} ${-U * 0.5} ${WIDTH + U} ${HEIGHT + U}`}
        role="img"
        aria-label="Interactive liquid grid illustration"
      >
        <defs>
          <filter id="goo" x="-30%" y="-30%" width="160%" height="160%" colorInterpolationFilters="sRGB">
            <feGaussianBlur in="SourceGraphic" stdDeviation="8" result="blur" />
            <feColorMatrix in="blur" values="1 0 0 0 0  0 1 0 0 0  0 0 1 0 0  0 0 0 24 -11" />
          </filter>
        </defs>

        <g className="liquid-grid__dots">{dots}</g>
        <CellLayer layer="gray" color="var(--cell)" />

        <g ref={linesRef} className="liquid-grid__lines">
          <rect x={U * 2} y={U * 2} width={U * 7} height={U * 6} rx={U * 0.8} />
          <circle cx={U * 4} cy={U * 6} r={U * 2.2} />
          <path d={`M${U} ${U * 4} H${U * 11}`} />
          <path d={`M${U * 6} ${U} V${U * 10}`} />
          <path d={`M${U * 2} ${U * 2} L${U * 5} ${U * 5}`} />
          <path d={`M${U * 9} ${U * 8} Q${U * 11} ${U * 8} ${U * 11} ${U * 6}`} />
        </g>

        <CellLayer layer="lavender" color="var(--lavender)" />
        <CellLayer layer="lime" color="var(--lime)" />
      </svg>
    </div>
  )
}

export default LiquidGrid
