import { useRef } from 'react';
import { pad2 } from '@/utils/format';
import './StepList.css';

/** Tab list of sprint steps. Arrow keys move between tabs. */
export default function StepList({ steps, active, onSelect }) {
  const ref = useRef(null);

  const onKeyDown = (e) => {
    const dir = { ArrowDown: 1, ArrowRight: 1, ArrowUp: -1, ArrowLeft: -1 }[e.key];
    if (!dir) return;
    e.preventDefault();
    const next = (active + dir + steps.length) % steps.length;
    onSelect(next);
    ref.current?.querySelectorAll('button')[next]?.focus();
  };

  return (
    <div className="steps" role="tablist" aria-label="Sprint steps" ref={ref} onKeyDown={onKeyDown}>
      {steps.map(([title], i) => (
        <button
          key={title}
          type="button"
          role="tab"
          id={`step-tab-${i}`}
          aria-controls="step-panel"
          aria-selected={i === active}
          tabIndex={i === active ? 0 : -1}
          className={i === active ? 'on' : undefined}
          onClick={() => onSelect(i)}
        >
          <span className="dot">{pad2(i + 1)}</span>
          <span className="lbl">{title}</span>
        </button>
      ))}
    </div>
  );
}
