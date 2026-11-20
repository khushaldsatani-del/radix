import ChapterLabel from '@/components/common/ChapterLabel/ChapterLabel';
import Reveal from '@/components/common/Reveal/Reveal';
import { TEAM } from '@/data/team';
import TeamCard from './TeamCard/TeamCard';
import './Team.css';

export default function Team() {
  return (
    <section className="chapter flush" id="team" data-sec>
      <div className="wrap">
        <Reveal>
          <ChapterLabel n="05">Our Team</ChapterLabel>
          <h2 className="ch-title">The People Behind Radix.</h2>
          <p className="ch-intro">
            Engineering, design, quality, business analysis and project leadership. Each founder leads a focus area, and
            everyone contributes equally to code, research, reports and pitches.
          </p>
        </Reveal>
        <div className="team">
          {TEAM.map((m, i) => <TeamCard key={m.name} member={m} index={i} />)}
        </div>
      </div>
    </section>
  );
}
