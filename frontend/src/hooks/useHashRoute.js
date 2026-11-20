import { useEffect, useState } from 'react';

export const LEGAL_PAGES = ['imprint', 'privacy'];
const getHash = () => window.location.hash.slice(1);

/** Returns the current hash (without "#") and re-renders on change. */
export function useHashRoute() {
  const [hash, setHash] = useState(getHash);
  useEffect(() => {
    const on = () => setHash(getHash());
    window.addEventListener('hashchange', on);
    window.addEventListener('popstate', on);
    return () => {
      window.removeEventListener('hashchange', on);
      window.removeEventListener('popstate', on);
    };
  }, []);
  return hash;
}

/** Clears the hash without adding a jump, then notifies listeners. */
export function goHome() {
  history.pushState('', document.title, window.location.pathname + window.location.search);
  window.dispatchEvent(new PopStateEvent('popstate'));
}
