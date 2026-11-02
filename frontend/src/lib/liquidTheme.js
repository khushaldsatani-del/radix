// Per-section liquid themes. A section opts in with data-liquid="<name>".
// colors: two dye colours (0-1 RGB) the fluid drifts between.
// curl: swirl strength, radius: splat size, dissipation: how fast dye fades,
// force: how strongly the pointer pushes the fluid, cursor: the drop's colour.
export const LIQUID_THEMES = {
  hero: {
    colors: [
      [0.52, 0.48, 0.98],
      [0.4, 0.34, 0.94],
    ],
    curl: 18,
    radius: 0.18,
    dissipation: 1.8,
    force: 4000,
    cursor: '#c8f03c',
  },
  about: {
    colors: [
      [0.62, 0.6, 0.98],
      [0.45, 0.62, 0.98],
    ],
    curl: 10,
    radius: 0.2,
    dissipation: 2,
    force: 3200,
    cursor: '#a9a6f6',
  },
  // Monochrome smoke to sit with the black-and-white portraits.
  team: {
    colors: [
      [0.62, 0.62, 0.66],
      [0.5, 0.5, 0.56],
    ],
    curl: 14,
    radius: 0.2,
    dissipation: 2,
    force: 3200,
    cursor: '#bdbdbd',
  },
  footer: {
    colors: [
      [0.55, 0.52, 0.98],
      [0.62, 0.6, 0.98],
    ],
    curl: 16,
    radius: 0.2,
    dissipation: 1.8,
    force: 3600,
    cursor: '#c8f03c',
  },
}

const FALLBACK = 'hero'

// Calls onChange(name, theme) whenever the section under the pointer changes,
// including when the page scrolls a new section under a still pointer.
export function watchLiquidSection(onChange) {
  let current = null
  let x = -1
  let y = -1

  const check = (target) => {
    const name = target?.closest?.('[data-liquid]')?.dataset.liquid ?? FALLBACK
    if (name === current) return
    current = name
    onChange(name, LIQUID_THEMES[name] ?? LIQUID_THEMES[FALLBACK])
  }

  const onMove = (e) => {
    x = e.clientX
    y = e.clientY
    check(e.target)
  }

  // Touch: pointer events stop once the page starts scrolling, but touchmove keeps firing.
  const onTouch = (e) => {
    const touch = e.touches[0]
    if (!touch) return
    x = touch.clientX
    y = touch.clientY
    check(document.elementFromPoint(x, y))
  }

  const onScroll = () => {
    if (x >= 0) check(document.elementFromPoint(x, y))
  }

  window.addEventListener('pointermove', onMove, { passive: true })
  window.addEventListener('touchstart', onTouch, { passive: true })
  window.addEventListener('touchmove', onTouch, { passive: true })
  window.addEventListener('scroll', onScroll, { passive: true })
  check(null)

  return () => {
    window.removeEventListener('pointermove', onMove)
    window.removeEventListener('touchstart', onTouch)
    window.removeEventListener('touchmove', onTouch)
    window.removeEventListener('scroll', onScroll)
  }
}
