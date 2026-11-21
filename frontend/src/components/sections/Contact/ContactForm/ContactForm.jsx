import { useEffect, useId, useRef, useState } from 'react';
import Button from '@/components/common/Button/Button';
import Select from '@/components/common/Select/Select';
import { CONTACT, CONTACT_TOPICS } from '@/data/content';
import { sendContactMessage } from '@/utils/sendContactMessage';
import { checkDailyLimit, recordSend, DAILY_LIMIT } from '@/utils/rateLimit';
import { LIMITS, validateContactForm, validateEmail, validateMessage, validateName } from '@/utils/validation';
import './ContactForm.css';

const EMPTY = { name: '', email: '', topic: CONTACT_TOPICS[0], message: '', honey: '' };
const VALIDATORS = { name: validateName, email: validateEmail, message: validateMessage };
const FIELD_ORDER = ['name', 'email', 'message'];
const SUCCESS_MS = 5000;

const timeFmt = new Intl.DateTimeFormat('en-GB', { weekday: 'long', hour: '2-digit', minute: '2-digit' });

const mailLink = <a href={`mailto:${CONTACT.email}`}>{CONTACT.email}</a>;

/** What to tell the visitor for each failure (codes come from sendContactMessage / the daily limit). */
function errorText(code, info) {
  switch (code) {
    case 'limit':
      return {
        title: `You've reached today's limit of ${DAILY_LIMIT} messages.`,
        body: <>To prevent spam, each email address can send {DAILY_LIMIT} messages per day. You can send another one after {info}, or email us directly at {mailLink}.</>,
      };
    case 'offline':
      return { title: 'You seem to be offline.', body: <>Check your internet connection and try again. Your message is still in the form.</> };
    case 'timeout':
      return { title: 'The email service is taking too long to respond.', body: <>Please try again in a moment. Your message is still in the form.</> };
    case 'network':
      return { title: 'We could not reach the email service.', body: <>A browser extension or network filter may be blocking it. Please try again, or email us directly at {mailLink}.</> };
    case 'activation':
      return { title: 'Our contact form is still being set up.', body: <>Please email us directly at {mailLink} for now. Sorry for the trouble.</> };
    case 'busy':
      return { title: 'Too many messages are being sent right now.', body: <>Please wait a few minutes and try again, or email us directly at {mailLink}.</> };
    case 'server':
      return { title: 'The email service is temporarily unavailable.', body: <>Please try again later, or email us directly at {mailLink}.</> };
    case 'rejected':
      return { title: 'The email service did not accept your message.', body: <>Please check your details and try again, or email us directly at {mailLink}.</> };
    default:
      return { title: 'Sorry, your message could not be sent.', body: <>Please try again in a moment, or email us directly at {mailLink}.</> };
  }
}

