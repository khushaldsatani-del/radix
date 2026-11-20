import { useEffect, useState } from 'react';

const query = '(prefers-reduced-motion: reduce)';

export function useReducedMotion() {
  const [rm, setRm] = useState(() => typeof window !== 'undefined' && window.matchMedia(query).matches);
  useEffect(() => {
    const mq = window.matchMedia(query);
    const on = () => setRm(mq.matches);
    mq.addEventListener('change', on);
    return () => mq.removeEventListener('change', on);
  }, []);
  return rm;
}

export const prefersReducedMotion = () => window.matchMedia(query).matches;
export const hasFinePointer = () => window.matchMedia('(pointer: fine)').matches;
