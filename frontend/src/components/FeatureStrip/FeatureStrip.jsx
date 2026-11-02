import MagneticButton from '../MagneticButton/MagneticButton.jsx'
import './FeatureStrip.css'

const FEATURES = [
  {
    title: 'Rooted in strategy',
    text: 'Discover our approach to product, design and technology.',
    pixels: ['M2 2h4v4H2z', 'M6 6h4v4H6z', 'M10 2h4v4h-4z', 'M10 10h4v4h-4z', 'M2 10h4v4H2z'],
  },
  {
    title: 'Quality you can trust',
    text: 'Engineering standards built for scale, speed and reliability.',
    pixels: ['M10 2h4v4h-4z', 'M6 6h4v4H6z', 'M2 10h4v4H2z', 'M10 10h2v2h-2z', 'M4 2h2v2H4z'],
  },
  {
    title: 'Ship products faster',
    text: 'Lean teams and a clear process. Results in weeks, not months.',
    pixels: ['M2 2h4v4H2z', 'M6 6h4v4H6z', 'M10 10h4v4h-4z', 'M10 2h4v4h-4z', 'M2 12h2v2H2z'],
  },
]

function FeatureStrip() {
  return (
    <div className="feature-strip">
      <div className="feature-strip__cta" data-reveal>
        <MagneticButton>Get started</MagneticButton>
      </div>

      {FEATURES.map((feature) => (
        <a key={feature.title} href="#" className="feature" data-reveal>
          <span className="feature__icon" aria-hidden="true">
            <svg viewBox="0 0 16 16">
              {feature.pixels.map((d) => (
                <path key={d} d={d} />
              ))}
            </svg>
          </span>
          <span className="feature__body">
            <span className="feature__title">
              {feature.title}
              <span className="feature__arrow">&gt;</span>
            </span>
            <span className="feature__text">{feature.text}</span>
          </span>
        </a>
      ))}
    </div>
  )
}

export default FeatureStrip
