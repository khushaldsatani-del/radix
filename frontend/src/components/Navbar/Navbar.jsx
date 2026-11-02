import { useState } from 'react'
import logo from '../../assets/logo.png'
import MagneticButton from '../MagneticButton/MagneticButton.jsx'
import './Navbar.css'

const LINKS = ['Home', 'How it works', 'Services', 'Resources']

function Navbar() {
  const [active, setActive] = useState(LINKS[0])

  return (
    <header className="navbar">
      <a className="navbar__brand" href="/">
        <img src={logo} alt="" />
        <span>RADIX</span>
      </a>

      <nav className="navbar__links" aria-label="Main">
        {LINKS.map((link) => (
          <a
            key={link}
            href="#"
            className={`navbar__pill${link === active ? ' is-active' : ''}`}
            aria-current={link === active ? 'page' : undefined}
            onClick={(e) => {
              e.preventDefault()
              setActive(link)
            }}
          >
            {link}
          </a>
        ))}
      </nav>

      <MagneticButton size="sm" href="#contact">
        Contact us
      </MagneticButton>
    </header>
  )
}

export default Navbar
