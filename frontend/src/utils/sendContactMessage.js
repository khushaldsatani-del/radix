import { CONTACT } from '@/data/content';

/**
 * Sends the contact form to the team inbox through FormSubmit (https://formsubmit.co),
 * a free form-to-email service, so the site needs no backend of its own.
 *
 * One-time setup: the first message sent triggers an "Activate Form" email to
 * CONTACT.email. Click the link in it once; every message after that is delivered.
 * Until then FormSubmit answers { success: "false", message: "This form needs Activation..." }.
 */
const ENDPOINT = `https://formsubmit.co/ajax/${CONTACT.email}`;

export async function sendContactMessage({ name, email, topic, message, honey }) {
  // Bots that fill the hidden field get a fake success and nothing is sent
  if (honey) return;

  const res = await fetch(ENDPOINT, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
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

  const data = await res.json().catch(() => ({}));
  if (!res.ok || String(data.success) !== 'true') {
    throw new Error(data.message || `Send failed (${res.status})`);
  }
}
