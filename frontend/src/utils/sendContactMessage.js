import { CONTACT } from '@/data/content';

/**
 * Sends the contact form to the team inbox through FormSubmit (https://formsubmit.co),
 * a free form-to-email service, so the site needs no backend of its own.
 *
 * One-time setup: the first message sent triggers an "Activate Form" email to
 * CONTACT.email. Click the link in it once; every message after that is delivered.
 * Until then FormSubmit answers { success: "false", message: "This form needs Activation..." }.
 *
 * Failures throw a ContactError whose `code` tells the form which message to show.
 */
const ENDPOINT = `https://formsubmit.co/ajax/${CONTACT.email}`;
export const TIMEOUT_MS = 15000;

export class ContactError extends Error {
  /** code: 'offline' | 'timeout' | 'network' | 'activation' | 'busy' | 'server' | 'rejected' */
  constructor(code, detail = '') {
    super(detail || code);
    this.name = 'ContactError';
    this.code = code;
  }
}

export async function sendContactMessage({ name, email, topic, message, honey }, { fetchImpl = fetch, timeoutMs = TIMEOUT_MS } = {}) {
  // Bots that fill the hidden field get a fake success and nothing is sent
  if (honey) return;
  if (typeof navigator !== 'undefined' && navigator.onLine === false) throw new ContactError('offline');

  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), timeoutMs);
  let res;
  try {
    res = await fetchImpl(ENDPOINT, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
      signal: controller.signal,
      body: JSON.stringify({
        name,
        email,
        topic,
        message,
        _subject: `[Radix website] ${topic} from ${name}`,
        _replyto: email, // "Reply" in the inbox goes straight to the visitor
        _template: 'table',
        _captcha: 'false',
      }),
    });
  } catch (err) {
    if (err?.name === 'AbortError') throw new ContactError('timeout');
    if (typeof navigator !== 'undefined' && navigator.onLine === false) throw new ContactError('offline');
    throw new ContactError('network', err?.message);
  } finally {
    clearTimeout(timer);
  }

  const data = await res.json().catch(() => ({}));
  const detail = String(data.message || '');
  if (res.status === 429) throw new ContactError('busy', detail);
  if (res.status >= 500) throw new ContactError('server', detail || `HTTP ${res.status}`);
  if (res.ok && String(data.success) === 'true') return;
  if (/activat/i.test(detail)) throw new ContactError('activation', detail);
  throw new ContactError('rejected', detail || `HTTP ${res.status}`);
}
