import { useId, useState } from 'react';
import Button from '@/components/common/Button/Button';
import Select from '@/components/common/Select/Select';
import { CONTACT, CONTACT_TOPICS } from '@/data/content';
import { sendContactMessage } from '@/utils/sendContactMessage';
import './ContactForm.css';

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const EMPTY = { name: '', email: '', topic: CONTACT_TOPICS[0], message: '', honey: '' };

/** Contact form that emails the message straight to the Radix team inbox. */
export default function ContactForm() {
  const id = useId();
  const [form, setForm] = useState(EMPTY);
  const [errors, setErrors] = useState({});
  // 'idle' | 'sending' | 'sent' | 'error'
  const [status, setStatus] = useState('idle');
  const [sentTo, setSentTo] = useState('');
  const [errorDetail, setErrorDetail] = useState('');

  const set = (k) => (e) => {
    setForm((f) => ({ ...f, [k]: e.target.value }));
    if (errors[k]) setErrors((er) => ({ ...er, [k]: undefined }));
    if (status === 'sent' || status === 'error') setStatus('idle');
  };

  const onSubmit = async (e) => {
    e.preventDefault();
    if (status === 'sending') return;
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

    setStatus('sending');
    try {
      await sendContactMessage({
        name: form.name.trim(),
        email: form.email.trim(),
        topic: form.topic,
        message: form.message.trim(),
        honey: form.honey,
      });
      setSentTo(form.email.trim());
      setForm(EMPTY);
      setStatus('sent');
    } catch (err) {
      // the service's own reason (e.g. "This form needs Activation") helps while developing
      console.warn('[contact form]', err.message);
      setErrorDetail(import.meta.env.DEV ? err.message : '');
      setStatus('error');
    }
  };

  const field = (key, label, input) => (
    <div className={`field${errors[key] ? ' invalid' : ''}`}>
      <label htmlFor={`${id}-${key}`} id={`${id}-${key}-label`}>{label} *</label>
      {input}
      {errors[key] && <span className="ferr" id={`${id}-${key}-err`}>{errors[key]}</span>}
    </div>
  );
  const a11y = (key) => ({
    id: `${id}-${key}`,
    'aria-invalid': errors[key] ? true : undefined,
    'aria-describedby': errors[key] ? `${id}-${key}-err` : undefined,
  });

  const sending = status === 'sending';

  return (
    <form className="cform" noValidate onSubmit={onSubmit} aria-busy={sending}>
      <h3>Send Us A Message</h3>
      <p className="fnote">Fields marked * are required.</p>
      <div className="two">
        {field('name', 'Name', <input {...a11y('name')} autoComplete="name" value={form.name} onChange={set('name')} />)}
        {field('email', 'Your Email', <input {...a11y('email')} type="email" inputMode="email" autoComplete="email" value={form.email} onChange={set('email')} />)}
      </div>
      {field('topic', 'What Is It About?', (
        <Select
          id={`${id}-topic`}
          labelledBy={`${id}-topic-label`}
          value={form.topic}
          options={CONTACT_TOPICS}
          onChange={(topic) => set('topic')({ target: { value: topic } })}
        />
      ))}
      {field('message', 'Message', <textarea {...a11y('message')} value={form.message} onChange={set('message')} />)}

      {/* Spam trap: hidden from people, bots tend to fill it in */}
      <div hidden>
        <label htmlFor={`${id}-honey`}>Leave this empty</label>
        <input id={`${id}-honey`} tabIndex={-1} autoComplete="off" value={form.honey} onChange={set('honey')} />
      </div>

      <Button type="submit" arrow={!sending} className="submit" disabled={sending}>
        {sending ? 'Sending…' : 'Send Message'}
      </Button>

      <div className="flive" aria-live="polite">
        {status === 'sent' && (
          <div className="fstatus ok" role="status">
            <b>Thanks, your message has been sent.</b>
            <span>We'll reply to {sentTo} as soon as we can.</span>
          </div>
        )}
        {status === 'error' && (
          <div className="fstatus err" role="alert">
            <b>Sorry, your message could not be sent.</b>
            <span>
              Please try again in a moment, or email us directly at{' '}
              <a href={`mailto:${CONTACT.email}`}>{CONTACT.email}</a>.
            </span>
            {errorDetail && <small className="fdev">Dev only: {errorDetail}</small>}
          </div>
        )}
      </div>

      <p className="fnote">
        Your message is delivered to our team inbox and used only to reply to you. See our{' '}
        <a href="#privacy">privacy policy</a>.
      </p>
    </form>
  );
}
