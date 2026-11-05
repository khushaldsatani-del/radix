import { useRef } from 'react'
import { gsap, useGSAP } from '../../lib/gsap.js'
import HighlightShape from '../Hero/HighlightShape.jsx'
import MagneticButton from '../MagneticButton/MagneticButton.jsx'
import { SITE } from '../../config/site.js'
import Link from '../Link.jsx'
import SocialIcons from './SocialIcons.jsx'
import { openContact } from '../../lib/contact.js'
import './Footer.css'

// Business enquiries first, general contact and support second.
const EMAILS = [
  { label: 'Business enquiries', address: SITE.email },
  { label: 'Contact & support', address: SITE.supportEmail },
]
const WORDMARK = 'RADIX'
const YEAR = new Date().getFullYear()

const COLUMNS = [
  {
    title: 'Explore',
    links: [
      { label: 'Home', href: '#top', section: true },
      { label: 'About', href: '#about', section: true },
      { label: 'Team', href: '#team', section: true },
    ],
  },
  {
    title: 'Connect',
    links: [
      { label: 'Business email', href: `mailto:${SITE.email}`, contact: true },
      { label: 'Support email', href: `mailto:${SITE.supportEmail}`, contact: true },
    ],
    social: true,
  },
  {
    title: 'Legal',
    links: [
      { label: 'Imprint', route: '/imprint' },
      { label: 'Privacy Policy', route: '/privacy' },
    ],
  },
]

// Section links scroll in place on the homepage; from a legal page they go home first.
function FooterLink({ link, home }) {
  const content = (
    <>
      <span>{link.label}</span>
      <span aria-hidden="true">{link.external ? '↗' : '→'}</span>
    </>
  )
  if (link.contact) return (
    <a className="footer__link" href={link.href} onClick={openContact}>
      {content}
    </a>
  )
  if (link.route) return <Link className="footer__link" to={link.route}>{content}</Link>
  if (link.section && !home) return <Link className="footer__link" to={'/' + link.href}>{content}</Link>
  return (
    <a className="footer__link" href={link.href} {...(link.external ? { target: '_blank', rel: 'noreferrer' } : {})}>
      {content}
    </a>
  )
}

function Footer({ home = false }) {
  const ref = useRef(null)

  useGSAP(
    () => {
      if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return

      gsap
        .timeline({ scrollTrigger: { trigger: '.footer__cta', start: 'top 80%' } })
        .from('.footer__label', { y: 20, opacity: 0, duration: 0.7, ease: 'power3.out' })
        .from('.footer__line > span', { yPercent: 110, duration: 1, stagger: 0.1, ease: 'power4.out' }, 0.1)
        .from('.footer .hero__hl-clip', { attr: { width: 0 }, duration: 1.1, ease: 'power2.inOut' }, 0.5)
        .from('.footer__actions > *', { y: 24, opacity: 0, duration: 0.8, stagger: 0.1, ease: 'power3.out' }, 0.5)

      gsap.from('.footer__col, .footer__tagline', {
        y: 30,
        opacity: 0,
        duration: 0.9,
        stagger: 0.08,
        ease: 'power3.out',
        scrollTrigger: { trigger: '.footer__grid', start: 'top 90%' },
      })

      gsap.fromTo('.footer__rule', { scaleX: 0 }, {
        scaleX: 1,
        ease: 'none',
        scrollTrigger: { trigger: '.footer__grid', start: 'top 95%', end: 'top 65%', scrub: true },
      })

      // The wordmark rises out of the bottom edge letter by letter as the page reaches its end.
      gsap.fromTo(
        '.wordmark__letter',
        { yPercent: 100 },
        {
          yPercent: 0,
          stagger: 0.08,
          ease: 'power2.out',
          scrollTrigger: { trigger: '.wordmark', start: 'top bottom', end: 'bottom bottom', scrub: 1 },
        },
      )

      gsap.from('.footer__bottom > *', {
        opacity: 0,
        y: 12,
        duration: 0.7,
        stagger: 0.08,
        ease: 'power3.out',
        scrollTrigger: { trigger: '.footer__bottom', start: 'top 98%' },
      })
    },
    { scope: ref },
  )

  return (
    <footer className="footer" id="contact" data-liquid="footer" ref={ref}>
      <div className="footer__cta">
        <span className="footer__label">Let&apos;s talk</span>
        <h2 className="footer__title">
          <HighlightShape />
          <span className="footer__line">
            <span>Let&apos;s build something</span>
          </span>
          <span className="footer__line">
            <span>
              <span className="hero__hl">rooted.</span>
            </span>
          </span>
        </h2>
        <div className="footer__actions">
          <MagneticButton href={`mailto:${SITE.email}`} onClick={openContact}>
            Contact us
          </MagneticButton>
          <dl className="footer__emails">
            {EMAILS.map(({ label, address }) => (
              <div key={address}>
                <dt>{label}</dt>
                <dd>
                  <a className="footer__email" href={`mailto:${address}`}>
                    {address}
                  </a>
                </dd>
              </div>
            ))}
          </dl>
        </div>
      </div>

      <div className="footer__grid">
        <span className="footer__rule" aria-hidden="true" />
        <p className="footer__tagline">
          Engineered from the source. A team of eight building software that stays solid as it grows.
        </p>
        {COLUMNS.map((col) => (
          <nav key={col.title} className="footer__col" aria-label={col.title}>
            <span className="footer__col-title">{col.title}</span>
            <ul>
              {col.links.map((link) => (
                <li key={link.label}>
                  <FooterLink link={link} home={home} />
                </li>
              ))}
            </ul>
            {col.social && <SocialIcons />}
          </nav>
        ))}
      </div>

      <p className="wordmark" aria-label={WORDMARK}>
        {[...WORDMARK].map((letter, i) => (
          <span key={i} className="wordmark__slot" aria-hidden="true">
            <span className="wordmark__letter">{letter}</span>
          </span>
        ))}
      </p>

      <p className="footer__disclaimer">{SITE.disclaimer}</p>

      <div className="footer__bottom">
        <span>© {YEAR} Radix · {SITE.project}</span>
        <a className="footer__top" href="#top">
          Back to top <span aria-hidden="true">↑</span>
        </a>
      </div>
    </footer>
  )
}

export default Footer
