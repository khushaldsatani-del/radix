import { describe, expect, it, vi } from 'vitest';
import { sendContactMessage } from '../sendContactMessage';

const msg = { name: 'Anna', email: 'anna@web.de', topic: 'Other', message: 'Hello there, Radix!' };
const reply = (status, body) => vi.fn().mockResolvedValue({ ok: status >= 200 && status < 300, status, json: async () => body });
const code = (p) => p.then(() => 'resolved', (e) => e.code);

describe('sendContactMessage', () => {
  it('posts the message to FormSubmit', async () => {
    const fetchImpl = reply(200, { success: 'true' });
    await sendContactMessage(msg, { fetchImpl });
    const [url, init] = fetchImpl.mock.calls[0];
    expect(url).toBe('https://formsubmit.co/ajax/contact.radixit@gmail.com');
    expect(JSON.parse(init.body)).toMatchObject({ name: 'Anna', email: 'anna@web.de', _replyto: 'anna@web.de', topic: 'Other' });
  });

  it('sends nothing when the spam trap is filled', async () => {
    const fetchImpl = vi.fn();
    await sendContactMessage({ ...msg, honey: 'bot' }, { fetchImpl });
    expect(fetchImpl).not.toHaveBeenCalled();
  });

  it.each([
    ['activation', 200, { success: 'false', message: 'This form needs Activation. We\'ve sent you an email...' }],
    ['busy', 429, {}],
    ['server', 503, {}],
    ['rejected', 200, { success: 'false', message: 'Something else' }],
    ['rejected', 400, {}],
  ])('maps the reply to "%s"', async (expected, status, body) => {
    expect(await code(sendContactMessage(msg, { fetchImpl: reply(status, body) }))).toBe(expected);
  });

  it('reports a network failure', async () => {
    const fetchImpl = vi.fn().mockRejectedValue(new TypeError('Failed to fetch'));
    expect(await code(sendContactMessage(msg, { fetchImpl }))).toBe('network');
  });

  it('gives up after the timeout', async () => {
    const fetchImpl = vi.fn((_, { signal }) => new Promise((_r, reject) => signal.addEventListener('abort', () => reject(Object.assign(new Error('aborted'), { name: 'AbortError' })))));
    expect(await code(sendContactMessage(msg, { fetchImpl, timeoutMs: 20 }))).toBe('timeout');
  });

  it('reports offline without trying to send', async () => {
    const fetchImpl = vi.fn();
    vi.stubGlobal('navigator', { onLine: false });
    try {
      expect(await code(sendContactMessage(msg, { fetchImpl }))).toBe('offline');
      expect(fetchImpl).not.toHaveBeenCalled();
    } finally {
      vi.unstubAllGlobals();
    }
  });
});
