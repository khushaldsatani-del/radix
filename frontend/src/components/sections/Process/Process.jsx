import { useEffect, useState } from 'react';
import ChapterLabel from '@/components/common/ChapterLabel/ChapterLabel';
import Reveal from '@/components/common/Reveal/Reveal';
import { STEPS } from '@/data/content';
import { prefersReducedMotion } from '@/hooks/useReducedMotion';
import StepList from './StepList/StepList';
import StepPanel from './StepPanel/StepPanel';
import './Process.css';

const STEP_MS = 5000;

/** Scrum sprint stepper. Auto-advances until the visitor picks a step. */
export default function Process() {
  const [index, setIndex] = useState(0);
  const [auto, setAuto] = useState(() => !prefersReducedMotion());

  useEffect(() => {
    if (!auto) return;
    const t = setTimeout(() => setIndex((i) => (i + 1) % STEPS.length), STEP_MS);
    return () => clearTimeout(t);
  }, [auto, index]);

  const select = (i) => { setAuto(false); setIndex(i); };

  return (
    <section className="chapter flush" data-sec>
      <div className="wrap">
        <Reveal>
          <ChapterLabel n="04">How We Build</ChapterLabel>
          <h2 className="ch-title">One Idea. One Sprint At A Time.</h2>
        </Reveal>
        <Reveal className="process">
          <StepList steps={STEPS} active={index} onSelect={select} />
          <div className="process-main">
            <StepPanel index={index} step={STEPS[index]} total={STEPS.length} />
            <div className="bar" aria-hidden="true">
              {/* key restarts the progress animation for every step */}
              <i key={`${index}-${auto}`} className={auto ? 'run' : ''} style={{ animationDuration: `${STEP_MS}ms` }} />
            </div>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
