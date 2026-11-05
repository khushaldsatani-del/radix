import { useEffect, useRef, useState } from 'react'
import { gsap } from '../../lib/gsap.js'
import { lenis } from '../../hooks/useLenis.js'
import { SITE } from '../../config/site.js'
import './ContactDialog.css'

const CHANNELS = [
  {
    label: 'Business enquiries',
    text: 'Projects, partnerships and professional questions.',
    address: SITE.email,
    subject: 'Project enquiry for Radix',
  },
  {
    label: 'Contact & support',
    text: 'General questions, feedback and support.',
    address: SITE.supportEmail,
    subject: 'Question for Radix',
  },
]

const gmailUrl = (to, subject) =>
  `https://mail.google.com/mail/?view=cm&fs=1&to=${encodeURIComponent(to)}&su=${encodeURIComponent(subject)}`

const mailtoUrl = (to, subject) => `mailto:${to}?subject=${encodeURIComponent(subject)}`

function Channel({ channel }) {
  const [copied, setCopied] = useState(false)

  useEffect(() => {
    if (!copied) return
    const timer = setTimeout(() => setCopied(false), 1800)
    return () => clearTimeout(timer)
  }, [copied])

  const copy = async () => {
    try {
      await navigator.clipboard.writeText(channel.address)
    } catch {
      // Older browsers or insecure contexts: fall back to a temporary selection.
      const field = document.createElement('textarea')
      field.value = channel.address
      document.body.appendChild(field)
      field.select()
      document.execCommand('copy')
      field.remove()
    }
    setCopied(true)
  }

  return (
    <article className="channel" data-anim>
      <span className="channel__label">{channel.label}</span>
      <p className="channel__text">{channel.text}</p>
      <div className="channel__address">
        <span>{channel.address}</span>
        <button type="button" className={`channel__copy${copied ? ' is-copied' : ''}`} onClick={copy}>
          {copied ? '✓ Copied' : 'Copy'}
        </button>
      </div>
      <div className="channel__actions">
        <a className="channel__primary" href={gmailUrl(channel.address, channel.subject)} target="_blank" rel="noreferrer">
          Write in Gmail <span aria-hidden="true">↗</span>
        </a>
        <a className="channel__secondary" href={mailtoUrl(channel.address, channel.subject)}>
          Open mail app
        </a>
      </div>
    </article>
  )
}

// A modal contact panel, opened by any "Contact us" button via openContact().
function ContactDialog() {
  const dialogRef = useRef(null)
  const [open, setOpen] = useState(false)

  useEffect(() => {
    const onOpen = () => setOpen(true)
    window.addEventListener('contact:open', onOpen)
    return () => window.removeEventListener('contact:open', onOpen)
  }, [])

  useEffect(() => {
    const dialog = dialogRef.current
    if (!open) return
    dialog.showModal()
    lenis?.stop()

    if (!window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      gsap
        .timeline()
        .fromTo(dialog, { opacity: 0 }, { opacity: 1, duration: 0.25, ease: 'power1.out' })
        .fromTo('.contact__panel', { y: 40, scale: 0.97 }, { y: 0, scale: 1, duration: 0.6, ease: 'power3.out' }, 0)
        .fromTo('.contact__panel [data-anim]', { y: 18, opacity: 0 }, { y: 0, opacity: 1, duration: 0.5, stagger: 0.06, ease: 'power3.out' }, 0.15)
    }

    return () => lenis?.start()
  }, [open])

  const close = () => {
    const dialog = dialogRef.current
    const finish = () => {
      dialog.close()
      setOpen(false)
    }
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return finish()
    gsap
      .timeline({ onComplete: finish })
      .to('.contact__panel', { y: 24, scale: 0.98, duration: 0.25, ease: 'power2.in' })
      .to(dialog, { opacity: 0, duration: 0.25, ease: 'power1.in' }, 0)
  }

  return (
    <dialog
      ref={dialogRef}
      className="contact"
      aria-labelledby="contact-title"
      onCancel={(e) => {
        e.preventDefault()
        close()
      }}
      onClick={(e) => e.target === dialogRef.current && close()}
    >
      {open && (
        <div className="contact__panel">
          <button type="button" className="contact__close" onClick={close} aria-label="Close">
            <span />
            <span />
          </button>
          <span className="contact__eyebrow" data-anim>
            Let&apos;s talk
          </span>
          <h2 id="contact-title" className="contact__title" data-anim>
            How can we help?
          </h2>
          <p className="contact__intro" data-anim>
            Write to us and we&apos;ll get back to you as soon as we can.
          </p>
          <div className="contact__channels">
            {CHANNELS.map((channel) => (
              <Channel key={channel.address} channel={channel} />
            ))}
          </div>
        </div>
      )}
    </dialog>
  )
}

export default ContactDialog
