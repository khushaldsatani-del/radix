import { useEffect, useState } from 'react'
import logo from '../../assets/logo.png'
import MagneticButton from '../MagneticButton/MagneticButton.jsx'
import './Navbar.css'

const LINKS = [
  { label: 'Home', href: '#top' },
  { label: 'About', href: '#about' },
  { label: 'Team', href: '#team' },
  { label: 'Contact', href: '#contact' },
]

function Navbar() {
  const [active, setActive] = useState(LINKS[0].label)
  const [menuOpen, setMenuOpen] = useState(false)

  useEffect(() => {
    if (!menuOpen) return
    const onKey = (e) => e.key === 'Escape' && setMenuOpen(false)
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [menuOpen])

  const select = (label) => {
    setActive(label)
    setMenuOpen(false)
  }

  return (
    <header className={`navbar${menuOpen ? ' is-open' : ''}`}>
      <a className="navbar__brand" href="#top" onClick={() => select(LINKS[0].label)}>
        <img src={logo} alt="" width="32" height="32" />
        <span>RADIX</span>
      </a>

      <nav className="navbar__links" aria-label="Main">
        {LINKS.slice(0, -1).map(({ label, href }) => (
          <a
            key={label}
            href={href}
            className={`navbar__pill${label === active ? ' is-active' : ''}`}
            aria-current={label === active ? 'location' : undefined}
            onClick={() => select(label)}
          >
            {label}
          </a>
        ))}
      </nav>

      <MagneticButton size="sm" href="#contact">
        Contact us
      </MagneticButton>

      {/* Phones: the pills collapse into this menu. */}
      <button
        type="button"
        className="navbar__toggle"
        aria-expanded={menuOpen}
        aria-controls="mobile-menu"
        aria-label={menuOpen ? 'Close menu' : 'Open menu'}
        onClick={() => setMenuOpen((open) => !open)}
      >
        <span />
        <span />
      </button>

      <nav id="mobile-menu" className="navbar__menu" aria-label="Main" inert={!menuOpen}>
        {LINKS.map(({ label, href }, i) => (
          <a
            key={label}
            href={href}
            className={`navbar__menu-link${label === active ? ' is-active' : ''}`}
            style={{ '--i': i }}
            onClick={() => select(label)}
          >
            <span className="navbar__menu-index">0{i + 1}</span>
            {label}
          </a>
        ))}
      </nav>
    </header>
  )
}

export default Navbar
