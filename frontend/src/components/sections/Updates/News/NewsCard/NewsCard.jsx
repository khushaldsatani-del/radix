import Reveal from '@/components/common/Reveal/Reveal';

export default function NewsCard({ post, delay }) {
  return (
    <Reveal as="article" className="post" delay={delay}>
      <span className="d">{post.date}</span>
      <span className="tag">{post.tag}</span>
      <h3>{post.title}</h3>
      <p>{post.text}</p>
    </Reveal>
  );
}
