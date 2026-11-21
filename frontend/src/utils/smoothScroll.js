import Lenis from 'lenis';
import 'lenis/dist/lenis.css';
import { prefersReducedMotion } from '@/hooks/useReducedMotion';

/**
 * Lenis smooth scrolling for the whole page (https://github.com/darkroomengineering/lenis).
 * Created once in main.jsx before React renders, so components can subscribe to it.
 * Visitors who prefer reduced motion keep normal browser scrolling (getLenis() is null).
 * Touch devices keep native scrolling (syncTouch off), only wheel/trackpad is smoothed.
 */
let lenis = null;

export function initSmoothScroll() {
  if (lenis || typeof window === 'undefined' || prefersReducedMotion()) return lenis;
  lenis = new Lenis({
    lerp: 0.1,
    smoothWheel: true,
    autoRaf: true,
    // section links are handled in App.jsx so they work with the hash router
    anchors: false,
  });
  return lenis;
}

export const getLenis = () => lenis;

/**
 * Scrolls to an element or a y position. Lenis applies the header offset
 * from `scroll-padding-top` (global.css) itself; the native fallback does too.
 */
export function scrollToTarget(target, { immediate = false } = {}) {
  if (lenis) {
    // re-measure first: after switching between home and a legal page the page height has
    // just changed, and Lenis would otherwise clamp the target to the old height
    lenis.resize();
    lenis.scrollTo(target, { immediate, force: true });
    return;
  }
  const behavior = immediate ? 'instant' : 'smooth';
  if (typeof target === 'number') window.scrollTo({ top: target, behavior });
  else target?.scrollIntoView({ behavior });
}
