import { CONTACT } from '@/data/content';

export default function Privacy() {
  return (
    <>
      <section><h2>1. Controller</h2><p>Radix (Planspiel team), Khushal Satani, Technische Universität Chemnitz, Straße der Nationen 62, 09111 Chemnitz, Germany. Email: {CONTACT.email}.</p></section>
      <section><h2>2. Overview</h2><p>We keep data collection to a minimum. This website sets no cookies and uses no analytics or tracking tools. The Radix Assistant chat runs entirely in your browser and sends nothing to any server. The contact form only transmits data when you click "Send Message" (see section 5).</p></section>
      <section>
        <h2>3. Hosting And Server Log Files</h2>
        <p>This website is hosted by Vercel Inc., 440 N Barranca Ave #4133, Covina, CA 91723, USA. When you visit it, the hosting provider automatically records your IP address, the date and time of the request, the page requested, the referring page, and your browser and operating system.</p>
        <p>This data is needed to deliver the website securely and is not merged with other data. Legal basis: Art. 6 (1) (f) GDPR. Data may be processed in the USA; such transfers are safeguarded under Art. 44 et seq. GDPR, in particular by the EU Standard Contractual Clauses.</p>
      </section>
      <section><h2>4. Fonts</h2><p>All fonts are hosted on this website itself. Your browser does not connect to Google or any other font provider, and no data is transmitted to third parties for this purpose.</p></section>
      <section>
        <h2>5. Contact Form And Email</h2>
        <p>When you send the contact form, your name, email address, chosen topic and message are transmitted to the form-to-email service FormSubmit (formsubmit.co), which forwards them to our inbox {CONTACT.email}. The same data reaches us if you email us directly.</p>
        <p>We process this data solely to answer your enquiry (Art. 6 (1) (b) GDPR where it relates to a contract, otherwise Art. 6 (1) (f) GDPR) and delete it once it is no longer needed. FormSubmit may process data outside the EU; such transfers are subject to Art. 44 et seq. GDPR. If you prefer, you can email us directly instead of using the form.</p>
        <p>To prevent spam, each email address can send up to five messages per day through the form. For this, your browser's local storage keeps an anonymous fingerprint (a one-way hash) of the email address together with the time of sending. It never leaves your device, cannot be turned back into your address, and is deleted automatically after 24 hours. Legal basis: Art. 6 (1) (f) GDPR and § 25 (2) No. 2 TDDDG (strictly necessary to provide the contact form securely).</p>
      </section>
      <section><h2>6. External Links</h2><p>Our website links to external services such as Instagram, GitHub and LinkedIn. No data is transferred to them unless you click such a link; from then on, the privacy policy of the respective provider applies.</p></section>
      <section><h2>7. Your Rights</h2><p>You have the right to access (Art. 15), correction (Art. 16), deletion (Art. 17), restriction (Art. 18), data portability (Art. 20) and objection (Art. 21). Contact {CONTACT.email}. You may also lodge a complaint with a data protection supervisory authority (Art. 77 GDPR).</p></section>
    </>
  );
}
