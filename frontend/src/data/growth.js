// Growth log entries (oldest first). `feat` renders the large award card.
export const GROWTH = [
  { date: '26 Oct 2026', title: 'Logo Workshop', text: 'A name and a logo to find. Everyone brought ideas to the table.' },
  { date: '29 Oct 2026', title: 'Brand Submitted', text: 'The root-and-√ logo is final and handed in with our name.' },
  { date: '31 Oct 2026', title: 'Who We Are', text: 'Vision, mission, values and culture written down together.' },
  { date: '3 Nov 2026', title: 'First Meeting In Person', text: 'Slides built, roles split, pitch rehearsed until it fit two minutes.' },
  {
    date: '4 Nov 2026', title: 'Pitch 1: 3rd Place', feat: true, rank: 3,
    text: 'Two minutes, one story. The audience voted us onto the podium at our very first pitch.',
    photo: '/images/pitch1-ranking.webp',
    photoAlt: 'Official ranking of the 1st pitch on 4 November 2026: 9Bow Tech first, BriseTech second, Radix third',
  },
  { date: '6 Nov 2026', title: 'Website Live, Topic Assigned', text: 'Our website went online and we got our topic: an AI assistant for the Across eCampus.' },
];

// Upcoming pitches: [ISO date, title, short description ('' = date only)]
export const MILESTONES = [
  ['2026-11-26', 'Pitch 2', 'Business idea, customer analysis, strategy and product concept.'],
  ['2026-12-16', 'Pitch 3', ''],
  ['2027-02-04', 'Final Pitch', ''],
];

export const NEWS = [
  { date: '4 November 2026', tag: 'Pitch', title: 'Pitch 1: Third Place For Radix', text: 'Two minutes on who we are, how we work and what we value earned us bronze in the audience vote. Next target: Pitch 2.' },
  { date: '6 November 2026', tag: 'Product', title: 'Our Topic: An AI Assistant For The Across eCampus', text: "We'll spend the semester building a chat assistant that helps students and teachers across nine European universities find what they need." },
  { date: '6 November 2026', tag: 'Website', title: 'Our Website Is Live', text: 'Our team, vision, values and way of working, all in one place, and updated as we build.' },
];
