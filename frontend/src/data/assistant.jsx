import { TEAM } from './team';
import { CONTACT } from './content';
import { getNextMilestone } from '@/utils/milestones';
import { formatLong } from '@/utils/format';

/** Pre-written FAQ answers for the Radix Assistant. `k` = keywords matched in free text. */
export function getAssistantFaq() {
  const next = getNextMilestone();
  return [
    {
      q: 'What Is Radix?', k: ['radix', 'what', 'who are', 'company', 'name'],
      a: <>Radix is a student software startup from Chemnitz, founded in 2026 by eight students in the Planspiel Web Engineering at TU Chemnitz. The name is Latin for <b>root</b>.</>,
    },
    {
      q: 'What Are You Building?', k: ['build', 'product', 'assistant', 'ecampus', 'across'],
      a: <>An AI assistant for the <b>Across eCampus</b> that helps students and teachers find courses, events and research.</>,
    },
    {
      q: 'Who Is On The Team?', k: ['team', 'who', 'member', 'founder', 'people'],
      a: <>Eight founders: {TEAM.map((t) => t.name).join(', ')}. <a href="#team">Meet them</a>.</>,
    },
    {
      q: 'How Did Pitch 1 Go?', k: ['rank', 'place', 'result', 'won', 'pitch 1', 'first pitch', '1st', 'podium', 'how did'],
      a: <>We came <b>3rd</b> in the audience vote at our first pitch on 4 November 2026. <a href="#updates">See the growth log</a>.</>,
    },
    {
      q: "What's Next?", k: ['next', 'pitch', 'when', 'date', 'milestone'],
      a: next ? <>Next up is <b>{next.title}</b> on {formatLong(next.iso)}.</> : <>All our pitches are done.</>,
    },
    {
      q: 'How Can I Contact You?', k: ['contact', 'email', 'mail', 'reach', 'talk'],
      a: <>Email <b>{CONTACT.business}</b>, or use the <a href="#contact">contact form</a>.</>,
    },
  ];
}

export const FALLBACK = <>I'm a simple helper and don't know that one. Write to <b>{CONTACT.business}</b> and the team will answer.</>;
export const GREETING = 'Hi there, welcome to Radix! How can we help you today?';
