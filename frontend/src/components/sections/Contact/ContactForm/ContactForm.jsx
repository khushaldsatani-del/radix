import { useId, useState } from 'react';
import Button from '@/components/common/Button/Button';
import { CONTACT, CONTACT_TOPICS } from '@/data/content';
import './ContactForm.css';

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const EMPTY = { name: '', email: '', topic: CONTACT_TOPICS[0], message: '' };

/** Builds an email for the visitor's own mail app. Nothing is sent or stored. */
export default function ContactForm() {
  const id = useId();
  const [form, setForm] = useState(EMPTY);
  const [errors, setErrors] = useState({});
  const [ready, setReady] = useState(null);
  const [copyLabel, setCopyLabel] = useState('Copy Text');

  const set = (k) => (e) => {
    setForm((f) => ({ ...f, [k]: e.target.value }));
    if (errors[k]) setErrors((er) => ({ ...er, [k]: undefined }));
  };

  const onSubmit = (e) => {
    e.preventDefault();
    const er = {};
    if (!form.name.trim()) er.name = 'Please enter your name.';
    if (!form.email.trim()) er.email = 'Please enter your email.';
    else if (!EMAIL_RE.test(form.email.trim())) er.email = 'That email address looks incomplete.';
    if (!form.message.trim()) er.message = 'Please write a message.';
    setErrors(er);
    if (Object.keys(er).length) {
      document.getElementById(`${id}-${Object.keys(er)[0]}`)?.focus();
      return;
    }
    const subject = `[Radix website] ${form.topic}`;
    const body = `${form.message.trim()}\n\n— ${form.name.trim()} (${form.email.trim()})`;
    setReady({
      preview: `To: ${CONTACT.business}\nSubject: ${subject}\n\n${body}`,
      href: `mailto:${CONTACT.business}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`,
    });
    setCopyLabel('Copy Text');
  };

  const copy = async () => {
    try {
      await navigator.clipboard.writeText(ready.preview);
      setCopyLabel('Copied');
    } catch {
      const pre = document.getElementById(`${id}-preview`);
      const r = document.createRange(); r.selectNodeContents(pre);
      const s = window.getSelection(); s.removeAllRanges(); s.addRange(r);
      setCopyLabel('Text Selected');
    }
  };

  const field = (key, label, input) => (
    <div className={`field${errors[key] ? ' invalid' : ''}`}>
      <label htmlFor={`${id}-${key}`}>{label} *</label>
      {input}
      {errors[key] && <span className="ferr" id={`${id}-${key}-err`}>{errors[key]}</span>}
    </div>
  );
  const a11y = (key) => ({
    id: `${id}-${key}`,
    'aria-invalid': errors[key] ? true : undefined,
    'aria-describedby': errors[key] ? `${id}-${key}-err` : undefined,
  });

  return (
    <form className="cform" noValidate onSubmit={onSubmit}>
      <h3>Send Us A Message</h3>
      <p className="fnote">Fields marked * are required.</p>
      <div className="two">
        {field('name', 'Name', <input {...a11y('name')} autoComplete="name" value={form.name} onChange={set('name')} />)}
        {field('email', 'Your Email', <input {...a11y('email')} type="email" inputMode="email" autoComplete="email" value={form.email} onChange={set('email')} />)}
      </div>
      {field('topic', 'What Is It About?', (
        <select {...a11y('topic')} value={form.topic} onChange={set('topic')}>
          {CONTACT_TOPICS.map((t) => <option key={t}>{t}</option>)}
        </select>
      ))}
      {field('message', 'Message', <textarea {...a11y('message')} value={form.message} onChange={set('message')} />)}
      <Button type="submit" arrow className="submit">Prepare Email</Button>
      <p className="fnote">
        Nothing is stored on this website. We prepare the email; you send it from your own email app. See our{' '}
        <a href="#privacy">privacy policy</a>.
      </p>
      {ready && (
        <div className="ready" role="status">
          <b>Your email is ready.</b>
          <pre id={`${id}-preview`}>{ready.preview}</pre>
          <div className="row">
            <Button href={ready.href}>Open In Email App</Button>
            <Button variant="ghost" onClick={copy}>{copyLabel}</Button>
          </div>
          <span className="fnote">If your email app doesn't open, copy the text and send it to {CONTACT.business}.</span>
        </div>
      )}
    </form>
  );
}
