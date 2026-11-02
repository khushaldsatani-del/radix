// Grid layouts for the hero visual. Each map is COLS x ROWS:
// g = gray, l = lime, v = lavender, . = empty.
// Layout A is the resting state; colored cells flow into layout B on scroll.

export const U = 48
export const COLS = 12
export const ROWS = 11
export const MAX_DELAY = 0.3

const LAYOUT_A = [
  '......l.ll..',
  '..g.llllll..',
  '.ggggllgg...',
  '.gggggggg.vv',
  'gggggggggvvv',
  'ggggglggvvv.',
  '.gg.lllgvvg.',
  '.gg..llgg.g.',
  '..ggggggggg.',
  '....gggg....',
  '.....gg.....',
]

const LAYOUT_B = [
  '.........vv.',
  '........vvvv',
  '.........vvv',
  '..........v.',
  '............',
  '............',
  '...ll.......',
  '..llll......',
  '..lllll.....',
  '...llll.....',
  '....ll......',
]

function cellsOf(layout, type) {
  const cells = []
  layout.forEach((row, y) => {
    ;[...row].forEach((char, x) => {
      if (char === type) cells.push({ x: x * U, y: y * U })
    })
  })
  return cells
}

function pair(type) {
  const from = cellsOf(LAYOUT_A, type)
  const to = cellsOf(LAYOUT_B, type)
  if (to.length && to.length !== from.length) {
    throw new Error(`Layout mismatch for "${type}": ${from.length} vs ${to.length}`)
  }
  return from.map((a, i) => {
    const b = to[i] || a
    return { ax: a.x, ay: a.y, bx: b.x, by: b.y, delay: (i / from.length) * MAX_DELAY }
  })
}

export const grayCells = pair('g')
export const limeCells = pair('l')
export const lavenderCells = pair('v')
