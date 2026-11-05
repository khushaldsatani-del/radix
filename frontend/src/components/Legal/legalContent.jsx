import { SITE, isPlaceholder } from '../../config/site.js'

const { imprint, hosting } = SITE
const address = imprint.address.filter((line) => !isPlaceholder(line))
const emailLink = <a href={`mailto:${SITE.email}`}>{SITE.email}</a>
const supportLink = <a href={`mailto:${SITE.supportEmail}`}>{SITE.supportEmail}</a>

// Imprint (Impressum) and Privacy Policy copy. Names, email and address come from config/site.js.
export const LEGAL_PAGES = {
  '/imprint': {
    label: 'Legal',
    title: 'Imprint',
    sections: [
      {
        heading: 'Information pursuant to § 5 DDG',
        body: (
          <>
            <p>
              {imprint.organisation}
              <br />
              {imprint.contactPerson}
              {address.map((line) => (
                <span key={line}>
                  <br />
                  {line}
                </span>
              ))}
            </p>
          </>
        ),
      },
      {
        heading: 'Contact',
        body: (
          <p>
            Business enquiries: {emailLink}
            <br />
            General contact and support: {supportLink}
          </p>
        ),
      },
      {
        heading: 'Responsible for content pursuant to § 18 (2) MStV',
        body: <p>{imprint.contactPerson}</p>,
      },
      {
        heading: 'Disclaimer',
        body: <p>{SITE.disclaimer}</p>,
      },
      {
        heading: 'Liability for links',
        body: (
          <p>
            This website contains links to external websites, such as our Instagram, GitHub and LinkedIn profiles. We have no influence over their
            content and accept no liability for it; the respective provider is always responsible. If we become
            aware of any legal violations, we will remove such links immediately.
          </p>
        ),
      },
    ],
  },

  '/privacy': {
    label: 'Legal',
    title: 'Privacy Policy',
    intro: `Last updated: ${SITE.privacyLastUpdated}`,
    sections: [
      {
        heading: '1. Controller',
        body: (
          <p>
            The controller responsible for data processing on this website under the General Data Protection
            Regulation (GDPR) is:
            <br />
            {imprint.organisation}, {imprint.contactPerson}
            {address.length > 0 && `, ${address.join(', ')}`}
            <br />
            Email: {emailLink} (or {supportLink} for general questions)
          </p>
        ),
      },
      {
        heading: '2. Overview',
        body: (
          <p>
            We keep data collection to a minimum. This website sets no cookies, uses no analytics or tracking tools,
            contains no contact forms and loads no content from third parties. The only personal data processed is
            what is technically necessary to deliver the website and anything you choose to send us by email.
          </p>
        ),
      },
      {
        heading: '3. Hosting and server log files',
        body: (
          <>
            <p>
              This website is hosted by {hosting.provider}, {hosting.address}. When you visit it, the hosting
              provider automatically records information in server log files, such as your IP address, the date and
              time of the request, the page requested, the referring page, and your browser and operating system.
            </p>
            <p>
              This data is needed to deliver the website securely and reliably and is not merged with other data.
              The legal basis is Art. 6 (1) (f) GDPR; our legitimate interest is a stable and secure website. Data may
              be processed in the USA; such transfers are safeguarded under Art. 44 et seq. GDPR, in particular by
              the EU Standard Contractual Clauses. For details, see the{' '}
              <a href={hosting.privacyUrl} target="_blank" rel="noreferrer">
                provider&apos;s privacy policy
              </a>
              .
            </p>
          </>
        ),
      },
      {
        heading: '4. Fonts',
        body: (
          <p>
            The fonts on this website (Inter Tight and Space Mono) are hosted locally on our own server. No
            connection is made to Google or any other font provider when you visit the site.
          </p>
        ),
      },
      {
        heading: '5. Contacting us by email',
        body: (
          <p>
            If you email us, we process your email address and the content of your message solely to answer your
            enquiry. The legal basis is Art. 6 (1) (b) GDPR where your enquiry relates to a contract, and otherwise
            Art. 6 (1) (f) GDPR. We delete the data once it is no longer needed for this purpose, unless legal
            retention obligations apply.
          </p>
        ),
      },
      {
        heading: '6. External links',
        body: (
          <p>
            Our website links to external services such as Instagram, GitHub and LinkedIn. No data is transferred to them unless you click
            such a link; from then on, the privacy policy of the respective provider applies.
          </p>
        ),
      },
      {
        heading: '7. Your rights',
        body: (
          <p>
            You have the right to access your personal data (Art. 15 GDPR), to have it corrected (Art. 16) or
            deleted (Art. 17), to restrict its processing (Art. 18), to data portability (Art. 20), and to object to
            processing based on legitimate interests (Art. 21). To exercise these rights, contact us at {emailLink}.
            You also have the right to lodge a complaint with a data protection supervisory authority (Art. 77 GDPR).
          </p>
        ),
      },
      {
        heading: '8. Changes to this policy',
        body: (
          <p>
            We may update this Privacy Policy when the website or legal requirements change. The current version
            is always available on this page.
          </p>
        ),
      },
    ],
  },
}
