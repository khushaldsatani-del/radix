import { TEAM } from './team';
import { CONTACT } from './content';
import { getNextMilestone } from '@/utils/milestones';
import { formatLong } from '@/utils/format';

/** Pre-written FAQ answers for the Radix Assistant. `k` = keywords matched in free text. */
export function getAssistantFaq() {
  const next = getNextMilestone();
  return [
    {
      q: 'What Is Radix?', k: ['what is radix', 'who is radix', 'about radix', 'about you', 'who are you', 'company', 'startup', 'meaning', 'name', 'latin', 'founded'],
      a: <>Radix is a student software startup from Chemnitz, founded in 2026 by eight students in the Planspiel Web Engineering at TU Chemnitz. The name is Latin for <b>root</b>.</>,
    },
    {
      q: 'What Are You Building?', k: ['build', 'building', 'product', 'assistant', 'ecampus', 'across', 'topic', 'project', 'working on', 'ai'],
      a: <>An AI assistant for the <b>Across eCampus</b> that helps students and teachers find courses, events and research.</>,
    },
    {
      q: 'Who Is On The Team?', k: ['team', 'member', 'members', 'founder', 'founders', 'people', 'who is on', 'who works', 'students'],
      a: <>Eight founders: {TEAM.map((t) => t.name).join(', ')}. <a href="#team">Meet them</a>.</>,
    },
    {
      q: 'How Did Pitch 1 Go?', k: ['rank', 'ranking', 'place', 'result', 'results', 'won', 'win', 'pitch 1', 'first pitch', '1st', 'podium', 'third', '3rd', 'bronze', 'how did'],
      a: <>We came <b>3rd</b> in the audience vote at our first pitch on 4 November 2026. <a href="#updates">See the growth log</a>.</>,
    },
    {
      q: "What's Next?", k: ['next', 'pitch', 'upcoming', 'pitch 2', 'when', 'date', 'milestone', 'milestones', 'future', 'plan', 'plans'],
      a: next ? <>Next up is <b>{next.title}</b> on {formatLong(next.iso)}.</> : <>All our pitches are done.</>,
    },
    {
      q: 'How Can I Contact You?', k: ['contact', 'email', 'mail', 'reach', 'talk', 'write', 'message', 'get in touch', 'phone'],
      a: <>Email <b>{CONTACT.email}</b>, or use the <a href="#contact">contact form</a>.</>,
    },
  ];
}

/**
 * Best FAQ entry for free text, or null. Keywords match whole words only ("won" no longer
 * matches "wonder"), every entry is scored, and multi-word phrases count more than single
 * words, so "What's next?" finds the milestone answer instead of the first entry.
 */
export function findAnswer(text, faq) {
  const t = ` ${(text.toLowerCase().match(/[a-z0-9]+/g) || []).join(' ')} `;
  let best = null, bestScore = 0;
  for (const r of faq) {
    const score = r.k.reduce((sum, k) => (t.includes(` ${k} `) ? sum + k.split(' ').length : sum), 0);
    if (score > bestScore) { best = r; bestScore = score; }
  }
  return best;
}

export const FALLBACK = <>I'm a simple helper and don't know that one. Write to <b>{CONTACT.email}</b> and the team will answer.</>;
export const GREETING = 'Hi there, welcome to Radix! How can we help you today?';
