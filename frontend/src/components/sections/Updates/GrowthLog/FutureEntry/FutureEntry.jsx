import { formatLong } from '@/utils/format';
import './FutureEntry.css';

/** Dashed "next up" entry with a live day countdown. */
export default function FutureEntry({ milestone, side, lit }) {
  const { iso, title, text, days } = milestone;
  return (
    <div className={`ge future ${side}${lit ? ' lit' : ''}`} role="listitem">
      <span className="node" aria-hidden="true">→</span>
      <div className="card">
        <span className="k">Next Up</span>
        <h3>{title}</h3>
        <p>{formatLong(iso)}.{text ? ` ${text}` : ''}</p>
        <span className="days">{days}<small>{days === 1 ? 'Day To Go' : 'Days To Go'}</small></span>
      </div>
      <div className="side"><span className="date">Still Growing</span></div>
    </div>
  );
}
