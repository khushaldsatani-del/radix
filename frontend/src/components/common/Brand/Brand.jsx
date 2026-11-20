import './Brand.css';

/** Logo mark + wordmark linking to the top of the page. */
export default function Brand({ onClick }) {
  return (
    <a className="brand" href="#top" aria-label="Radix home" onClick={onClick}>
      <img className="lmark" src="/images/logo-mark.webp" alt="" width="40" height="42" />
      <span className="word">Radix</span>
    </a>
  );
}
