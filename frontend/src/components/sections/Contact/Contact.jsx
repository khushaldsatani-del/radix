import { useRef } from 'react';
import Reveal from '@/components/common/Reveal/Reveal';
import RootCanvas from '@/components/common/RootCanvas/RootCanvas';
import { branchLayout } from '@/utils/rootSystem';
import ContactInfo from './ContactInfo/ContactInfo';
import ContactForm from './ContactForm/ContactForm';
import './Contact.css';

const ROOTS = {
  seed: 5, dur: 2600, alpha: 0.5, width: 1.4, nodeAlpha: 0.8, layout: branchLayout,
  colors: { line: '#2DB3A8', hi: '#7FE0D6', node: '#1B2B3C', dark: '#7FE0D6', glow: 'rgba(127,224,214,.25)' },
};

export default function Contact() {
  const wrapRef = useRef(null);
  return (
    <section className="chapter flush" id="contact" data-sec>
      <div className="wrap">
        {/* wrapRef is the pointer host so roots react anywhere over the block */}
        <div ref={wrapRef}>
          <Reveal className="contact-wrap">
            <RootCanvas className="contact-roots" options={ROOTS} hostRef={wrapRef} aria-hidden="true" />
            <ContactInfo />
            <div><ContactForm /></div>
          </Reveal>
        </div>
      </div>
    </section>
  );
}
