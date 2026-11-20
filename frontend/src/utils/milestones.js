import { MILESTONES } from '@/data/growth';

/** Next upcoming milestone with days left, or null when all are done. */
export function getNextMilestone(now = new Date()) {
  const m = MILESTONES.find(([iso]) => new Date(iso + 'T10:00:00') > now);
  if (!m) return null;
  const [iso, title, text] = m;
  const days = Math.ceil((new Date(iso + 'T10:00:00') - now) / 864e5);
  return { iso, title, text, days };
}
