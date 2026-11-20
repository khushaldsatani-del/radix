import { useRef } from 'react';
import Button from '@/components/common/Button/Button';
import RootCanvas from '@/components/common/RootCanvas/RootCanvas';
import { radialLayout } from '@/utils/rootSystem';
import './Hero.css';

const ROOTS = { seed: 11, dur: 3200, rotate: 0.000028, layout: radialLayout };

export default function Hero() {
  const specimenRef = useRef(null);
  return (
    <section className="hero" data-sec>
      <div className="wrap">
        <div className="hero-copy">
          <div className="kicker mono">Engineered From The Source</div>
          <h1>
            <span className="line"><span>Eight Minds.</span></span>
            <span className="line"><span className="thin">One Foundation.</span></span>
          </h1>
          <p className="lede">
            We are a student software startup, founded in Chemnitz in 2026 by a team of eight. We dig to the root of a
            problem before we build, so our solutions stay solid as they grow.
          </p>
          <div className="row">
            <Button href="#about" arrow magnetic>Our Vision</Button>
            <Button href="#team" variant="ghost" magnetic>Meet The Team</Button>
          </div>
          <div className="meta"><span>Chemnitz, Germany</span><span>Planspiel Web Engineering</span><span>WS 2026/27</span></div>
        </div>
        <div className="specimen" ref={specimenRef}>
          <RootCanvas options={ROOTS} hostRef={specimenRef} role="img" aria-label="The Radix logo at the centre of a living root system" />
          <div className="core"><img className="lmark" src="/images/logo-mark.webp" alt="" width="600" height="628" /></div>
        </div>
      </div>
    </section>
  );
}
