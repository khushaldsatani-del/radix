import { useLayoutEffect, useState } from 'react';
import { prefersReducedMotion } from './useReducedMotion';

/**
 * Reveal state for scroll-in animations.
 * 'idle' = before mount check, 'pre' = waiting below the fold, 'in' = revealed.
 *
 * Uses IntersectionObserver plus a scroll fallback: on fast scrolls or jump links an
 * element can skip from below to above the viewport without ever "intersecting",
 * which left content permanently invisible in the original site.
 */
export function useInView(ref, { threshold = 0.14, rootMargin = '0px 0px -6% 0px' } = {}) {
  const [state, setState] = useState('idle');

  useLayoutEffect(() => {
    const el = ref.current;
    if (!el) return;
    const reached = () => el.getBoundingClientRect().top <= window.innerHeight * 0.95;
    if (!('IntersectionObserver' in window) || prefersReducedMotion() || reached()) { setState('in'); return; }

    setState('pre');
    let done = false, tick = false;
    const reveal = () => {
      if (done) return;
      done = true;
      setState('in');
      io.disconnect();
      window.removeEventListener('scroll', onScroll);
    };
    const onScroll = () => {
      if (tick) return;
      tick = true;
      requestAnimationFrame(() => { tick = false; if (reached()) reveal(); });
    };
    const io = new IntersectionObserver((entries) => { if (entries[0].isIntersecting) reveal(); }, { threshold, rootMargin });
    io.observe(el);
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => { done = true; io.disconnect(); window.removeEventListener('scroll', onScroll); };
  }, [ref, threshold, rootMargin]);

  return state;
}
