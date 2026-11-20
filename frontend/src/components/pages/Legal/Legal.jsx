import ChapterLabel from '@/components/common/ChapterLabel/ChapterLabel';
import { goHome } from '@/hooks/useHashRoute';
import Imprint from './Imprint/Imprint';
import Privacy from './Privacy/Privacy';
import './Legal.css';

const PAGES = {
  imprint: { title: 'Imprint', meta: 'Information Pursuant To § 5 DDG', Body: Imprint },
  privacy: { title: 'Privacy Policy', meta: 'Last Updated: November 2026', Body: Privacy },
};

/** Imprint / Privacy page shown in place of the home page (#imprint, #privacy). */
export default function Legal({ page }) {
  const { title, meta, Body } = PAGES[page];
  return (
    <main className="lpage" id="top" aria-labelledby="lp-title">
      <div className="wrap">
        <a className="lback" href="#top" onClick={(e) => { e.preventDefault(); goHome(); }}>← Back To Website</a>
        <ChapterLabel n="§">Legal</ChapterLabel>
        <h1 className="ch-title" id="lp-title">{title}</h1>
        <p className="lmeta mono">{meta}</p>
        <div className="lbody"><Body /></div>
      </div>
    </main>
  );
}
