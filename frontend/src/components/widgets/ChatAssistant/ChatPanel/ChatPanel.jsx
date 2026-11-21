import { useEffect, useRef, useState } from 'react';
import ChatMessage from '../ChatMessage/ChatMessage';
import './ChatPanel.css';

export default function ChatPanel({ messages, faq, onAsk, onClose }) {
  const [q, setQ] = useState('');
  const logRef = useRef(null);
  const inputRef = useRef(null);

  useEffect(() => { inputRef.current?.focus({ preventScroll: true }); }, []);
  useEffect(() => { const l = logRef.current; if (l) l.scrollTop = l.scrollHeight; }, [messages]);

  const submit = (e) => {
    e.preventDefault();
    const v = q.trim();
    if (v) { onAsk(v); setQ(''); }
  };

  // Links inside answers (#team, #contact…) close the panel so the page is visible
  const onLogClick = (e) => { if (e.target.closest('a')) onClose(); };

  return (
    <div className="panel" id="radix-assistant" role="dialog" aria-label="Radix Assistant">
      <div className="ph-top">
        <img className="lmark" src="/images/logo-mark.webp" alt="" />
        <div><b>Radix Assistant</b><small>Team, Pitches And Updates</small></div>
        <button type="button" onClick={onClose} aria-label="Close chat">×</button>
      </div>
      <div className="plog" ref={logRef} aria-live="polite" onClick={onLogClick} data-lenis-prevent>
        {messages.map((m) => <ChatMessage key={m.id} message={m} />)}
      </div>
      <div className="psugs">
        {faq.map((r) => <button key={r.q} type="button" onClick={() => onAsk(r.q, r)}>{r.q}</button>)}
      </div>
      <form onSubmit={submit}>
        <label htmlFor="pq" className="sr-only">Your Question</label>
        <input id="pq" ref={inputRef} autoComplete="off" placeholder="Ask about Radix, the team…" value={q} onChange={(e) => setQ(e.target.value)} />
        <button type="submit">Send</button>
      </form>
      <p className="pnote">Pre-written answers, no AI. Your messages are not saved or shared.</p>
    </div>
  );
}
