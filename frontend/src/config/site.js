// Company and legal details used across the site (top banner, footer, Imprint, Privacy Policy).
// Every value in [square brackets] is a placeholder that must be replaced before going live.
// `isPlaceholder` lets the UI flag anything still unfilled.

export const isPlaceholder = (value) => /^\[.*\]$/.test(String(value).trim())

export const SITE = {
  name: 'Radix',
  url: 'https://radix-it.vercel.app',

  // Disclaimer required by the Planspiel guidelines: top of every page, the footer and the Imprint.
  disclaimer:
    'This website was developed as part of the Planspiel Web Engineering project at Chemnitz University of Technology and is not affiliated with an actual company.',

  // Project credit line in the footer.
  project: 'Chemnitz, Germany · Planspiel Web Engineering WS 2026/27',

  // Team inbox used for "Start a project", the footer and both legal pages.
  email: '[team email address]',

  // Social profiles shown as icons in the footer. Leave empty until the links are ready;
  // an empty one still shows its icon but isn't clickable.
  social: {
    instagram: '',
    github: '',
    linkedin: '',
  },

  // Imprint (Impressum): the person responsible for the site's content.
  imprint: {
    contactPerson: '[Full name of the contact person]',
    organisation: 'Radix (Planspiel team)',
    // Leave as-is if your guidelines don't require a postal address; it is hidden while it's a placeholder.
    address: ['[Street and number]', '[Postcode and city]', '[Country]'],
  },

  // Where the site is hosted, named in the Privacy Policy.
  hosting: {
    provider: 'Vercel Inc.',
    address: '440 N Barranca Ave #4133, Covina, CA 91723, USA',
    privacyUrl: 'https://vercel.com/legal/privacy-policy',
  },

  privacyLastUpdated: 'November 2026',
}
