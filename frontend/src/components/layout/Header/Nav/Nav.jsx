import { forwardRef } from 'react';
import { NAV_LINKS } from '@/data/content';
import './Nav.css';

/** Main navigation. The pill highlights the active section on desktop. */
const Nav = forwardRef(function Nav({ open, active, pill, onNavigate }, ref) {
  return (
    <nav ref={ref} id="main-nav" className={`main-nav${open ? ' open' : ''}`} aria-label="Main">
      <span className="pill-bg" aria-hidden="true" style={pill} />
      {NAV_LINKS.map((l) => (
        <a
          key={l.href}
          href={l.href}
          className={active === l.href.slice(1) ? 'active' : undefined}
          aria-current={active === l.href.slice(1) ? 'true' : undefined}
          onClick={onNavigate}
        >
          {l.label}
        </a>
      ))}
    </nav>
  );
});

export default Nav;
