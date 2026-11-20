import { useEffect, useRef, useState } from 'react';
import { prefersReducedMotion } from '@/hooks/useReducedMotion';

/** Counts from 0 to `to` the first time it becomes visible. */
export default function CountUp({ to, duration = 900, className }) {
  const ref = useRef(null);
  const [val, setVal] = useState(to);

  useEffect(() => {
    const el = ref.current;
    if (!el || prefersReducedMotion() || !('IntersectionObserver' in window)) return;
    let raf;
    const io = new IntersectionObserver(([e]) => {
      if (!e.isIntersecting) return;
      io.disconnect();
      let start = null;
      const step = (ts) => {
        if (start === null) start = ts;
        const p = Math.min(1, (ts - start) / duration);
        setVal(Math.round(to * p));
        if (p < 1) raf = requestAnimationFrame(step);
      };
      raf = requestAnimationFrame(step);
    }, { threshold: 0.4 });
    io.observe(el);
    return () => { io.disconnect(); cancelAnimationFrame(raf); };
  }, [to, duration]);

  return <span ref={ref} className={className}>{val}</span>;
}
