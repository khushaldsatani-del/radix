import ChapterLabel from '@/components/common/ChapterLabel/ChapterLabel';
import Reveal from '@/components/common/Reveal/Reveal';
import './Problem.css';

const SEEN = ['A Confusing Page', 'Slow Search', '"Where Do I Find…?"'];
const CAUSES = ['Unclear User Needs', 'Scattered Data', 'No Shared Model', 'Untested Assumptions', 'Missing Accessibility'];

export default function Problem() {
  return (
    <section className="chapter" data-sec>
      <div className="wrap">
        <div className="problem">
          <Reveal>
            <ChapterLabel n="01">The Problem</ChapterLabel>
            <h2 className="ch-title">Most Software Is Built At The <mark className="hl">Surface</mark>.</h2>
            <p className="ch-intro">
              Building digital products has never been easier, so many teams jump straight to features. They fix what users
              see and miss what causes it. The result looks good at launch and starts to crack as it grows.
            </p>
          </Reveal>
          <Reveal className="iceberg" role="group" aria-label="What users see versus what holds a product up">
            <div className="above">
              <span className="k">What Users See</span>
              <div className="chips">{SEEN.map((c) => <span key={c}>{c}</span>)}</div>
            </div>
            <div className="gline" />
            <div className="below">
              <span className="k">What Actually Causes It</span>
              <div className="chips">{CAUSES.map((c) => <span key={c}>{c}</span>)}</div>
            </div>
          </Reveal>
        </div>
      </div>
    </section>
  );
}
