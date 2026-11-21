import { describe, expect, it } from 'vitest';
import { normalizeEmail, validateContactForm, validateEmail, validateMessage, validateName } from '../validation';

const ok = (v) => expect(v).toBe('');

describe('validateEmail', () => {
  it.each([
    'khushal.satani@gmail.com',
    'khushal+radix@gmail.com',
    'contact.radixit@gmail.com',
    'anna.mueller@tu-chemnitz.de',
    'max_power99@web.de',
    'team@radix.io',
    'John.Doe@Outlook.com',
    'a1b2c3@company.co.uk',
    'priya@startup.in',
    'dev@my-site.app',
    'x@example.xyz',
    // real providers that are one letter away from a popular one must not be flagged
    'anna@mail.com',
    'anna@email.com',
    'anna@web.de',
    'anna@gmx.de',
    'anna@gmx.net',
    'anna@me.com',
    'anna@ymail.com',
    'anna@live.com',
    'anna@aol.com',
    'anna@t-online.de',
    'anna@yahoo.co.uk',
  ])('accepts %s', (email) => ok(validateEmail(email)));

  it.each([
    ['khushal.d.satani@gail.com', 'gmail.com'],
    ['khushal.d.satani@gmal.com', 'gmail.com'],
    ['khushal.d.satani@gmai.com', 'gmail.com'],
    ['khushal.d.satani@gmaill.com', 'gmail.com'],
    ['khushal.d.satani@gamil.com', 'gmail.com'],
    ['khushal.d.satani@gmial.com', 'gmail.com'],
    ['khushal.d.satani@gnail.com', 'gmail.com'],
    ['khushal.d.satani@gmail.cm', 'gmail.com'],
    ['khushal.d.satani@gmail.om', 'gmail.com'],
    ['khushal.d.satani@gmaik.com', 'gmail.com'],
    ['anna@yaho.com', 'yahoo.com'],
    ['anna@yahooo.com', 'yahoo.com'],
    ['anna@hotmal.com', 'hotmail.com'],
    ['anna@hotmial.com', 'hotmail.com'],
    ['anna@hotmail.de.com', null],
    ['anna@outlok.com', 'outlook.com'],
    ['anna@iclod.com', 'icloud.com'],
    ['anna@wbe.de', 'web.de'],
    ['anna@gmx.ed', 'gmx.de'],
  ])('suggests a fix for %s', (email, fixed) => {
    const err = validateEmail(email);
    expect(err).not.toBe('');
    if (fixed) expect(err).toContain(`@${fixed}?`);
  });

  it.each([
    ['', /enter your email/],
    ['   ', /enter your email/],
    ['123@gmail.com', /at least one letter/],
    ['1@gmail.ii', /at least one letter/],
    ['abc@gmail.ii', /"\.ii" is not a real domain ending/],
    ['john@company.con', /"\.con" is not a real domain ending/],
    ['john@company.c', /"\.c" is not a real domain ending/],
    ['john@company.123', /not a real domain ending/],
    ['john@gmail.co', /Did you mean john@gmail\.com\?/],
    ['john.doe@gmial.com', /Did you mean john\.doe@gmail\.com\?/],
    ['john@hotmial.com', /Did you mean john@hotmail\.com\?/],
    ['john@yahoo.cm', /Did you mean john@yahoo\.com\?/],
    ['plainaddress', /full email address/],
    ['john@', /full email address/],
    ['@gmail.com', /full email address/],
    ['john@@gmail.com', /full email address/],
    ['jo hn@gmail.com', /cannot contain spaces/],
    ['john@localhost', /not a valid domain/],
    ['john@-site.com', /not a valid domain/],
    ['john@site..com', /not a valid domain/],
    ['.john@site.com', /start or end with a dot/],
    ['john.@site.com', /start or end with a dot/],
    ['jo..hn@site.com', /two dots in a row/],
    ['jo(hn)@site.com', /can only use letters/],
    ['john@mailinator.com', /permanent email address/],
    ['abc@gmail.com', /Gmail addresses have 6 to 30/],
    [`${'a'.repeat(65)}@site.com`, /too long/],
  ])('rejects %s', (email, msg) => expect(validateEmail(email)).toMatch(msg));
});

describe('validateName', () => {
  it.each(['Khushal', 'Khushal Satani', 'Yi Li', "O'Brien", 'Anne-Marie', 'José Müller', 'Dr. Priya', '  Rohan  '])(
    'accepts %s', (n) => ok(validateName(n)),
  );
  it.each([
    ['', /enter your name/],
    ['A', /at least 2 letters/],
    ['R2D2', /should not contain numbers/],
    ['John_Smith', /can only contain letters/],
    ['<script>', /can only contain letters/],
    ['--', /can only contain letters/],
    ['a'.repeat(61), /at most 60/],
  ])('rejects %s', (n, msg) => expect(validateName(n)).toMatch(msg));
});

describe('validateMessage', () => {
  it('accepts a normal message', () => ok(validateMessage('Hello Radix, I would like to know more about your assistant.')));
  it('requires text', () => expect(validateMessage('   ')).toMatch(/write a message/));
  it('requires at least 10 characters', () => expect(validateMessage('Hi there')).toMatch(/at least 10/));
  it('limits to 2000 characters', () => expect(validateMessage('a'.repeat(2001))).toMatch(/at most 2000/));
});

describe('validateContactForm', () => {
  it('returns only failing fields', () => {
    expect(validateContactForm({ name: 'Khushal', email: '123@gmail.com', message: 'Hello, this is a test.' })).toEqual({
      email: expect.stringMatching(/at least one letter/),
    });
  });
  it('returns {} for a valid form', () => {
    expect(validateContactForm({ name: 'Khushal', email: 'khushal.satani@gmail.com', message: 'Hello, this is a test.' })).toEqual({});
  });
});

describe('normalizeEmail', () => {
  it('ignores case, +tags and Gmail dots', () => {
    expect(normalizeEmail('K.Satani+radix@Gmail.com')).toBe('ksatani@gmail.com');
    expect(normalizeEmail('k.satani@googlemail.com')).toBe('ksatani@gmail.com');
    expect(normalizeEmail('anna.m+x@web.de')).toBe('anna.m@web.de');
  });
});
