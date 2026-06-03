'use client';
import { usePrototype } from '@/context/PrototypeContext';
import GreetingHero from '@/components/home/GreetingHero';
import ContinueLearningCard from '@/components/home/ContinueLearningCard';
import CertificateCard from '@/components/home/CertificateCard';
import EnrolledCourses from '@/components/home/EnrolledCourses';
import ContinueWatching from '@/components/home/ContinueWatching';
import ContinueReading from '@/components/home/ContinueReading';

export default function HomeScreen() {
  const { scenario } = usePrototype();
  const isFirstVisit = scenario === 'first_visit';

  return (
    <div style={{ padding: '32px 48px 64px', maxWidth: 1200, width: '100%', boxSizing: 'border-box' }}>

      <GreetingHero />

      {/* Primary row: continue learning + certificate */}
      <div style={{ display: 'flex', gap: 16, alignItems: 'stretch', marginBottom: 36 }}>
        <div style={{ flex: '0 0 70%', minWidth: 0, display: 'flex' }}>
          <ContinueLearningCard firstTime={isFirstVisit} />
        </div>
        <div style={{ flex: '0 0 calc(30% - 16px)', minWidth: 0, display: 'flex' }}>
          <CertificateCard />
        </div>
      </div>

      <EnrolledCourses />
      <ContinueWatching firstTime={isFirstVisit} />
      <ContinueReading firstTime={isFirstVisit} />
    </div>
  );
}
