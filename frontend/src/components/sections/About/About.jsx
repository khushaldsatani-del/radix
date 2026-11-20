import ChapterLabel from '@/components/common/ChapterLabel/ChapterLabel';
import Reveal from '@/components/common/Reveal/Reveal';
import VisionMission from './VisionMission/VisionMission';
import Values from './Values/Values';
import Culture from './Culture/Culture';
import Story from './Story/Story';

export default function About() {
  return (
    <section className="chapter" id="about" data-sec>
      <div className="wrap">
        <Reveal>
          <ChapterLabel n="03">About Us</ChapterLabel>
          <h2 className="ch-title">Different Roots. One Direction.</h2>
          <p className="ch-intro">What drives us, what we stand for and how we work together.</p>
        </Reveal>
        <VisionMission />
        <Values />
        <Culture />
        <Story />
      </div>
    </section>
  );
}
