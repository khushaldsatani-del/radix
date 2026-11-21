import { useEffect, useRef, useState } from 'react';
import './Select.css';

/**
 * Dropdown that opens inside the page (a native <select> pops up an OS menu that can
 * spill outside small screens and device previews). Follows the WAI-ARIA
 * "select-only combobox" pattern: arrows, Home/End, Enter/Space, Escape, Tab and type-ahead.
 */
export default function Select({ id, value, options, onChange, labelledBy, invalid, describedBy }) {
  const [open, setOpen] = useState(false);
  const [active, setActive] = useState(() => Math.max(0, options.indexOf(value)));
  const rootRef = useRef(null);
  const listRef = useRef(null);
  const typed = useRef({ text: '', t: 0 });
  const listId = `${id}-list`;
  const optId = (i) => `${id}-opt-${i}`;

  // Close on a click or tap outside
  useEffect(() => {
    if (!open) return;
    const onDown = (e) => { if (!rootRef.current?.contains(e.target)) setOpen(false); };
    document.addEventListener('pointerdown', onDown);
    return () => document.removeEventListener('pointerdown', onDown);
  }, [open]);

  // Keep the highlighted option scrolled into view
  useEffect(() => {
    if (open) listRef.current?.querySelector(`#${CSS.escape(optId(active))}`)?.scrollIntoView({ block: 'nearest' });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [open, active]);

  const openList = (i = options.indexOf(value)) => { setActive(Math.max(0, i)); setOpen(true); };
  const choose = (i) => { onChange(options[i]); setActive(i); setOpen(false); };

  const typeAhead = (key) => {
    const now = Date.now();
    typed.current.text = (now - typed.current.t > 600 ? '' : typed.current.text) + key.toLowerCase();
    typed.current.t = now;
    const start = open ? active : options.indexOf(value);
    const order = [...options.keys()].map((k) => (start + 1 + k) % options.length);
    const hit = order.find((i) => options[i].toLowerCase().startsWith(typed.current.text))
      ?? order.find((i) => options[i].toLowerCase().startsWith(key.toLowerCase()));
    if (hit === undefined) return;
    if (open) setActive(hit); else onChange(options[hit]);
  };

  const onKeyDown = (e) => {
    const last = options.length - 1;
    if (!open) {
      if (['ArrowDown', 'ArrowUp', 'Enter', ' '].includes(e.key)) { e.preventDefault(); openList(); }
      else if (e.key === 'Home') { e.preventDefault(); openList(0); }
      else if (e.key === 'End') { e.preventDefault(); openList(last); }
      else if (e.key.length === 1 && /\S/.test(e.key)) typeAhead(e.key);
      return;
    }
    switch (e.key) {
      case 'ArrowDown': e.preventDefault(); setActive((a) => Math.min(last, a + 1)); break;
      case 'ArrowUp': e.preventDefault(); setActive((a) => Math.max(0, a - 1)); break;
      case 'Home': e.preventDefault(); setActive(0); break;
      case 'End': e.preventDefault(); setActive(last); break;
      case 'Enter': case ' ': e.preventDefault(); choose(active); break;
      case 'Escape': e.preventDefault(); setOpen(false); break;
      case 'Tab': setOpen(false); break;
      default: if (e.key.length === 1 && /\S/.test(e.key)) typeAhead(e.key);
    }
  };

  return (
    <div className={`sel${open ? ' open' : ''}${invalid ? ' invalid' : ''}`} ref={rootRef}>
      <button
        type="button"
        id={id}
        className="sel-btn"
        role="combobox"
        aria-haspopup="listbox"
        aria-expanded={open}
        aria-controls={listId}
        aria-labelledby={labelledBy ? `${labelledBy} ${id}` : undefined}
        aria-activedescendant={open ? optId(active) : undefined}
        aria-invalid={invalid || undefined}
        aria-describedby={describedBy}
        onClick={() => (open ? setOpen(false) : openList())}
        onKeyDown={onKeyDown}
      >
        <span className="sel-val">{value}</span>
        <svg className="sel-chev" viewBox="0 0 20 20" aria-hidden="true"><path d="M5 7.5l5 5 5-5" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" /></svg>
      </button>
      <ul className="sel-list" id={listId} role="listbox" ref={listRef} hidden={!open} tabIndex={-1} aria-labelledby={labelledBy} data-lenis-prevent>
        {options.map((o, i) => (
          <li
            key={o}
            id={optId(i)}
            role="option"
            aria-selected={o === value}
            className={i === active ? 'active' : undefined}
            onPointerMove={() => setActive(i)}
            // pointerdown + preventDefault keeps focus on the button
            onPointerDown={(e) => e.preventDefault()}
            onClick={() => choose(i)}
          >
            <span>{o}</span>
            {o === value && (
              <svg viewBox="0 0 20 20" aria-hidden="true"><path d="M4.5 10.5l3.5 3.5 7.5-8" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" /></svg>
            )}
          </li>
        ))}
      </ul>
    </div>
  );
}
