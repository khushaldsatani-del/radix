import { useEffect, useMemo, useRef, useState } from 'react';
import { getAssistantFaq, findAnswer, FALLBACK, GREETING } from '@/data/assistant';
import { prefersReducedMotion } from '@/hooks/useReducedMotion';
import ChatPanel from './ChatPanel/ChatPanel';
import './ChatAssistant.css';

let uid = 0;
const nextId = () => ++uid;

/** Floating FAQ helper (no AI, nothing stored). */
export default function ChatAssistant() {
  const faq = useMemo(() => getAssistantFaq(), []);
  const [open, setOpen] = useState(false);
  const [bubble, setBubble] = useState(true);
  const [messages, setMessages] = useState([]);
  const fabRef = useRef(null);
  const timers = useRef([]);

  useEffect(() => () => timers.current.forEach(clearTimeout), []);

  // Hide the greeting bubble while the contact section (and the footer below it) is on
  // screen, so it never covers the contact form
  const [overForm, setOverForm] = useState(false);
  useEffect(() => {
    let raf = 0;
    const check = () => {
      raf = 0;
      const contact = document.getElementById('contact');
      setOverForm(Boolean(contact) && contact.getBoundingClientRect().top < window.innerHeight);
    };
    const schedule = () => { if (!raf) raf = requestAnimationFrame(check); };
    window.addEventListener('scroll', schedule, { passive: true });
    window.addEventListener('resize', schedule);
    window.addEventListener('popstate', schedule);
    window.addEventListener('hashchange', schedule);
    check();
    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener('scroll', schedule);
      window.removeEventListener('resize', schedule);
      window.removeEventListener('popstate', schedule);
      window.removeEventListener('hashchange', schedule);
    };
  }, []);

  const toggle = (next) => {
    setOpen(next);
    setBubble(false);
    if (next && messages.length === 0) setMessages([{ id: nextId(), from: 'bot', content: GREETING }]);
    if (!next) fabRef.current?.focus();
  };

  useEffect(() => {
    if (!open) return;
    const onKey = (e) => e.key === 'Escape' && toggle(false);
    document.addEventListener('keydown', onKey);
    return () => document.removeEventListener('keydown', onKey);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [open]);

  const ask = (text, item) => {
    const hit = item || findAnswer(text, faq);
    const botId = nextId();
    setMessages((m) => [...m, { id: nextId(), from: 'user', content: text }, { id: botId, from: 'bot', typing: true }]);
    const timer = setTimeout(() => {
      setMessages((m) => m.map((msg) => (msg.id === botId ? { ...msg, typing: false, content: hit ? hit.a : FALLBACK } : msg)));
    }, prefersReducedMotion() ? 80 : 700);
    timers.current.push(timer);
  };

  return (
    <div className="helper">
      {bubble && !open && !overForm && (
        <div className="bubble">
          <button type="button" className="bubble-open" onClick={() => toggle(true)}>Welcome to Radix! How can we help you?</button>
          <button type="button" className="bubble-x" aria-label="Hide message" onClick={() => setBubble(false)}>×</button>
        </div>
      )}
      {open && <ChatPanel messages={messages} faq={faq} onAsk={ask} onClose={() => toggle(false)} />}
      <button
        ref={fabRef}
        className="fab"
        type="button"
        aria-label={open ? 'Close Radix Assistant' : 'Open Radix Assistant'}
        aria-expanded={open}
        aria-controls="radix-assistant"
        onClick={() => toggle(!open)}
      >
        <span className="fab-in"><img className="lmark" src="/images/logo-mark.webp" alt="" /></span>
      </button>
    </div>
  );
}
