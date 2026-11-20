import ChapterLabel from '@/components/common/ChapterLabel/ChapterLabel';
import Reveal from '@/components/common/Reveal/Reveal';
import './Answer.css';

const ANSWERS = [
  {
    bg: '√', title: 'Root Cause First',
    text: "Before we write code, we talk to the people who'll use it and map the problem down to its source.",
    icon: <><path d="M12 3v9" /><path d="M12 12l-5 5v4M12 12l5 5v2M12 12v9" /><circle cx="7" cy="21" r="1.4" fill="currentColor" /><circle cx="17" cy="19" r="1.4" fill="currentColor" /></>,
  },
  {
    bg: '↻', title: 'Built To Grow',
    text: 'Agile Scrum in one-week sprints. We ship small, test early and improve every week instead of guessing big.',
    icon: <><path d="M21 12a9 9 0 1 1-3-6.7L21 8" /><path d="M21 3v5h-5" /></>,
  },
  {
    bg: 'AI', title: 'AI That Shows Its Sources',
    text: 'We use AI where it adds real value, keep people in charge of decisions, and are open about where we use it.',
    icon: <><rect x="4" y="7" width="16" height="12" rx="3" /><path d="M9 7V4h6v3" /><circle cx="9.5" cy="13" r="1.2" fill="currentColor" /><circle cx="14.5" cy="13" r="1.2" fill="currentColor" /></>,
  },
];

export default function Answer() {
  return (
    <section className="chapter flush" data-sec>
      <div className="wrap">
        <Reveal>
          <ChapterLabel n="02">Our Answer</ChapterLabel>
          <h2 className="ch-title">Start At The Root. Grow With Care.</h2>
        </Reveal>
        <div className="answers">
          {ANSWERS.map((a, i) => (
            <Reveal key={a.title} className="ans" delay={i * 70}>
              <span className="bg" aria-hidden="true">{a.bg}</span>
              <div className="ic"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">{a.icon}</svg></div>
              <h3>{a.title}</h3>
              <p>{a.text}</p>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
