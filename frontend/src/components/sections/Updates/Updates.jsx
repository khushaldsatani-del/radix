import ChapterLabel from '@/components/common/ChapterLabel/ChapterLabel';
import Reveal from '@/components/common/Reveal/Reveal';
import GrowthLog from './GrowthLog/GrowthLog';
import News from './News/News';

export default function Updates() {
  return (
    <section className="chapter flush" id="updates" data-sec>
      <div className="wrap">
        <Reveal>
          <ChapterLabel n="06">Updates</ChapterLabel>
          <h2 className="ch-title">The Growth Log.</h2>
          <p className="ch-intro">Every milestone so far, from an empty name field to our first podium. Scroll to grow it.</p>
        </Reveal>
        <GrowthLog />
        <News />
      </div>
    </section>
  );
}
