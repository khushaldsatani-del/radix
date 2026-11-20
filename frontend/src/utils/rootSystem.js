/**
 * Animated "root system" drawn on a canvas. Returns a cleanup function.
 * opts: { seed, dur, rotate, alpha, width, nodeAlpha, colors, layout(W,H,rng,push,nodes), host }
 */
export function rootSystem(canvas, opts) {
  const RM = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const ctx = canvas.getContext('2d');
  let W = 0, H = 0, segs = [], nodes = [], total = 0, t0 = null;
  const mouse = { x: -999, y: -999 };
  let visible = true, loop = false, raf = 0, alive = true;

  const rng = (s) => () => { s = (s * 16807) % 2147483647; return (s - 1) / 2147483646; };

  function size() {
    const d = Math.min(2, window.devicePixelRatio || 1);
    const rc = canvas.getBoundingClientRect();
    W = rc.width; H = rc.height;
    if (!W || !H) return;
    canvas.width = W * d; canvas.height = H * d;
    ctx.setTransform(d, 0, 0, d, 0, 0);
    const r = rng(opts.seed || 7);
    segs = []; nodes = []; total = 0;
    const push = (a, b, t) => {
      const l = Math.hypot(b[0] - a[0], b[1] - a[1]);
      segs.push({ a, b, t, l });
      total = Math.max(total, t + l);
      return l;
    };
    opts.layout(W, H, r, push, nodes);
  }

  const C = opts.colors || { line: '#0F766E', hi: '#14A39A', node: '#fff', dark: '#1B2B3C', glow: 'rgba(201,239,235,.9)' };

  function frame(ts) {
    if (!alive || !visible) { loop = false; return; }
    if (t0 === null) t0 = ts;
    const p = RM ? total : (ts - t0) * (total / (opts.dur || 2800));
    ctx.clearRect(0, 0, W, H);
    const rot = opts.rotate && !RM ? ts * opts.rotate : 0;
    ctx.save();
    if (rot) { ctx.translate(W / 2, H / 2); ctx.rotate(rot); ctx.translate(-W / 2, -H / 2); }
    let mx = mouse.x, my = mouse.y;
    if (rot) {
      const dx = mx - W / 2, dy = my - H / 2, c = Math.cos(-rot), s = Math.sin(-rot);
      mx = W / 2 + dx * c - dy * s; my = H / 2 + dx * s + dy * c;
    }
    ctx.lineCap = 'round'; ctx.lineJoin = 'round';
    segs.forEach((s) => {
      if (p < s.t) return;
      const f = Math.min(1, (p - s.t) / s.l);
      const near = Math.hypot((s.a[0] + s.b[0]) / 2 - mx, (s.a[1] + s.b[1]) / 2 - my) < 80;
      ctx.strokeStyle = near ? C.hi : C.line;
      ctx.globalAlpha = near ? 1 : opts.alpha || 0.85;
      ctx.lineWidth = near ? 2.6 : opts.width || 1.7;
      ctx.beginPath();
      ctx.moveTo(s.a[0], s.a[1]);
      ctx.lineTo(s.a[0] + (s.b[0] - s.a[0]) * f, s.a[1] + (s.b[1] - s.a[1]) * f);
      ctx.stroke();
    });
    ctx.globalAlpha = 1;
    nodes.forEach((n, i) => {
      if (p < n.t) return;
      const a = Math.min(1, (p - n.t) / 150);
      const near = Math.hypot(n.x - mx, n.y - my) < 64;
      const pulse = RM ? 0 : Math.sin(ts / 600 + i * 1.7) * 0.5 + 0.5;
      ctx.globalAlpha = a * (opts.nodeAlpha || 1);
      if (near || pulse > 0.94) { ctx.beginPath(); ctx.arc(n.x, n.y, near ? 13 : 10, 0, 7); ctx.fillStyle = C.glow; ctx.fill(); }
      ctx.beginPath(); ctx.arc(n.x, n.y, near ? 6 : 4.4, 0, 7);
      ctx.fillStyle = C.node; ctx.fill();
      ctx.lineWidth = 2.2;
      ctx.strokeStyle = near ? C.hi : i % 4 === 0 ? C.dark : C.line;
      ctx.stroke();
      ctx.globalAlpha = 1;
    });
    if (!RM && p >= total) {
      const k = (((ts / 1000) % 2.6) / 2.6) * total;
      segs.forEach((s) => {
        if (k >= s.t && k <= s.t + s.l) {
          const f = (k - s.t) / s.l;
          ctx.beginPath();
          ctx.arc(s.a[0] + (s.b[0] - s.a[0]) * f, s.a[1] + (s.b[1] - s.a[1]) * f, 2.6, 0, 7);
          ctx.fillStyle = C.hi; ctx.fill();
        }
      });
    }
    ctx.restore();
    if (!RM || p < total) raf = requestAnimationFrame(frame);
    else loop = false;
  }

  const kick = () => { if (!loop && visible && alive) { loop = true; raf = requestAnimationFrame(frame); } };
  const host = opts.host || canvas;
  const onMove = (e) => { const rc = canvas.getBoundingClientRect(); mouse.x = e.clientX - rc.left; mouse.y = e.clientY - rc.top; kick(); };
  const onLeave = () => { mouse.x = mouse.y = -999; kick(); };
  host.addEventListener('pointermove', onMove);
  host.addEventListener('pointerleave', onLeave);

  let io = null;
  if ('IntersectionObserver' in window) {
    io = new IntersectionObserver((es) => { visible = es[0].isIntersecting; if (visible) kick(); });
    io.observe(canvas);
  }
  // ResizeObserver also catches layout changes that are not window resizes
  let rt;
  const ro = new ResizeObserver(() => { clearTimeout(rt); rt = setTimeout(() => { size(); kick(); }, 150); });
  ro.observe(canvas);

  size(); kick();

  return () => {
    alive = false;
    cancelAnimationFrame(raf);
    clearTimeout(rt);
    host.removeEventListener('pointermove', onMove);
    host.removeEventListener('pointerleave', onLeave);
    io?.disconnect();
    ro.disconnect();
  };
}

