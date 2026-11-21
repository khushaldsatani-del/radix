import { TLDS } from '@/data/tlds';

/*
 * Contact-form validation. Every function returns '' when the value is fine, otherwise a
 * message written for the visitor. Kept free of React so it can be unit-tested.
 */

export const LIMITS = { nameMin: 2, nameMax: 60, emailMax: 254, messageMin: 10, messageMax: 2000 };

// ---------- Name ----------

// letters (any language) and combining marks, plus space ' - . between them
const NAME_RE = /^[\p{L}\p{M}]+(?:[ '’.-]+[\p{L}\p{M}]+)*\.?$/u;

export function validateName(raw) {
  const name = raw.trim().replace(/\s+/g, ' ');
  if (!name) return 'Please enter your name.';
  if (/\d/.test(name)) return 'Your name should not contain numbers.';
  if (!NAME_RE.test(name)) return 'Your name can only contain letters, spaces, hyphens, apostrophes and dots.';
  if ((name.match(/[\p{L}]/gu) || []).length < LIMITS.nameMin) return `Your name should be at least ${LIMITS.nameMin} letters long.`;
  if (name.length > LIMITS.nameMax) return `Your name can be at most ${LIMITS.nameMax} characters.`;
  return '';
}

// ---------- Email ----------

// Big providers: only their real domains are accepted, typos get a suggestion
const PROVIDERS = {
  gmail: ['gmail.com'],
  googlemail: ['googlemail.com'],
  yahoo: ['yahoo.com', 'yahoo.de', 'yahoo.co.uk', 'yahoo.in', 'yahoo.fr', 'yahoo.it', 'yahoo.es', 'yahoo.co.in', 'yahoo.ca', 'yahoo.com.au'],
  hotmail: ['hotmail.com', 'hotmail.de', 'hotmail.co.uk', 'hotmail.fr', 'hotmail.it', 'hotmail.es'],
  outlook: ['outlook.com', 'outlook.de', 'outlook.fr', 'outlook.in'],
  live: ['live.com', 'live.de', 'live.co.uk', 'live.in'],
  icloud: ['icloud.com'],
  proton: ['proton.me'],
  protonmail: ['protonmail.com'],
};
const LABEL_TYPOS = {
  gmial: 'gmail', gmal: 'gmail', gmai: 'gmail', gamil: 'gmail', gnail: 'gmail', gmaill: 'gmail', gmali: 'gmail', gmil: 'gmail', gemail: 'gmail',
  yaho: 'yahoo', yahooo: 'yahoo', yhoo: 'yahoo',
  hotmial: 'hotmail', hotmal: 'hotmail', hotmil: 'hotmail', hotamil: 'hotmail', hotmai: 'hotmail',
  outlok: 'outlook', outloo: 'outlook', outllok: 'outlook', otlook: 'outlook',
  iclod: 'icloud', icoud: 'icloud', iclud: 'icloud',
};
// Throwaway inboxes we can't reply to reliably
const DISPOSABLE = new Set([
  'mailinator.com', 'guerrillamail.com', 'guerrillamail.net', '10minutemail.com', 'tempmail.com', 'temp-mail.org',
  'yopmail.com', 'trashmail.com', 'getnada.com', 'sharklasers.com', 'dispostable.com', 'maildrop.cc', 'throwawaymail.com',
  'fakeinbox.com', 'mintemail.com', 'mohmal.com', 'emailondeck.com', 'tempail.com',
]);

const LOCAL_CHARS = /^[a-z0-9._%+-]+$/i;
const DOMAIN_LABEL = /^[a-z0-9](?:[a-z0-9-]{0,61}[a-z0-9])?$/i;

export function validateEmail(raw) {
  const email = raw.trim();
  if (!email) return 'Please enter your email address.';
  if (/\s/.test(email)) return 'Email addresses cannot contain spaces.';
  if (email.length > LIMITS.emailMax) return 'That email address is too long.';
  const at = email.split('@');
  if (at.length !== 2 || !at[0] || !at[1]) return 'Please enter a full email address, like name@example.com.';

  const [local, domainRaw] = at;
  const domain = domainRaw.toLowerCase();

  // Part before the @
  if (local.length > 64) return 'The part before the @ is too long.';
  if (!LOCAL_CHARS.test(local)) return 'The part before the @ can only use letters, numbers and . _ % + -';
  if (/^[.]|[.]$|\.\./.test(local)) return 'The part before the @ cannot start or end with a dot, or have two dots in a row.';
  if (!/[a-z]/i.test(local)) return 'The part before the @ must include at least one letter.';

  // Part after the @
  const labels = domain.split('.');
  if (labels.length < 2 || labels.some((l) => !DOMAIN_LABEL.test(l))) {
    return 'The part after the @ is not a valid domain. It should look like example.com.';
  }
  const tld = labels[labels.length - 1];
  if (!/^[a-z]{2,}$/.test(tld) || !TLDS.has(tld)) {
    return `".${tld}" is not a real domain ending. Please check the part after the last dot (for example .com or .de).`;
  }

  // Big providers: typo in the name, or a domain they don't use (gmail.co, gmail.ii ...)
  const name = LABEL_TYPOS[labels[0]] || labels[0];
  if (PROVIDERS[name] && !PROVIDERS[name].includes(domain)) {
    return `Did you mean ${local}@${PROVIDERS[name][0]}?`;
  }
  if (DISPOSABLE.has(domain)) return 'Please use a permanent email address, not a temporary one, so we can reply.';

  // Gmail's own username rules: 6-30 letters, numbers or dots (a +tag is allowed)
  if (domain === 'gmail.com' || domain === 'googlemail.com') {
    const user = local.split('+')[0].replace(/\./g, '');
    if (!/^[a-z0-9]+$/i.test(user) || user.length < 6 || user.length > 30) {
      return 'Gmail addresses have 6 to 30 letters, numbers or dots before the @.';
    }
  }
  return '';
}

// ---------- Message ----------

export function validateMessage(raw) {
  const msg = raw.trim();
  if (!msg) return 'Please write a message.';
  if (msg.length < LIMITS.messageMin) return `Please write a little more (at least ${LIMITS.messageMin} characters).`;
  if (msg.length > LIMITS.messageMax) return `Your message is too long (at most ${LIMITS.messageMax} characters).`;
  return '';
}

/** All fields at once: { name, email, message } -> { field: error } (only failing fields). */
export function validateContactForm({ name, email, message }) {
  const errors = { name: validateName(name), email: validateEmail(email), message: validateMessage(message) };
  return Object.fromEntries(Object.entries(errors).filter(([, v]) => v));
}

/**
 * Canonical form of an address for counting sends: lower case, +tag removed and, for
 * Gmail, dots removed (Gmail ignores them), so a.b+x@gmail.com counts as ab@gmail.com.
 */
export function normalizeEmail(raw) {
  const [local = '', domain = ''] = raw.trim().toLowerCase().split('@');
  let user = local.split('+')[0];
  if (domain === 'gmail.com' || domain === 'googlemail.com') user = user.replace(/\./g, '');
  return `${user}@${domain === 'googlemail.com' ? 'gmail.com' : domain}`;
}
