import { useId, useLayoutEffect, useRef, useState } from 'react'

const BRIDGE_PAD = 22
// Makes up for the goo filter shrinking the shape's edges slightly.
const GROW = 2

// Position of `el` inside `root`, ignoring CSS transforms so intro animations don't skew it.
function offsetWithin(el, root) {
  let x = 0
  let y = 0
  for (let node = el; node && node !== root; node = node.offsetParent) {
    x += node.offsetLeft
    y += node.offsetTop
  }
  return { x, y }
}

// Draws the `.hero__hl` highlights inside the parent heading as one gooey shape,
// with a bridge that fuses each highlight to the next one on the following line.
function HighlightShape() {
  const svgRef = useRef(null)
  // useId can contain characters that break url(#...) references.
  const id = `hl${useId().replace(/[^\w-]/g, '')}`
  const [shape, setShape] = useState({ pills: [], bridges: [], radius: 0 })

  useLayoutEffect(() => {
    const title = svgRef.current.parentElement

    const measure = () => {
      const radius = parseFloat(getComputedStyle(title).fontSize) * 0.4
      const pills = [...title.querySelectorAll('.hero__hl')].map((el) => ({
        ...offsetWithin(el, title),
        w: el.offsetWidth,
        h: el.offsetHeight,
      }))

      const bridges = []
      for (let i = 1; i < pills.length; i++) {
        const a = pills[i - 1]
        const b = pills[i]
        // Only bridge highlights on neighbouring lines; a wrapped line in between would be crossed.
        if (b.y <= a.y || b.y - (a.y + a.h) > a.h * 0.5) continue
        const overlapLeft = Math.max(a.x, b.x)
        const overlapRight = Math.min(a.x + a.w, b.x + b.w)
        // Stacked pills join across their shared width; diagonal ones get a corner bridge.
        const [left, right] =
          overlapRight - overlapLeft > BRIDGE_PAD * 2
            ? [overlapLeft + BRIDGE_PAD / 2, overlapRight - BRIDGE_PAD / 2]
            : [Math.min(a.x + a.w, b.x) - BRIDGE_PAD, Math.max(a.x + a.w, b.x) + BRIDGE_PAD]
        const top = a.y + a.h - radius
        bridges.push({ x: left, y: top, w: right - left, h: b.y + radius - top })
      }

      setShape({ pills, bridges, radius })
    }

    measure()
    const observer = new ResizeObserver(measure)
    observer.observe(title)
    document.fonts?.ready.then(measure)
    return () => observer.disconnect()
  }, [])

  return (
    <svg ref={svgRef} className="hero__hl-shape" aria-hidden="true">
      <defs>
        <filter id={`${id}-goo`} x="-20%" y="-50%" width="140%" height="200%" colorInterpolationFilters="sRGB">
          <feGaussianBlur in="SourceGraphic" stdDeviation="6" result="blur" />
          <feColorMatrix in="blur" values="1 0 0 0 0  0 1 0 0 0  0 0 1 0 0  0 0 0 20 -9" />
        </filter>
        <clipPath id={`${id}-reveal`} clipPathUnits="objectBoundingBox">
          <rect className="hero__hl-clip" x="0" y="-1" width="1" height="3" />
        </clipPath>
      </defs>
      <g filter={`url(#${id}-goo)`} fill="var(--lavender-soft)">
        <g clipPath={`url(#${id}-reveal)`}>
          {shape.pills.map((p, i) => (
            <rect
              key={`p${i}`}
              x={p.x - GROW}
              y={p.y - GROW}
              width={p.w + GROW * 2}
              height={p.h + GROW * 2}
              rx={shape.radius}
            />
          ))}
          {shape.bridges.map((b, i) => (
            <rect key={`b${i}`} x={b.x} y={b.y} width={b.w} height={b.h} />
          ))}
        </g>
      </g>
    </svg>
  )
}

export default HighlightShape
