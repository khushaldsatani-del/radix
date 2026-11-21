import { useEffect, useLayoutEffect, useRef } from 'react';
import Disclaimer from '@/components/layout/Disclaimer/Disclaimer';
import Header from '@/components/layout/Header/Header';
import Footer from '@/components/layout/Footer/Footer';
import Background from '@/components/layout/Background/Background';
import Home from '@/components/pages/Home/Home';
import Legal from '@/components/pages/Legal/Legal';
import ChatAssistant from '@/components/widgets/ChatAssistant/ChatAssistant';
import { LEGAL_PAGES, useHashRoute } from '@/hooks/useHashRoute';
import { scrollToTarget } from '@/utils/smoothScroll';

const HOME_TITLE = 'Radix · Eight Minds. One Foundation.';
const LEGAL_TITLES = { imprint: 'Imprint · Radix', privacy: 'Privacy Policy · Radix' };

export default function App() {
  const hash = useHashRoute();
  const legal = LEGAL_PAGES.includes(hash) ? hash : null;
  const homeY = useRef(0);
  const wasLegal = useRef(false);

  // Remember where the visitor was on the home page before opening a legal page
  useLayoutEffect(() => {
    const save = () => { if (!wasLegal.current) homeY.current = window.scrollY; };
    window.addEventListener('scroll', save, { passive: true });
    return () => window.removeEventListener('scroll', save);
  }, []);

  useLayoutEffect(() => {
    document.title = legal ? LEGAL_TITLES[legal] : HOME_TITLE;
    if (legal) {
      scrollToTarget(0, { immediate: true });
    } else if (hash) {
      // Section links work from legal pages and on first load (content renders after the browser's own jump)
      const el = document.getElementById(hash);
      if (el) scrollToTarget(el, { immediate: wasLegal.current });
    } else if (wasLegal.current) {
      scrollToTarget(homeY.current, { immediate: true });
    }
    wasLegal.current = Boolean(legal);
  }, [legal, hash]);

  // Smooth-scroll same-page section links (#about, #team, ...) with Lenis.
  // Legal pages (#imprint, #privacy) and links clicked on a legal page keep the hash router's behaviour.
  useEffect(() => {
    const onClick = (e) => {
      if (e.defaultPrevented || e.button !== 0 || e.metaKey || e.ctrlKey || e.shiftKey || e.altKey) return;
      const a = e.target.closest?.('a[href^="#"]');
      if (!a) return;
      const id = a.getAttribute('href').slice(1);
      const current = window.location.hash.slice(1);
      if (LEGAL_PAGES.includes(id) || LEGAL_PAGES.includes(current)) return;
      const el = id && id !== 'top' ? document.getElementById(id) : null;
      if (id && id !== 'top' && !el) return;
      e.preventDefault();
      scrollToTarget(el ?? 0);
      if (current !== id) history.pushState(null, '', `#${id}`);
    };
    document.addEventListener('click', onClick);
    return () => document.removeEventListener('click', onClick);
  }, []);

  return (
    <>
      <Disclaimer />
      <Header />
      <Background />
      {legal ? <Legal page={legal} /> : <Home />}
      <Footer />
      <ChatAssistant />
    </>
  );
}
