import { MotionProvider } from './hooks/useMotion';
import { useReducedMotion } from './hooks/useReducedMotion';
import { Footer } from './components/Footer';
import { Petals } from './components/Petals';
import { ProgressRail } from './components/ProgressRail';
import { Divider } from './components/ornaments/Divider';
import { Hero } from './sections/Hero';
import { Invitation } from './sections/Invitation';
import { Ascent } from './sections/Ascent';
import { Details } from './sections/Details';
import { Venue } from './sections/Venue';
import { Closing } from './sections/Closing';

export default function App() {
  const reduced = useReducedMotion();

  return (
    <MotionProvider reduced={reduced}>
      <Petals />
      <ProgressRail />
      <main className="relative z-10">
        <Hero />
        <Invitation />
        <Divider />
        <Ascent />
        <Divider />
        <Details />
        <Divider />
        <Venue />
        <Closing />
        <Footer />
      </main>
    </MotionProvider>
  );
}
