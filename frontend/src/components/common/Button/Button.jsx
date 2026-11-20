import { useRef } from 'react';
import { hasFinePointer, prefersReducedMotion } from '@/hooks/useReducedMotion';
import './Button.css';

/**
 * Pill button / link. variant: "solid" | "ghost". `magnetic` follows the cursor slightly.
 * Renders an <a> when `href` is given, otherwise a <button>.
 */
export default function Button({ variant = 'solid', href, arrow = false, magnetic = false, className = '', children, ...rest }) {
  const ref = useRef(null);
  const cls = `btn ${variant} ${className}`.trim();

  const magnetHandlers = magnetic
    ? {
        onPointerMove: (e) => {
          if (!hasFinePointer() || prefersReducedMotion()) return;
          const b = ref.current, r = b.getBoundingClientRect();
          b.style.transform = `translate(${(e.clientX - r.left - r.width / 2) * 0.18}px,${(e.clientY - r.top - r.height / 2) * 0.28}px)`;
        },
        onPointerLeave: () => { ref.current.style.transform = ''; },
      }
    : {};

  const inner = (
    <>
      <span>{children}</span>
      {arrow && <span className="arr" aria-hidden="true">→</span>}
    </>
  );

  return href ? (
    <a ref={ref} className={cls} href={href} {...magnetHandlers} {...rest}>{inner}</a>
  ) : (
    <button ref={ref} className={cls} type="button" {...magnetHandlers} {...rest}>{inner}</button>
  );
}
