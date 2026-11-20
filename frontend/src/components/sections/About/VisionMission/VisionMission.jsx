import Reveal from '@/components/common/Reveal/Reveal';
import './VisionMission.css';

const CARDS = [
  {
    key: 'Vision',
    title: 'A Future Where Technology Makes Everyday Challenges Easier.',
    text: 'We want to build things that create meaningful, lasting value for the people who use them.',
    icon: <><path d="M2 12s3.6-7 10-7 10 7 10 7-3.6 7-10 7S2 12 2 12z" /><circle cx="12" cy="12" r="3" /></>,
  },
  {
    key: 'Mission',
    title: 'Understand Problems At Their Source And Turn Ideas Into Well-Engineered Solutions.',
    text: 'We approach every challenge thoughtfully, test continuously and build together.',
    icon: <><circle cx="12" cy="12" r="9" /><circle cx="12" cy="12" r="5" /><circle cx="12" cy="12" r="1.2" /></>,
  },
];

export default function VisionMission() {
  return (
    <div className="vm">
      {CARDS.map((c, i) => (
        <Reveal key={c.key} className="vm-card" delay={i * 70}>
          <span className="ic" aria-hidden="true"><svg viewBox="0 0 24 24">{c.icon}</svg></span>
          <span className="k">{c.key}</span>
          <h3>{c.title}</h3>
          <p>{c.text}</p>
        </Reveal>
      ))}
    </div>
  );
}
