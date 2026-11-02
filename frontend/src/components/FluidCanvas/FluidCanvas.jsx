import { useRef } from 'react'
import { gsap, useGSAP } from '../../lib/gsap.js'
import { LIQUID_THEMES, watchLiquidSection } from '../../lib/liquidTheme.js'
import { createFluid } from './createFluid.js'
import './FluidCanvas.css'

const DYE_STRENGTH = 0.13
const IDLE_AFTER = 8
const THEME_EASE = { duration: 1.4, ease: 'power2.out' }

const rgb = ([r, g, b]) => ({ r, g, b })

// A fixed, full-window fluid that the pointer stirs anywhere on the site.
// Its colours and motion ease into the theme of the section under the pointer.
function FluidCanvas() {
  const canvasRef = useRef(null)

  useGSAP((context, contextSafe) => {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return

    const canvas = canvasRef.current
    let fluid
    try {
      fluid = createFluid(canvas)
    } catch (error) {
      console.warn('Fluid effect disabled:', error)
    }
    if (!fluid) return

    const start = LIQUID_THEMES.hero
    const live = {
      a: rgb(start.colors[0]),
      b: rgb(start.colors[1]),
      curl: start.curl,
      radius: start.radius,
      dissipation: start.dissipation,
      force: start.force,
    }

    const unwatch = watchLiquidSection(
      contextSafe((name, theme) => {
        gsap.to(live.a, { ...rgb(theme.colors[0]), ...THEME_EASE, overwrite: true })
        gsap.to(live.b, { ...rgb(theme.colors[1]), ...THEME_EASE, overwrite: true })
        gsap.to(live, {
          curl: theme.curl,
          radius: theme.radius,
          dissipation: theme.dissipation,
          force: theme.force,
          ...THEME_EASE,
          overwrite: true,
        })
      }),
    )

    const pointer = { x: 0, y: 0, dx: 0, dy: 0, moved: false, ready: false }
    let lastActivity = 0
    let elapsed = 0

    const onMove = (e) => {
      const x = e.clientX / window.innerWidth
      const y = 1 - e.clientY / window.innerHeight
      if (pointer.ready) {
        const aspect = window.innerWidth / window.innerHeight
        pointer.dx += (x - pointer.x) * (aspect < 1 ? aspect : 1)
        pointer.dy += (y - pointer.y) / (aspect > 1 ? aspect : 1)
        pointer.moved = true
      }
      pointer.x = x
      pointer.y = y
      pointer.ready = true
    }

    const onOut = (e) => {
      if (!e.relatedTarget) pointer.ready = false
    }

    // Touch has no hover: a finger stirs the fluid while it drags or scrolls,
    // and a tap drops a small burst of colour so there is instant feedback.
    const tapColor = () => ['r', 'g', 'b'].map((k) => live.a[k] * DYE_STRENGTH * 3)
    const onTouchStart = (e) => {
      const touch = e.touches[0]
      if (!touch) return
      pointer.ready = false
      onMove(touch)
      fluid.splat(pointer.x, pointer.y, 0, 300, tapColor())
      lastActivity = elapsed
    }
    const onTouchMove = (e) => {
      if (e.touches[0]) onMove(e.touches[0])
    }
    const onTouchEnd = () => {
      pointer.ready = false
    }

    const tick = (time, deltaMs) => {
      elapsed = time
      fluid.config.curl = live.curl
      fluid.config.splatRadius = live.radius
      fluid.config.densityDissipation = live.dissipation

      if (pointer.moved) {
        const mix = (Math.sin(time * 0.6) + 1) / 2
        const color = ['r', 'g', 'b'].map((k) => (live.a[k] + (live.b[k] - live.a[k]) * mix) * DYE_STRENGTH)
        fluid.splat(pointer.x, pointer.y, pointer.dx * live.force, pointer.dy * live.force, color)
        pointer.dx = 0
        pointer.dy = 0
        pointer.moved = false
        lastActivity = time
      }
      if (time - lastActivity > IDLE_AFTER) return
      fluid.step(Math.min(deltaMs / 1000, 1 / 60))
      fluid.render()
    }

    const onResize = () => {
      fluid.resize()
      lastActivity = elapsed
    }

    window.addEventListener('pointermove', onMove, { passive: true })
    document.addEventListener('pointerout', onOut)
    window.addEventListener('touchstart', onTouchStart, { passive: true })
    window.addEventListener('touchmove', onTouchMove, { passive: true })
    window.addEventListener('touchend', onTouchEnd, { passive: true })
    window.addEventListener('resize', onResize)
    gsap.ticker.add(tick)

    return () => {
      gsap.ticker.remove(tick)
      unwatch()
      window.removeEventListener('pointermove', onMove)
      document.removeEventListener('pointerout', onOut)
      window.removeEventListener('touchstart', onTouchStart)
      window.removeEventListener('touchmove', onTouchMove)
      window.removeEventListener('touchend', onTouchEnd)
      window.removeEventListener('resize', onResize)
      fluid.destroy()
    }
  })

  return <canvas ref={canvasRef} className="fluid-canvas" aria-hidden="true" />
}

export default FluidCanvas
