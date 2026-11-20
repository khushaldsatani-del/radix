import Reveal from '@/components/common/Reveal/Reveal';
import { CULTURE } from '@/data/content';
import { pad2 } from '@/utils/format';
import './Culture.css';

export default function Culture() {
  return (
    <>
      <Reveal as="h3" className="sub-h">Our Culture <small>How Eight Minds Work As One</small></Reveal>
      <Reveal className="culture">
        {CULTURE.map((c, i) => (
          <div className="cul" key={c.title}>
            <span className="k">{pad2(i + 1)}</span>
            <h4>{c.title}</h4>
            <p>{c.text}</p>
          </div>
        ))}
      </Reveal>
    </>
  );
}
