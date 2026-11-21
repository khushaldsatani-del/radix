import { CONTACT, DISCLAIMER } from '@/data/content';

export default function Imprint() {
  return (
    <>
      <section><h2>Provider</h2><p>Radix (Planspiel team)<br />Khushal Satani<br />Technische Universität Chemnitz<br />Straße der Nationen 62<br />09111 Chemnitz, Germany</p></section>
      <section><h2>Contact</h2><p>Email: {CONTACT.email}</p></section>
      <section><h2>Responsible For Content</h2><p>Responsible for content pursuant to § 18 (2) MStV: Khushal Satani, address as above.</p></section>
      <section><h2>Disclaimer</h2><p>{DISCLAIMER}</p></section>
      <section><h2>Liability For Links</h2><p>This website links to external websites such as our Instagram, GitHub and LinkedIn profiles. We have no influence over their content and accept no liability for it; the respective provider is always responsible. If we become aware of any legal violations, we will remove such links immediately.</p></section>
    </>
  );
}
