import { normalizeEmail } from './validation';

/*
 * Daily limit: one email address may send at most DAILY_LIMIT messages per 24 hours.
 *
 * The site has no server of its own, so the count is kept in this browser's localStorage.
 * Only a SHA-256 fingerprint of the (normalised) address is stored, never the address itself,
 * and entries older than 24 hours are dropped. It stops repeated sends from the same browser;
 * enforcing it across devices would need a backend with a database.
 */
export const DAILY_LIMIT = 5;
export const WINDOW_MS = 24 * 60 * 60 * 1000;
const KEY = 'radix.contact.sends.v1';

const defaultStorage = () => {
  try { return window.localStorage; } catch { return null; }
};

async function fingerprint(email) {
  const bytes = new TextEncoder().encode(`radix-contact:${normalizeEmail(email)}`);
  const hash = await crypto.subtle.digest('SHA-256', bytes);
  return Array.from(new Uint8Array(hash), (b) => b.toString(16).padStart(2, '0')).join('');
}

function load(storage, now) {
  let data = {};
  try { data = JSON.parse(storage?.getItem(KEY) || '{}') || {}; } catch { data = {}; }
  // keep only sends inside the 24-hour window
  for (const k of Object.keys(data)) {
    data[k] = Array.isArray(data[k]) ? data[k].filter((t) => typeof t === 'number' && now - t < WINDOW_MS) : [];
    if (!data[k].length) delete data[k];
  }
  return data;
}

function save(storage, data) {
  try { storage?.setItem(KEY, JSON.stringify(data)); } catch { /* storage full or blocked: limit not enforced */ }
}

/** { allowed, used, remaining, resetAt } for this address right now. */
export async function checkDailyLimit(email, { storage = defaultStorage(), now = Date.now() } = {}) {
  const sends = load(storage, now)[await fingerprint(email)] || [];
  const used = sends.length;
  return {
    allowed: used < DAILY_LIMIT,
    used,
    remaining: Math.max(0, DAILY_LIMIT - used),
    // the oldest send in the window expires first
    resetAt: used ? Math.min(...sends) + WINDOW_MS : null,
  };
}

/** Records one successful send for this address. */
export async function recordSend(email, { storage = defaultStorage(), now = Date.now() } = {}) {
  const data = load(storage, now);
  const key = await fingerprint(email);
  data[key] = [...(data[key] || []), now];
  save(storage, data);
}
