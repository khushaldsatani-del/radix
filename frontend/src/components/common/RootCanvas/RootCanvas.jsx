import { useEffect, useRef } from 'react';
import { rootSystem } from '@/utils/rootSystem';

/**
 * Canvas with an animated root system. `hostRef` (optional) is the element whose
 * pointer movement highlights roots; defaults to the canvas itself.
 */
export default function RootCanvas({ options, hostRef, className, ...rest }) {
  const ref = useRef(null);
  useEffect(() => {
    if (!ref.current) return;
    return rootSystem(ref.current, { ...options, host: hostRef?.current || ref.current });
    // options are static per instance
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  return <canvas ref={ref} className={className} {...rest} />;
}
