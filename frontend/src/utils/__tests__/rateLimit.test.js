import { describe, expect, it } from 'vitest';
import { checkDailyLimit, DAILY_LIMIT, recordSend, WINDOW_MS } from '../rateLimit';

const memoryStorage = () => {
  const m = new Map();
  return { getItem: (k) => (m.has(k) ? m.get(k) : null), setItem: (k, v) => m.set(k, String(v)), dump: () => Object.fromEntries(m) };
};

describe('daily send limit', () => {
  it(`allows ${DAILY_LIMIT} sends per email in 24 hours, then blocks`, async () => {
    const storage = memoryStorage();
    const t0 = Date.UTC(2026, 10, 21, 9, 0);
    for (let i = 0; i < DAILY_LIMIT; i++) {
      const s = await checkDailyLimit('anna@web.de', { storage, now: t0 + i * 60000 });
      expect(s).toMatchObject({ allowed: true, used: i, remaining: DAILY_LIMIT - i });
      await recordSend('anna@web.de', { storage, now: t0 + i * 60000 });
    }
    const blocked = await checkDailyLimit('anna@web.de', { storage, now: t0 + 10 * 60000 });
    expect(blocked).toMatchObject({ allowed: false, used: DAILY_LIMIT, remaining: 0 });
    // the first send expires first
    expect(blocked.resetAt).toBe(t0 + WINDOW_MS);
  });

  it('allows sending again once the oldest send is 24 hours old', async () => {
    const storage = memoryStorage();
    const t0 = Date.UTC(2026, 10, 21, 9, 0);
    for (let i = 0; i < DAILY_LIMIT; i++) await recordSend('anna@web.de', { storage, now: t0 + i * 3600000 });
    expect((await checkDailyLimit('anna@web.de', { storage, now: t0 + WINDOW_MS - 1 })).allowed).toBe(false);
    expect(await checkDailyLimit('anna@web.de', { storage, now: t0 + WINDOW_MS + 1 })).toMatchObject({ allowed: true, used: DAILY_LIMIT - 1 });
  });

  it('counts each email address separately', async () => {
    const storage = memoryStorage();
    const now = Date.now();
    for (let i = 0; i < DAILY_LIMIT; i++) await recordSend('anna@web.de', { storage, now });
    expect((await checkDailyLimit('anna@web.de', { storage, now })).allowed).toBe(false);
    expect((await checkDailyLimit('max@web.de', { storage, now })).allowed).toBe(true);
  });

  it('cannot be bypassed with capital letters, +tags or Gmail dots', async () => {
    const storage = memoryStorage();
    const now = Date.now();
    for (const e of ['khushal.satani@gmail.com', 'KhushalSatani@gmail.com', 'khushal.satani+1@gmail.com', 'k.h.u.s.h.a.l.satani@Gmail.com', 'khushalsatani+x@googlemail.com']) {
      await recordSend(e, { storage, now });
    }
    expect((await checkDailyLimit('khushalsatani@gmail.com', { storage, now })).allowed).toBe(false);
  });

  it('stores only a hash, never the email address', async () => {
    const storage = memoryStorage();
    await recordSend('secret.person@web.de', { storage, now: Date.now() });
    const raw = JSON.stringify(storage.dump());
    expect(raw).not.toMatch(/secret|web\.de/);
    expect(raw).toMatch(/[0-9a-f]{64}/);
  });

  it('still works when storage is unavailable or corrupt', async () => {
    expect((await checkDailyLimit('anna@web.de', { storage: null })).allowed).toBe(true);
    await expect(recordSend('anna@web.de', { storage: null })).resolves.toBeUndefined();
    const broken = { getItem: () => '{not json', setItem: () => { throw new Error('QuotaExceeded'); } };
    expect((await checkDailyLimit('anna@web.de', { storage: broken })).allowed).toBe(true);
    await expect(recordSend('anna@web.de', { storage: broken })).resolves.toBeUndefined();
  });
});
