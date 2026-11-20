import Reveal from '@/components/common/Reveal/Reveal';
import { VALUES } from '@/data/content';
import './Values.css';

/** Five values drawn as roots growing from one stem. */
export default function Values() {
  return (
    <>
      <Reveal as="h3" className="sub-h">Our Values</Reveal>
      <Reveal className="vroots" role="group" aria-label="Our five values">
        <span className="vstem" aria-hidden="true" />
        <span className="vbar" aria-hidden="true" />
        <div className="vcols">
          {VALUES.map((v, i) => (
            <div className="vcol" key={v.title} style={{ '--i': i }}>
              <span className="vdrop" aria-hidden="true" />
              <span className="vnode" aria-hidden="true">{v.glyph}</span>
              <div>
                <h4>{v.title}</h4>
                <p>{v.text}</p>
              </div>
            </div>
          ))}
        </div>
      </Reveal>
    </>
  );
}
