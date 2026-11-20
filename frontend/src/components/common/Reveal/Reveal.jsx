import { useRef } from 'react';
import { useInView } from '@/hooks/useInView';

/** Fades its content up when it scrolls into view. `as` picks the element. */
export default function Reveal({ as: Tag = 'div', className = '', delay = 0, style, children, ...rest }) {
  const ref = useRef(null);
  const state = useInView(ref);
  const cls = ['rv', state === 'pre' && 'pre', state === 'in' && 'in', className].filter(Boolean).join(' ');
  return (
    <Tag ref={ref} className={cls} style={state === 'pre' && delay ? { ...style, transitionDelay: `${delay}ms` } : style} {...rest}>
      {children}
    </Tag>
  );
}
