export const pad2 = (n) => String(n).padStart(2, '0');

const longDate = new Intl.DateTimeFormat('en-GB', { day: 'numeric', month: 'long', year: 'numeric' });
export const formatLong = (iso) => longDate.format(new Date(iso + 'T12:00:00'));

/** 1 -> "st", 2 -> "nd", 3 -> "rd", 4 -> "th", 11 -> "th" ... */
export function ordinalSuffix(n) {
  const t = n % 100;
  if (t >= 11 && t <= 13) return 'th';
  return { 1: 'st', 2: 'nd', 3: 'rd' }[n % 10] || 'th';
}

export const initials = (name) => name.split(' ').map((w) => w[0]).join('').slice(0, 2);
