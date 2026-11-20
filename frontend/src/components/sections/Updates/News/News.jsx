import Reveal from '@/components/common/Reveal/Reveal';
import { NEWS } from '@/data/growth';
import NewsCard from './NewsCard/NewsCard';
import './News.css';

export default function News() {
  return (
    <>
      <Reveal as="h3" className="sub-h">Latest News</Reveal>
      <div className="news">
        {NEWS.map((n, i) => <NewsCard key={n.title} post={n} delay={i * 70} />)}
      </div>
    </>
  );
}
