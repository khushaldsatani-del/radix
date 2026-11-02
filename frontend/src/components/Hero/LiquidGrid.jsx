import { useRef } from 'react'
import { gsap, useGSAP } from '../../lib/gsap.js'
import { U, COLS, ROWS, MAX_DELAY, grayCells, limeCells, lavenderCells } from './liquidGridData.js'

const WIDTH = COLS * U
const HEIGHT = ROWS * U
const RADIUS = U * 3.5
const LAYERS = { gray: grayCells, lime: limeCells, lavender: lavenderCells }
const PULL = { gray: 0.12, lime: 0.38, lavender: 0.38 }

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
  const blobRef = useRef(null)

  useGSAP(
    (context, contextSafe) => {
      if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return

      const svg = svgRef.current
      const wrap = wrapRef.current
      const blob = blobRef.current
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
          s: 0,
          intro: 0,
          phase: Math.random() * Math.PI * 2,
        }
      })

      const mouse = { x: WIDTH / 2, y: HEIGHT / 2, active: false }
      const cursor = { x: WIDTH / 2, y: HEIGHT / 2, r: 0 }
      const morph = { p: 0 }
      let visible = true

      const render = (time = 0) => {
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
              const f = (1 - d / RADIUS) ** 2
              tx = dx * f * c.pull
              ty = dy * f * c.pull
              ts = f * 0.3
            }
          }
          c.ox += (tx - c.ox) * 0.1
          c.oy += (ty - c.oy) * 0.1
          c.s += (ts - c.s) * 0.1

          const x = c.hx + c.ox + Math.sin(time * 1.4 + c.phase) * 2
          const y = c.hy + c.oy + Math.cos(time * 1.1 + c.phase) * 2
          const scale = c.intro * (1 + c.s)
          c.el.setAttribute('transform', `translate(${x} ${y}) scale(${scale}) translate(${-U / 2} ${-U / 2})`)
        }

        cursor.x += (mouse.x - cursor.x) * 0.18
        cursor.y += (mouse.y - cursor.y) * 0.18
        cursor.r += ((mouse.active ? U * 0.55 : 0) - cursor.r) * 0.12
        blob.setAttribute('cx', cursor.x)
        blob.setAttribute('cy', cursor.y)
        blob.setAttribute('r', Math.max(0, cursor.r))
      }

      const tick = (time) => visible && render(time)
      render()
      gsap.ticker.add(tick)

      gsap.to(cells, {
        intro: 1,
        duration: 1,
        ease: 'elastic.out(1, 0.6)',
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
        mouse.x = p.x
        mouse.y = p.y
        if (!mouse.active) {
          cursor.x = p.x
          cursor.y = p.y
        }
        mouse.active = true
      }

      const onLeave = () => {
        mouse.active = false
      }

      // Click: push nearby cells away like a ripple and throw off droplets.
      const onDown = contextSafe((e) => {
        const p = toSvg(e)
        for (const c of cells) {
          const dx = c.hx - p.x
          const dy = c.hy - p.y
          const d = Math.hypot(dx, dy) || 1
          if (d < U * 4.5) {
            const f = 1 - d / (U * 4.5)
            c.ox += (dx / d) * f * 42
            c.oy += (dy / d) * f * 42
            c.s += f * 0.3
          }
        }

        const group = svg.querySelector(`[data-group="${Math.random() < 0.5 ? 'lime' : 'lavender'}"]`)
        for (let i = 0; i < 8; i++) {
          const drop = document.createElementNS('http://www.w3.org/2000/svg', 'circle')
          group.appendChild(drop)
          const angle = (i / 8) * Math.PI * 2 + Math.random() * 0.6
          const dist = gsap.utils.random(U, U * 2.8)
          gsap.fromTo(
            drop,
            { attr: { cx: p.x, cy: p.y, r: gsap.utils.random(10, 22) } },
            {
              attr: { cx: p.x + Math.cos(angle) * dist, cy: p.y + Math.sin(angle) * dist, r: 0 },
              duration: gsap.utils.random(0.8, 1.2),
              ease: 'power3.out',
              onComplete: () => drop.remove(),
            },
          )
        }
      })

      const onPointerUp = (e) => {
        if (e.pointerType !== 'mouse') onLeave()
      }

      wrap.addEventListener('pointermove', onMove)
      wrap.addEventListener('pointerleave', onLeave)
      wrap.addEventListener('pointerdown', onDown)
      wrap.addEventListener('pointerup', onPointerUp)

      const observer = new IntersectionObserver(([entry]) => {
        visible = entry.isIntersecting
      })
      observer.observe(wrap)

      // Scroll: pin the hero on desktop while the colored cells flow into a new shape.
      // Looked up from the DOM because a parent's ref isn't attached yet when this effect runs.
      const pinTarget = wrap.closest('[data-pin-scope]') || wrap
      const mm = gsap.matchMedia()
      mm.add({ desktop: '(min-width: 900px)', mobile: '(max-width: 899px)' }, (ctx) => {
        const { desktop } = ctx.conditions
        gsap
          .timeline({
            scrollTrigger: desktop
              ? { trigger: pinTarget, start: 'top top', end: '+=120%', scrub: 1, pin: true }
              : { trigger: wrap, start: 'top 70%', end: 'bottom 10%', scrub: 1 },
          })
          .to(morph, { p: 1, ease: 'none' }, 0)
          .to(linesRef.current, { y: -U * 0.6, opacity: 0.4, ease: 'none' }, 0)
      })

      return () => {
        gsap.ticker.remove(tick)
        wrap.removeEventListener('pointermove', onMove)
        wrap.removeEventListener('pointerleave', onLeave)
        wrap.removeEventListener('pointerdown', onDown)
        wrap.removeEventListener('pointerup', onPointerUp)
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
          <filter id="goo" x="-20%" y="-20%" width="140%" height="140%" colorInterpolationFilters="sRGB">
            <feGaussianBlur in="SourceGraphic" stdDeviation="7" result="blur" />
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
        <CellLayer layer="lime" color="var(--lime)">
          <circle ref={blobRef} r="0" />
        </CellLayer>
      </svg>
    </div>
  )
}

export default LiquidGrid
