import './ChapterLabel.css';

/** Numbered chapter tag, e.g. (01) The Problem ———— */
export default function ChapterLabel({ n, children }) {
  return (
    <div className="ch-label">
      <span className="n">{n}</span>
      <span className="t">{children}</span>
    </div>
  );
}
