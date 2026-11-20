import { useState } from 'react';
import { ordinalSuffix } from '@/utils/format';
import './FeaturedEntry.css';

/** Big award card (e.g. Pitch 1 podium) with photo and spinning medal. */
export default function FeaturedEntry({ entry, num, lit }) {
  const [photoOk, setPhotoOk] = useState(Boolean(entry.photo));
  return (
    <div className={`ge feat${lit ? ' lit' : ''}`} role="listitem">
      <span className="node" aria-hidden="true">{num}</span>
      <div className={`card${photoOk ? '' : ' no-photo'}`}>
        {photoOk && (
          <figure className="photo">
            <img src={entry.photo} alt={entry.photoAlt} loading="lazy" width="1177" height="575" onError={() => setPhotoOk(false)} />
            <figcaption>Official Planspiel Ranking · {entry.date}</figcaption>
          </figure>
        )}
        <div className="award">
          <div className="medal" aria-hidden="true">
            <svg className="ring" viewBox="0 0 132 132">
              <defs><path id="mring" d="M66,66 m-58,0 a58,58 0 1,1 116,0 a58,58 0 1,1 -116,0" /></defs>
              <text><textPath href="#mring">Audience Vote · Pitch 1 · {entry.date} · </textPath></text>
            </svg>
            <div className="disc"><span>{entry.rank}<sup>{ordinalSuffix(entry.rank)}</sup></span></div>
          </div>
          <div className="txt">
            <span className="d">{entry.date}</span>
            <h3>{entry.title}</h3>
            <p>{entry.text}</p>
          </div>
        </div>
      </div>
    </div>
  );
}
