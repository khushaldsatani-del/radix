import { CONTACT } from '@/data/content';
import './ContactInfo.css';

const SOCIALS = [
  {
    label: 'Instagram', href: 'https://www.instagram.com/radix.it',
    icon: <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="3" y="3" width="18" height="18" rx="5" /><circle cx="12" cy="12" r="4" /><circle cx="17.5" cy="6.5" r="1" fill="currentColor" /></svg>,
  },
  {
    label: 'LinkedIn', href: 'https://www.linkedin.com/in/radix-it',
    icon: <svg viewBox="0 0 24 24" fill="currentColor"><path d="M4 9h3.5v11H4zM5.75 3.5a2 2 0 1 1 0 4 2 2 0 0 1 0-4zM10 9h3.4v1.6c.5-.9 1.7-1.9 3.5-1.9 3.7 0 4.1 2.4 4.1 5.5V20h-3.5v-5c0-1.3 0-2.9-1.8-2.9s-2.1 1.4-2.1 2.8V20H10z" /></svg>,
  },
  {
    label: 'GitHub', href: 'https://github.com/Radix-it-08',
    icon: <svg viewBox="0 0 24 24" fill="currentColor"><path d="M12 2a10 10 0 0 0-3.2 19.5c.5.1.7-.2.7-.5v-1.7c-2.8.6-3.4-1.3-3.4-1.3-.5-1.2-1.1-1.5-1.1-1.5-.9-.6.1-.6.1-.6 1 .1 1.5 1 1.5 1 .9 1.6 2.4 1.1 3 .9.1-.7.4-1.1.6-1.4-2.2-.3-4.6-1.1-4.6-5a3.9 3.9 0 0 1 1-2.7c-.1-.3-.4-1.3.1-2.7 0 0 .8-.3 2.8 1a9.6 9.6 0 0 1 5 0c1.9-1.3 2.8-1 2.8-1 .5 1.4.2 2.4.1 2.7a3.9 3.9 0 0 1 1 2.7c0 3.9-2.4 4.7-4.6 5 .4.3.7.9.7 1.9V21c0 .3.2.6.7.5A10 10 0 0 0 12 2z" /></svg>,
  },
];

export default function ContactInfo() {
  return (
    <div className="contact-info">
      <span className="mono eyebrow">Contact</span>
      <h2>Got A Problem?<br /><span className="thin">Let's Dig In.</span></h2>
      <p className="l">
        Questions about Radix, feedback on our work or an idea you'd like to share? Write to us. We read every email and
        answer as a team.
      </p>
      <div className="cinfo">
        <div><span className="k">Business Enquiries</span><a href={`mailto:${CONTACT.business}`}>{CONTACT.business}</a></div>
        <div><span className="k">Contact &amp; Support</span><a href={`mailto:${CONTACT.support}`}>{CONTACT.support}</a></div>
        <div><span className="k">Location</span><span>{CONTACT.location}</span></div>
        <div className="socials">
          {SOCIALS.map((s) => (
            <a key={s.label} href={s.href} target="_blank" rel="noopener noreferrer" aria-label={`Radix on ${s.label} (opens in a new tab)`}>
              {s.icon}
            </a>
          ))}
        </div>
      </div>
    </div>
  );
}
