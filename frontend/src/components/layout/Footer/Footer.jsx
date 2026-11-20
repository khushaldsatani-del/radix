import Brand from '@/components/common/Brand/Brand';
import { CONTACT, DISCLAIMER } from '@/data/content';
import './Footer.css';

export default function Footer() {
  return (
    <footer className="site-footer">
      <div className="wrap">
        <div className="foot-grid">
          <div>
            <Brand />
            <p className="foot-tag">Engineered from the source. Eight minds, one root.</p>
          </div>
          <div>
            <h4>Company</h4>
            <ul><li><a href="#about">About</a></li><li><a href="#team">Team</a></li><li><a href="#updates">Updates</a></li></ul>
          </div>
          <div>
            <h4>Contact</h4>
            <ul><li><a href={`mailto:${CONTACT.business}`}>{CONTACT.business}</a></li><li>{CONTACT.location}</li></ul>
          </div>
          <div>
            <h4>Legal</h4>
            <ul><li><a href="#imprint">Imprint</a></li><li><a href="#privacy">Privacy Policy</a></li></ul>
          </div>
        </div>
        <p className="official">{DISCLAIMER}</p>
        <div className="copyline mono"><span>© {new Date().getFullYear()} Radix · University Project</span></div>
      </div>
    </footer>
  );
}
