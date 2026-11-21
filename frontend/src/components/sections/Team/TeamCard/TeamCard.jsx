import { useMemo, useState } from 'react';
import Reveal from '@/components/common/Reveal/Reveal';
import { initials, pad2 } from '@/utils/format';
import { hasFinePointer } from '@/hooks/useReducedMotion';
import './TeamCard.css';

function Roots({ seed }) {
  return (
    <svg viewBox="0 0 100 100" preserveAspectRatio="none" aria-hidden="true">
      {[0, 1, 2, 3, 4, 5, 6].map((k) => {
        const x = 10 + k * 14, y = 60 + ((k * 37 + seed * 11) % 30);
        return (
          <g key={k}>
            <path d={`M50 50 L${x} ${y} V95`} stroke="#0F766E" strokeWidth=".5" fill="none" opacity=".45" />
            <circle cx={x} cy="95" r="1.2" fill="#0F766E" opacity=".5" />
          </g>
        );
      })}
    </svg>
  );
}

/** Flip card: photo + name on the front, short bio on the back. Hover (mouse) or tap/Enter flips it. */
export default function TeamCard({ member, index }) {
  const [flipped, setFlipped] = useState(false);
  const [photoOk, setPhotoOk] = useState(Boolean(member.photo));
  const num = pad2(index + 1);
  const ini = useMemo(() => initials(member.name), [member.name]);

  const toggle = () => setFlipped((f) => !f);

  return (
    <Reveal
      as="article"
      className={`member${flipped ? ' flipped' : ''}`}
      delay={(index % 4) * 70}
      tabIndex={0}
      aria-label={`${member.name}, ${member.roles[0]}. ${member.about}`}
      onClick={() => { if (!hasFinePointer()) toggle(); }}
      onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); toggle(); } }}
    >
      <div className="flip">
        <div className="card front">
          <div className="ph">
            <Roots seed={index} />
            <span className="ini" aria-hidden="true">{ini}</span>
            {photoOk && (
              <img src={member.photo} alt="" loading="lazy" width="560" height="640" onError={() => setPhotoOk(false)} />
            )}
          </div>
          <div className="body">
            <span className="num">{num}</span>
            <h3>{member.name}</h3>
            <div className="roles">{member.roles.map((r) => <span key={r}>{r}</span>)}</div>
            <span className="hint" aria-hidden="true">Tap to read more</span>
          </div>
        </div>
        <div className="card back" aria-hidden="true" data-lenis-prevent>
          {photoOk && <img className="bimg" src={member.photo} alt="" loading="lazy" />}
          <span className="num">{num} · Radix</span>
          <h3>{member.name}</h3>
          <span className="brole">{member.roles[0]}</span>
          <p>{member.about}</p>
        </div>
      </div>
    </Reveal>
  );
}
