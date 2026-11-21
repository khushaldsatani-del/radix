import { useMemo, useRef, useState } from 'react';
import { clamp01, useScrollFrame } from '@/hooks/useScrollFrame';
import { GROWTH } from '@/data/growth';
import { getNextMilestone } from '@/utils/milestones';
import { pad2 } from '@/utils/format';
import { prefersReducedMotion } from '@/hooks/useReducedMotion';
import GrowthEntry from './GrowthEntry/GrowthEntry';
import FeaturedEntry from './FeaturedEntry/FeaturedEntry';
import FutureEntry from './FutureEntry/FutureEntry';
import './GrowthLog.css';

/** Vertical timeline whose stem "grows" as you scroll; entries light up as the stem reaches them. */
export default function GrowthLog() {
  const ref = useRef(null);
  const next = useMemo(() => getNextMilestone(), []);
  const count = GROWTH.length + (next ? 1 : 0);
  const [lit, setLit] = useState(() => Array(count).fill(false));
  const RM = useMemo(() => prefersReducedMotion(), []);

  // Everything is driven by the scroll position on every frame:
  //  --p  stem fill (its tip sits at 62% of the viewport height)
  //  --e  per entry 0..1, rising as the tip approaches the entry's node (card slides/fades in,
  //       connector draws); the node lights up the moment the tip reaches it.
  useScrollFrame(ref, (gl, vh) => {
    const r = gl.getBoundingClientRect();
    const p = RM ? 1 : clamp01((vh * 0.62 - r.top) / r.height);
    gl.style.setProperty('--p', `${p * 100}%`);
    const reach = r.top + p * r.height + 4;
    const ramp = vh * 0.22;
    const next = [];
    gl.querySelectorAll(':scope > .ge').forEach((ge) => {
      const b = ge.querySelector(':scope > .node').getBoundingClientRect();
      const center = b.top + b.height / 2;
      ge.style.setProperty('--e', RM ? '1' : clamp01((reach - center + ramp) / ramp).toFixed(3));
      next.push(RM || center <= reach);
    });
    setLit((prev) => (prev.length === next.length && prev.every((v, i) => v === next[i]) ? prev : next));
  });

  return (
    <div className="gl" ref={ref} role="list" aria-label="Radix growth log">
      <span className="stem" aria-hidden="true"><i /><b /></span>
      {GROWTH.map((g, i) =>
        g.feat ? (
          <FeaturedEntry key={g.title} entry={g} num={pad2(i + 1)} lit={lit[i]} />
        ) : (
          <GrowthEntry key={g.title} entry={g} num={pad2(i + 1)} side={i % 2 ? 'r' : 'l'} lit={lit[i]} />
        )
      )}
      {next && <FutureEntry milestone={next} side={GROWTH.length % 2 ? 'r' : 'l'} lit={lit[GROWTH.length]} />}
    </div>
  );
}
