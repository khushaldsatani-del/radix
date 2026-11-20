import { useEffect, useMemo, useRef, useState } from 'react';
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

  useEffect(() => {
    const gl = ref.current;
    const RM = prefersReducedMotion();
    let tick = false;

    const update = () => {
      tick = false;
      const r = gl.getBoundingClientRect();
      const mid = window.innerHeight * 0.62;
      const p = RM ? 1 : Math.max(0, Math.min(1, (mid - r.top) / r.height));
      gl.style.setProperty('--p', `${p * 100}%`);
      const reach = r.top + p * r.height + 4;
      const nodes = gl.querySelectorAll('.ge > .node');
      const next = Array.from(nodes, (n) => {
        const b = n.getBoundingClientRect();
        return RM || b.top + b.height / 2 <= reach;
      });
      setLit((prev) => (prev.length === next.length && prev.every((v, i) => v === next[i]) ? prev : next));
    };
    const onScroll = () => { if (!tick) { tick = true; requestAnimationFrame(update); } };

    window.addEventListener('scroll', onScroll, { passive: true });
    window.addEventListener('resize', onScroll);
    update();
    return () => { window.removeEventListener('scroll', onScroll); window.removeEventListener('resize', onScroll); };
  }, []);

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
