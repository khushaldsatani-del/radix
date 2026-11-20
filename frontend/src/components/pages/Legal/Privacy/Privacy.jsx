import { CONTACT } from '@/data/content';

export default function Privacy() {
  return (
    <>
      <section><h2>1. Controller</h2><p>Radix (Planspiel team), Khushal Satani, Technische Universität Chemnitz, Straße der Nationen 62, 09111 Chemnitz, Germany. Email: {CONTACT.business} (or {CONTACT.support} for general questions).</p></section>
      <section><h2>2. Overview</h2><p>We keep data collection to a minimum. This website sets no cookies and uses no analytics or tracking tools. The contact form and the Radix Assistant chat run entirely in your browser and send nothing to any server.</p></section>
      <section>
        <h2>3. Hosting And Server Log Files</h2>
        <p>This website is hosted by Vercel Inc., 440 N Barranca Ave #4133, Covina, CA 91723, USA. When you visit it, the hosting provider automatically records your IP address, the date and time of the request, the page requested, the referring page, and your browser and operating system.</p>
        <p>This data is needed to deliver the website securely and is not merged with other data. Legal basis: Art. 6 (1) (f) GDPR. Data may be processed in the USA; such transfers are safeguarded under Art. 44 et seq. GDPR, in particular by the EU Standard Contractual Clauses.</p>
      </section>
      <section><h2>4. Fonts</h2><p>Fonts are loaded from Google Fonts. When a page loads, your browser connects to Google's servers and transmits your IP address. Legal basis: Art. 6 (1) (f) GDPR.</p></section>
      <section><h2>5. Contacting Us By Email</h2><p>If you email us, we process your email address and message solely to answer your enquiry (Art. 6 (1) (b) GDPR where it relates to a contract, otherwise Art. 6 (1) (f) GDPR) and delete them once they are no longer needed.</p></section>
      <section><h2>6. External Links</h2><p>Our website links to external services such as Instagram, GitHub and LinkedIn. No data is transferred to them unless you click such a link; from then on, the privacy policy of the respective provider applies.</p></section>
      <section><h2>7. Your Rights</h2><p>You have the right to access (Art. 15), correction (Art. 16), deletion (Art. 17), restriction (Art. 18), data portability (Art. 20) and objection (Art. 21). Contact {CONTACT.business}. You may also lodge a complaint with a data protection supervisory authority (Art. 77 GDPR).</p></section>
    </>
  );
}
