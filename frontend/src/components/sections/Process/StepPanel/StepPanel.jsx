import { pad2 } from '@/utils/format';
import './StepPanel.css';

function StepArt({ n, total }) {
  const items = [];
  for (let k = 0; k < total; k++) {
    const on = k < n;
    items.push(<circle key={`c${k}`} cx={20 + k * 40} cy="100" r={on ? 9 : 6} fill={on ? 'currentColor' : '#fff'} stroke="currentColor" strokeWidth="2" />);
    if (k < total - 1) items.push(<path key={`p${k}`} d={`M${29 + k * 40} 100 H${51 + k * 40}`} stroke="currentColor" strokeWidth="2" opacity={k < n - 1 ? 1 : 0.25} />);
  }
  return (
    <svg viewBox="0 0 200 200" aria-hidden="true">
      <path d="M100 10 V60" stroke="currentColor" strokeWidth="2" />
      <path d="M100 60 L20 92 M100 60 L180 92 M100 60 V92" stroke="currentColor" strokeWidth="1.4" opacity=".4" />
      {items}
      <text x="100" y="160" textAnchor="middle" fontFamily="JetBrains Mono, monospace" fontSize="12" fill="#5A6871">Step {n} Of {total}</text>
    </svg>
  );
}

export default function StepPanel({ index, step, total }) {
  const [title, text] = step;
  return (
    <div className="step-panel" id="step-panel" role="tabpanel" aria-labelledby={`step-tab-${index}`}>
      {/* key re-runs the swap animation on every change */}
      <div className="swap" key={`t${index}`}>
        <span className="k">Step {pad2(index + 1)}</span>
        <h3>{title}</h3>
        <p>{text}</p>
      </div>
      <div className="swap art" key={`a${index}`}><StepArt n={index + 1} total={total} /></div>
    </div>
  );
}
