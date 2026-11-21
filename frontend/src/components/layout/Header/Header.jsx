import { useCallback, useEffect, useRef, useState } from 'react';
import Brand from '@/components/common/Brand/Brand';
import Button from '@/components/common/Button/Button';
import Nav from './Nav/Nav';
import './Header.css';

/** Sticky header: brand, nav with active-section pill, scroll progress bar and mobile menu. */
export default function Header() {
  const navRef = useRef(null);
  const progressRef = useRef(null);
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);
  const [active, setActive] = useState(null);
  const [pill, setPill] = useState({ opacity: 0 });

  const update = useCallback(() => {
    const max = document.documentElement.scrollHeight - window.innerHeight;
    const f = max > 0 ? Math.min(1, window.scrollY / max) : 0;
    if (progressRef.current) progressRef.current.style.width = `${f * 100}%`;
    setScrolled(window.scrollY > 8);

    // Last nav-linked section that has scrolled past 40% of the viewport. Sections without
    // an id (e.g. Process) keep the previous link active instead of clearing it.
    let cur = null;
    document.querySelectorAll('[data-sec][id]').forEach((s) => {
      if (s.getBoundingClientRect().top < window.innerHeight * 0.4) cur = s;
    });
    const id = cur?.id || null;
    setActive(id);

    const nav = navRef.current;
    const link = id && nav?.querySelector(`a[href="#${id}"]`);
    const next = link && window.matchMedia('(min-width: 901px)').matches
      ? { opacity: 1, left: link.offsetLeft, width: link.offsetWidth }
      : { opacity: 0 };
    // Only re-render when the pill actually moves
    setPill((p) => (p.opacity === next.opacity && p.left === next.left && p.width === next.width ? p : next));
  }, []);

  useEffect(() => {
    let tick = false;
    const onScroll = () => { if (!tick) { tick = true; requestAnimationFrame(() => { tick = false; update(); }); } };
    window.addEventListener('scroll', onScroll, { passive: true });
    window.addEventListener('resize', onScroll);
    update();
    return () => { window.removeEventListener('scroll', onScroll); window.removeEventListener('resize', onScroll); };
  }, [update]);

  // Close the mobile menu with Escape, an outside click, or when growing to desktop width
  useEffect(() => {
    if (!open) return;
    const onKey = (e) => e.key === 'Escape' && setOpen(false);
    const onClick = (e) => { if (!e.target.closest('.site-header')) setOpen(false); };
    const mq = window.matchMedia('(min-width: 901px)');
    const onMq = () => mq.matches && setOpen(false);
    document.addEventListener('keydown', onKey);
    document.addEventListener('click', onClick);
    mq.addEventListener('change', onMq);
    return () => {
      document.removeEventListener('keydown', onKey);
      document.removeEventListener('click', onClick);
      mq.removeEventListener('change', onMq);
    };
  }, [open]);

  return (
    <header className={`site-header${scrolled ? ' scrolled' : ''}`}>
      <div className="wrap">
        <Brand />
        <Nav ref={navRef} open={open} active={active} pill={pill} onNavigate={() => setOpen(false)} />
        <Button className="cta" href="#contact" arrow magnetic>Let's Talk</Button>
        <button
          type="button"
          className={`menu-btn${open ? ' open' : ''}`}
          aria-expanded={open}
          aria-controls="main-nav"
          aria-label={open ? 'Close menu' : 'Open menu'}
          onClick={() => setOpen((o) => !o)}
        >
          <span className="bars" aria-hidden="true"><i /><i /><i /></span>
          <span className="lbl">{open ? 'Close' : 'Menu'}</span>
        </button>
      </div>
      <div className="progress" ref={progressRef} />
    </header>
  );
}
