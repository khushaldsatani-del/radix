import Reveal from '@/components/common/Reveal/Reveal';
import CountUp from '@/components/common/CountUp/CountUp';
import { COUNTS } from '@/data/content';
import './Story.css';

export default function Story() {
  return (
    <Reveal className="story">
      <span className="bigr" aria-hidden="true">√</span>
      <div>
        <span className="eyebrow">Our Story</span>
        <h3>Why "Radix"?</h3>
        <p>Radix was founded in 2026 in Chemnitz by eight students in the Planspiel Web Engineering at Chemnitz University of Technology.</p>
        <p>
          <b>Radix</b> is Latin for <b>root</b>. In maths, the radical sign <b>√</b> asks for the root of a number. Our logo
          joins both: an R whose stem grows circuit roots, next to a √. It's a reminder to understand the fundamentals before
          building on top of them.
        </p>
      </div>
      <div className="counts">
        {COUNTS.map((c) => (
          <div className="count" key={c.label}>
            <CountUp className="n" to={c.n} />
            <span className="l">{c.label}</span>
          </div>
        ))}
      </div>
    </Reveal>
  );
}
