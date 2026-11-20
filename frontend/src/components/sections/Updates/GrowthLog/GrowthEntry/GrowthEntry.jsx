/** Regular timeline entry, alternating left/right on desktop. */
export default function GrowthEntry({ entry, num, side, lit }) {
  return (
    <div className={`ge ${side}${lit ? ' lit' : ''}`} role="listitem">
      <span className="node" aria-hidden="true">{num}</span>
      <div className="card">
        <h3>{entry.title}</h3>
        <p>{entry.text}</p>
      </div>
      <div className="side"><span className="date">{entry.date}</span></div>
    </div>
  );
}
