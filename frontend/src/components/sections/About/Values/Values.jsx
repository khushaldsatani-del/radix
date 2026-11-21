import { useMemo, useRef } from 'react';
import Reveal from '@/components/common/Reveal/Reveal';
import { VALUES } from '@/data/content';
import { clamp01, useScrollFrame } from '@/hooks/useScrollFrame';
import { prefersReducedMotion } from '@/hooks/useReducedMotion';
import './Values.css';

/**
 * Five values drawn as roots growing from one stem. The drawing is scrubbed by the scroll
 * position (not played on a timer), so it grows and shrinks exactly with the page:
 *  --sp  0..1 for the whole group (desktop: stem, bar, drops, then nodes in sequence)
 *  --cp  0..1 per value (stacked mobile layout: each node grows as it enters the view)
 */
export default function Values() {
  const ref = useRef(null);
  const RM = useMemo(() => prefersReducedMotion(), []);

  useScrollFrame(ref, (root, vh) => {
    const top = root.getBoundingClientRect().top;
    root.style.setProperty('--sp', RM ? '1' : clamp01((vh * 0.88 - top) / (vh * 0.5)).toFixed(3));
    root.querySelectorAll('.vcol').forEach((col) => {
      const t = col.getBoundingClientRect().top;
      col.style.setProperty('--cp', RM ? '1' : clamp01((vh * 0.95 - t) / (vh * 0.25)).toFixed(3));
    });
  });

  return (
    <>
      <Reveal as="h3" className="sub-h">Our Values</Reveal>
      <div className="vroots" ref={ref} role="group" aria-label="Our five values">
        <span className="vstem" aria-hidden="true" />
        <span className="vbar" aria-hidden="true" />
        <div className="vcols">
          {VALUES.map((v, i) => (
            <div className="vcol" key={v.title} style={{ '--i': i }}>
              <span className="vdrop" aria-hidden="true" />
              <span className="vnode" aria-hidden="true">{v.glyph}</span>
              <div className="vtext">
                <h4>{v.title}</h4>
                <p>{v.text}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </>
  );
}