/** Contact form that emails the message straight to the Radix team inbox. */
export default function ContactForm() {
  const id = useId();
  const [form, setForm] = useState(EMPTY);
  const [errors, setErrors] = useState({});
  const touched = useRef({});
  // 'idle' | 'sending' | 'sent' | 'error'
  const [status, setStatus] = useState('idle');
  const [result, setResult] = useState(null); // { sentTo, remaining } or { code, info, detail }

  // The success message shows for 5 seconds, then the form returns to its fresh state
  useEffect(() => {
    if (status !== 'sent') return;
    const t = setTimeout(() => {
      setStatus('idle');
      setResult(null);
      setForm(EMPTY);
      setErrors({});
      touched.current = {};
    }, SUCCESS_MS);
    return () => clearTimeout(t);
  }, [status]);

  const validateField = (k, value) => VALIDATORS[k]?.(value) || '';

  const set = (k) => (e) => {
    const value = e.target.value;
    setForm((f) => ({ ...f, [k]: value }));
    // once a field has been left (or the form submitted), re-check it live so the error clears as soon as it's fixed
    if (touched.current[k]) setErrors((er) => ({ ...er, [k]: validateField(k, value) }));
    if (status === 'sent' || status === 'error') setStatus('idle');
  };

  const blur = (k) => () => {
    if (!form[k].trim() && !touched.current[k]) return; // don't nag on an empty field the visitor just tabbed past
    touched.current[k] = true;
    setErrors((er) => ({ ...er, [k]: validateField(k, form[k]) }));
  };

  const onSubmit = async (e) => {
    e.preventDefault();
    if (status === 'sending') return;

    const er = validateContactForm(form);
    FIELD_ORDER.forEach((k) => { touched.current[k] = true; });
    setErrors(er);
    const first = FIELD_ORDER.find((k) => er[k]);
    if (first) {
      document.getElementById(`${id}-${first}`)?.focus();
      return;
    }

    const email = form.email.trim();
    setStatus('sending');
    try {
      const limit = await checkDailyLimit(email);
      if (!limit.allowed) {
        setResult({ code: 'limit', info: timeFmt.format(limit.resetAt) });
        setStatus('error');
        return;
      }
      await sendContactMessage({
        name: form.name.trim().replace(/\s+/g, ' '),
        email,
        topic: form.topic,
        message: form.message.trim(),
        honey: form.honey,
      });
      await recordSend(email);
      setResult({ sentTo: email, remaining: limit.remaining - 1 });
      setForm(EMPTY);
      touched.current = {};
      setErrors({});
      setStatus('sent');
    } catch (err) {
      console.warn('[contact form]', err.code || 'unknown', err.message);
      setResult({ code: err.code, detail: import.meta.env.DEV ? err.message : '' });
      setStatus('error');
    }
  };

  const field = (key, label, input, extra) => (
    <div className={`field${errors[key] ? ' invalid' : ''}`}>
      <label htmlFor={`${id}-${key}`} id={`${id}-${key}-label`}>{label} *</label>
      {input}
      {(errors[key] || extra) && (
        <div className="fmeta">
          {errors[key] ? <span className="ferr" id={`${id}-${key}-err`}>{errors[key]}</span> : <span />}
          {extra}
        </div>
      )}
    </div>
  );
  const a11y = (key) => ({
    id: `${id}-${key}`,
    'aria-invalid': errors[key] ? true : undefined,
    'aria-describedby': errors[key] ? `${id}-${key}-err` : undefined,
    'aria-required': true,
    onBlur: blur(key),
  });

  const sending = status === 'sending';
  const msgLen = form.message.trim().length;
  const err = status === 'error' && result ? errorText(result.code, result.info) : null;

  return (
    <form className="cform" noValidate onSubmit={onSubmit} aria-busy={sending}>
      <h3>Send Us A Message</h3>
      <p className="fnote">Fields marked * are required.</p>
      <div className="two">
        {field('name', 'Name', (
          <input {...a11y('name')} autoComplete="name" maxLength={LIMITS.nameMax + 20} value={form.name} onChange={set('name')} />
        ))}
        {field('email', 'Your Email', (
          <input {...a11y('email')} type="email" inputMode="email" autoComplete="email" autoCapitalize="off" spellCheck={false}
            maxLength={LIMITS.emailMax} value={form.email} onChange={set('email')} />
        ))}
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
      {field('message', 'Message', (
        <textarea {...a11y('message')} maxLength={LIMITS.messageMax + 200} value={form.message} onChange={set('message')} />
      ), (
        <span className={`fcount${msgLen > LIMITS.messageMax ? ' over' : ''}`} aria-hidden="true">
          {msgLen}/{LIMITS.messageMax}
        </span>
      ))}

      {/* Spam trap: hidden from people, bots tend to fill it in */}
      <div hidden>
        <label htmlFor={`${id}-honey`}>Leave this empty</label>
        <input id={`${id}-honey`} tabIndex={-1} autoComplete="off" value={form.honey} onChange={set('honey')} />
      </div>

      <Button type="submit" arrow={!sending} className="submit" disabled={sending}>
        {sending ? 'Sending…' : 'Send Message'}
      </Button>

      <div className="flive" aria-live="polite">
        {status === 'sent' && result && (
          <div className="fstatus ok" role="status">
            <b>Thanks, your message has been sent.</b>
            <span>
              We'll reply to {result.sentTo} as soon as we can.
              {result.remaining === 0 && <> That was your last message for today from this address.</>}
              {result.remaining > 0 && result.remaining < DAILY_LIMIT - 1 && (
                <> You can send {result.remaining} more {result.remaining === 1 ? 'message' : 'messages'} from this address today.</>
              )}
            </span>
            {/* shrinks over 5 seconds, then the message goes away */}
            <i className="ftimer" style={{ animationDuration: `${SUCCESS_MS}ms` }} aria-hidden="true" />
          </div>
        )}
        {err && (
          <div className="fstatus err" role="alert">
            <b>{err.title}</b>
            <span>{err.body}</span>
            {result.detail && <small className="fdev">Dev only: {result.detail}</small>}
          </div>
        )}
      </div>

      <p className="fnote">
        Your message is delivered to our team inbox and used only to reply to you. Each email address can send up to{' '}
        {DAILY_LIMIT} messages per day. See our <a href="#privacy">privacy policy</a>.
      </p>
    </form>
  );
}