/** Radial roots around the hero logo. */
export const radialLayout = (W, H, r, push, nodes) => {
  const cx = W / 2, cy = H / 2, S = Math.min(W, H), R0 = S * 0.225, RMAX = S * 0.4, N = 13;
  const pt = (rad, ang) => [cx + Math.cos(ang) * rad, cy + Math.sin(ang) * rad];
  function grow(rad, ang, t, depth) {
    let steps = 0;
    while (rad < RMAX && steps < 14) {
      const nr = Math.min(RMAX, rad + S * (0.026 + r() * 0.03));
      const na = steps % 2 ? ang + (r() - 0.5) * 0.26 : ang;
      t += push(pt(rad, ang), pt(nr, na), t);
      rad = nr; ang = na; steps++;
      if (depth < 3 && r() < 0.32 && rad < RMAX * 0.86) {
        const ba = ang + (r() < 0.5 ? -1 : 1) * (0.14 + r() * 0.12);
        const l = push(pt(rad, ang), pt(rad + S * 0.028, ba), t);
        grow(rad + S * 0.028, ba, t + l, depth + 1);
      }
    }
    const e = pt(rad, ang);
    nodes.push({ x: e[0], y: e[1], t });
  }
  for (let i = 0; i < N; i++) grow(R0, (i / N) * Math.PI * 2 + r() * 0.2, i * S * 0.018, 0);
};

/** Downward branching roots behind the contact block. */
export const branchLayout = (W, H, r, push, nodes) => {
  const unit = Math.max(24, Math.min(40, W / 30));
  function branch(x, y, depth, spread, t) {
    const down = unit * (0.7 + r() * 0.8);
    t += push([x, y], [x, y + down], t);
    y += down;
    if (depth >= 4 || y > H - 20) { nodes.push({ x, y, t }); return; }
    [-1, 1].forEach((d) => {
      const dx = d * spread * (0.6 + r() * 0.6) * unit, nx = x + dx, ny = y + Math.abs(dx) * 0.9;
      if (ny > H - 20) { nodes.push({ x, y, t }); return; }
      const l = push([x, y], [nx, ny], t);
      branch(nx, ny, depth + 1, spread * 0.62, t + l);
    });
  }
  branch(W * 0.5, 0, 0, 2.6, 0);
};
