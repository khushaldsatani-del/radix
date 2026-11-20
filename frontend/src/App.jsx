import { useLayoutEffect, useRef } from 'react';
import Disclaimer from '@/components/layout/Disclaimer/Disclaimer';
import Header from '@/components/layout/Header/Header';
import Footer from '@/components/layout/Footer/Footer';
import Background from '@/components/layout/Background/Background';
import Home from '@/components/pages/Home/Home';
import Legal from '@/components/pages/Legal/Legal';
import ChatAssistant from '@/components/widgets/ChatAssistant/ChatAssistant';
import { LEGAL_PAGES, useHashRoute } from '@/hooks/useHashRoute';

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
      window.scrollTo({ top: 0, behavior: 'instant' });
    } else if (hash) {
      // Section links work from legal pages and on first load (content renders after the browser's own jump)
      document.getElementById(hash)?.scrollIntoView({ behavior: wasLegal.current ? 'instant' : 'auto' });
    } else if (wasLegal.current) {
      window.scrollTo({ top: homeY.current, behavior: 'instant' });
    }
    wasLegal.current = Boolean(legal);
  }, [legal, hash]);

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
