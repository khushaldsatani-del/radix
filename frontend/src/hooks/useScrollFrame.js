import { useLayoutEffect, useRef } from 'react';
import { getLenis } from '@/utils/smoothScroll';

/**
 * Calls `update(el, viewportHeight)` on every scroll frame, plus on resize and when the
 * element changes size (e.g. an image loads). Used for scroll-scrubbed animations: the
 * callback writes CSS variables, so the animation is tied to the scroll position itself
 * instead of playing on a timer after a trigger.
 *
 * With Lenis active it runs inside Lenis's own frame, so it never lags a frame behind.
 */
export function useScrollFrame(ref, update) {
  const fn = useRef(update);
  fn.current = update;

  useLayoutEffect(() => {
    const el = ref.current;
    if (!el) return;
    let raf = 0;
    const run = () => {
      if (raf) { cancelAnimationFrame(raf); raf = 0; }
      fn.current(el, window.innerHeight);
    };
    const schedule = () => { if (!raf) raf = requestAnimationFrame(() => { raf = 0; run(); }); };

    const lenis = getLenis();
    const offLenis = lenis?.on('scroll', run);
    window.addEventListener('scroll', schedule, { passive: true });
    window.addEventListener('resize', schedule);
    const ro = new ResizeObserver(schedule);
    ro.observe(el);
    run();

    return () => {
      cancelAnimationFrame(raf);
      offLenis?.();
      window.removeEventListener('scroll', schedule);
      window.removeEventListener('resize', schedule);
      ro.disconnect();
    };
  }, [ref]);
}

export const clamp01 = (v) => (v < 0 ? 0 : v > 1 ? 1 : v);
