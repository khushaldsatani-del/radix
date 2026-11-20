import Hero from '@/components/sections/Hero/Hero';
import Problem from '@/components/sections/Problem/Problem';
import Answer from '@/components/sections/Answer/Answer';
import About from '@/components/sections/About/About';
import Process from '@/components/sections/Process/Process';
import Team from '@/components/sections/Team/Team';
import Updates from '@/components/sections/Updates/Updates';
import Contact from '@/components/sections/Contact/Contact';

export default function Home() {
  return (
    <main id="top">
      <Hero />
      <Problem />
      <Answer />
      <About />
      <Process />
      <Team />
      <Updates />
      <Contact />
    </main>
  );
}
