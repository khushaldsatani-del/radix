import rohan from '../../assets/team/rohan.webp'
import khushal from '../../assets/team/khushal.webp'
import samay from '../../assets/team/samay.webp'
import parthiv from '../../assets/team/parthiv.webp'
import yiLi from '../../assets/team/yi-li.webp'
import harini from '../../assets/team/harini.webp'
import priyanka from '../../assets/team/priyanka.webp'
import rifah from '../../assets/team/rifah.webp'

// Listed in display order, two per row.
// speed: parallax factor. Above 1 scrolls faster than the page, below 1 slower.
export const TEAM = [
  { name: 'Rohan', role: 'Scrum Master', photo: rohan, speed: 0.85 },
  { name: 'Harini', role: 'Product Owner', photo: harini, speed: 1.15 },
  { name: 'Priyanka', role: 'QA Engineer', photo: priyanka, speed: 1.1 },
  { name: 'Rifah', role: 'Business Analyst', photo: rifah, speed: 0.9 },
  { name: 'Samay', role: 'Full-Stack Developer', photo: samay, speed: 1.12 },
  { name: 'Parthiv', role: 'Frontend Developer', photo: parthiv, speed: 0.9 },
  { name: 'Yi Li', role: 'Backend Developer', photo: yiLi, speed: 1.12 },
  { name: 'Khushal', role: 'UI/UX Designer', photo: khushal, speed: 0.9 },
]
