'use client';
import { useState } from 'react';
import { ChevronDown } from 'lucide-react';
import { usePrototype } from '@/context/PrototypeContext';
import { SEMESTERS, getEngagementScore, SemesterId } from '@/lib/mockData';
import GreetingHero from '@/components/home/GreetingHero';
import ContinueLearningCard from '@/components/home/ContinueLearningCard';
import EngagementScoreCard from '@/components/home/EngagementScoreCard';
import EnrolledCourses from '@/components/home/EnrolledCourses';
import ContinueWatching from '@/components/home/ContinueWatching';
import ContinueReading from '@/components/home/ContinueReading';
import ActiveDiscussions from '@/components/home/ActiveDiscussions';
import UpcomingActivities from '@/components/home/UpcomingActivities';

export default function HomeScreen() {
  const { scenario } = usePrototype();
  const isFirstVisit = scenario === 'first_visit';
  const defaultSem = SEMESTERS.find(s => s.isCurrent)?.id ?? SEMESTERS[0].id;
  const [selectedSemester, setSelectedSemester] = useState<SemesterId>(defaultSem);
  const engagement = getEngagementScore(selectedSemester);
  const currentSem = SEMESTERS.find(s => s.id === selectedSemester)!;

  return (
    <div style={{ padding: '32px 48px 64px', maxWidth: 1400, width: '100%', boxSizing: 'border-box' }}>

      <GreetingHero />

      {/* Semester selector */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 28 }}>
        <span style={{ fontSize: 14, color: 'var(--text-secondary)', fontWeight: 500 }}>You're in</span>
        <div style={{ position: 'relative', display: 'inline-flex' }}>
          <select
            value={selectedSemester}
            onChange={e => setSelectedSemester(e.target.value as SemesterId)}
            style={{
              appearance: 'none',
              WebkitAppearance: 'none',
              padding: '6px 28px 6px 12px',
              fontSize: 14, fontWeight: 700,
              fontFamily: 'var(--font-sans)',
              color: 'var(--text-primary)',
              background: 'var(--bg-section)',
              border: '1px solid var(--border-subtle)',
              borderRadius: 'var(--radius-sm)',
              cursor: 'pointer',
              outline: 'none',
              backgroundImage: `url("data:image/svg+xml,%3Csvg width='10' height='6' viewBox='0 0 10 6' fill='none' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M1 1L5 5L9 1' stroke='%23999' stroke-width='1.5' stroke-linecap='round' stroke-linejoin='round'/%3E%3C/svg%3E")`,
              backgroundRepeat: 'no-repeat',
              backgroundPosition: 'right 10px center',
            }}
          >
            {SEMESTERS.map(s => (
              <option key={s.id} value={s.id}>{s.label}</option>
            ))}
          </select>
          <ChevronDown size={13} style={{ position: 'absolute', right: 8, top: '50%', transform: 'translateY(-50%)', color: 'var(--text-tertiary)', pointerEvents: 'none' }} />
        </div>
      </div>

      {/* Primary row: continue learning + engagement score */}
      <div style={{ display: 'flex', gap: 16, alignItems: 'stretch', marginBottom: 36 }}>
        <div style={{ flex: '0 0 70%', minWidth: 0, display: 'flex' }}>
          <ContinueLearningCard firstTime={isFirstVisit} />
        </div>
        <div style={{ flex: '0 0 calc(30% - 16px)', minWidth: 0, display: 'flex' }}>
          <EngagementScoreCard data={engagement} />
        </div>
      </div>

      {/* Courses for selected semester — hidden for now */}
      {/* <EnrolledCourses semesterId={selectedSemester} /> */}
      <UpcomingActivities />
      <ContinueWatching firstTime={isFirstVisit} />
      <ContinueReading firstTime={isFirstVisit} />
      <ActiveDiscussions />
    </div>
  );
}
