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

  // Professional and business enquiries: the main address in the footer, Imprint and Privacy Policy.
  email: 'radix.team@gmail.com',
  // General contact and support.
  supportEmail: 'contact.radixit@gmail.com',

  // Social profiles shown as icons in the footer. An empty one is left out.
  social: {
    instagram: 'https://www.instagram.com/radix.it',
    github: 'https://github.com/Radix-it-08',
    linkedin: 'https://www.linkedin.com/in/radix-it',
  },

  // Imprint (Impressum): the person responsible for the site's content.
  imprint: {
    contactPerson: 'Khushal Satani',
    organisation: 'Radix (Planspiel team)',
    // The university hosting the Planspiel project, so no private address is published.
    address: ['Technische Universität Chemnitz', 'Straße der Nationen 62', '09111 Chemnitz', 'Germany'],
  },

  // Where the site is hosted, named in the Privacy Policy.
  hosting: {
    provider: 'Vercel Inc.',
    address: '440 N Barranca Ave #4133, Covina, CA 91723, USA',
    privacyUrl: 'https://vercel.com/legal/privacy-policy',
  },

  privacyLastUpdated: 'November 2026',
}
