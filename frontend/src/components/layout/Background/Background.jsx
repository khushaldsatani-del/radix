import { useEffect, useRef } from 'react';
import './Background.css';

/** Fixed page background: slow blue gradient + drifting connected dots. */
export default function Background() {
  const ref = useRef(null);

  useEffect(() => {
    const cv = ref.current, ctx = cv.getContext('2d');
    const RM = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    const LINK = 150;
    let W, H, ns = [], mx = -9999, my = -9999, run = true, raf = 0, rt;

    function size() {
      const D = Math.min(2, window.devicePixelRatio || 1);
      W = window.innerWidth; H = window.innerHeight;
      cv.width = W * D; cv.height = H * D; ctx.setTransform(D, 0, 0, D, 0, 0);
      // fewer dots on small screens keeps phones smooth
      const n = Math.max(W < 600 ? 16 : 24, Math.min(60, Math.round((W * H) / 26000)));
      ns = Array.from({ length: n }, () => ({
        x: Math.random() * W, y: Math.random() * H,
        vx: (Math.random() - 0.5) * 0.22, vy: (Math.random() - 0.5) * 0.22, r: 1.6 + Math.random() * 1.6,
      }));
    }
    function draw() {
      ctx.clearRect(0, 0, W, H);
      if (!RM) ns.forEach((n) => {
        n.x += n.vx; n.y += n.vy;
        if (n.x < -20) n.x = W + 20; if (n.x > W + 20) n.x = -20;
        if (n.y < -20) n.y = H + 20; if (n.y > H + 20) n.y = -20;
      });
      ctx.lineWidth = 1;
      for (let i = 0; i < ns.length; i++) {
        const a = ns[i];
        for (let k = i + 1; k < ns.length; k++) {
          const b = ns[k], d = Math.hypot(a.x - b.x, a.y - b.y);
          if (d < LINK) { ctx.strokeStyle = `rgba(59,130,246,${(1 - d / LINK) * 0.22})`; ctx.beginPath(); ctx.moveTo(a.x, a.y); ctx.lineTo(b.x, b.y); ctx.stroke(); }
        }
        const dm = Math.hypot(a.x - mx, a.y - my);
        if (dm < 180) { ctx.strokeStyle = `rgba(37,99,235,${(1 - dm / 180) * 0.35})`; ctx.beginPath(); ctx.moveTo(a.x, a.y); ctx.lineTo(mx, my); ctx.stroke(); }
      }
      ns.forEach((n) => {
        ctx.beginPath(); ctx.arc(n.x, n.y, n.r, 0, 7);
        ctx.fillStyle = 'rgba(255,255,255,.9)'; ctx.fill();
        ctx.strokeStyle = 'rgba(37,99,235,.45)'; ctx.lineWidth = 1.2; ctx.stroke();
      });
      if (!RM && run) raf = requestAnimationFrame(draw);
    }

    const onMove = (e) => { mx = e.clientX; my = e.clientY; if (RM) requestAnimationFrame(draw); };
    const onLeave = () => { mx = my = -9999; };
    const onVis = () => { run = !document.hidden; cancelAnimationFrame(raf); if (run && !RM) raf = requestAnimationFrame(draw); };
    const onResize = () => { clearTimeout(rt); rt = setTimeout(() => { size(); if (RM) requestAnimationFrame(draw); }, 150); };

    window.addEventListener('pointermove', onMove, { passive: true });
    document.addEventListener('pointerleave', onLeave);
    document.addEventListener('visibilitychange', onVis);
    window.addEventListener('resize', onResize);
    size(); raf = requestAnimationFrame(draw);

    return () => {
      cancelAnimationFrame(raf); clearTimeout(rt);
      window.removeEventListener('pointermove', onMove);
      document.removeEventListener('pointerleave', onLeave);
      document.removeEventListener('visibilitychange', onVis);
      window.removeEventListener('resize', onResize);
    };
  }, []);

  return (
    <>
      <div className="bgfx" aria-hidden="true" />
      <canvas ref={ref} className="bgdots" aria-hidden="true" />
    </>
  );
}
