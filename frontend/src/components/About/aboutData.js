// Copy and small datasets for the About section.

// Icons are 16x16 pixel-art paths, matching the hero's style.
export const APPROACH = [
  {
    title: 'Discover',
    text: 'Dig past the symptoms to find the real problem.',
    pixels: 'M4 2h6v2H4zM2 4h2v6H2zM10 4h2v6h-2zM4 10h6v2H4zM11 11h2v2h-2zM13 13h2v2h-2z',
  },
  {
    title: 'Engineer',
    text: 'Design and build with care, one solid layer at a time.',
    pixels: 'M7 1h2v3H7zM7 12h2v3H7zM1 7h3v2H1zM12 7h3v2h-3zM5 4h6v8H5zM7 7v2h2V7z',
  },
  {
    title: 'Deliver',
    text: 'Ship practical solutions that keep working as they grow.',
    pixels: 'M8 2h6v2H8zM12 4h2v4h-2zM10 6h2v2h-2zM8 8h2v2H8zM6 10h2v2H6zM4 12h2v2H4zM2 14h2v1H2z',
  },
]

export const VALUES = ['Integrity', 'Collaboration', 'Curiosity', 'Inclusivity', 'Responsibility']

// Seven days of a sprint: plan on day one, build through the week, review at the end.
export const SPRINT_DAYS = ['plan', 'build', 'build', 'build', 'build', 'build', 'review']

export const SPRINT_LEGEND = [
  { key: 'plan', label: 'Plan weekly' },
  { key: 'build', label: 'Build daily' },
  { key: 'review', label: 'Review & demo' },
]

// A pixel "R" on a 5 x 7 grid: 1 = letter, 0 = background.
export const R_PIXELS = ['11110', '10001', '10001', '11110', '10100', '10010', '10001']

// The R's cells as [column, row] in the order a pen would draw it:
// up the stem from the root, across the top, round the bowl, back along the middle, down the leg.
export const R_STROKE = [
  [0, 6], [0, 5], [0, 4], [0, 3], [0, 2], [0, 1], [0, 0],
  [1, 0], [2, 0], [3, 0],
  [4, 1], [4, 2],
  [3, 3], [2, 3], [1, 3],
  [2, 4], [3, 5], [4, 6],
]
