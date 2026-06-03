'use client';
import { LEARNER } from '@/lib/mockData';

function getDayGreeting() {
  const h = new Date().getHours();
  if (h < 12) return 'Good morning';
  if (h < 17) return 'Good afternoon';
  return 'Good evening';
}

function formatDate() {
  return new Date().toLocaleDateString('en-US', {
    weekday: 'long', month: 'long', day: 'numeric',
  });
}

export default function GreetingHero() {
  return (
    <div className="enter enter-1" style={{ marginBottom: 36 }}>
      {/* Date line */}
      <div style={{
        fontSize: 11, fontWeight: 600, letterSpacing: '0.08em',
        color: 'var(--text-tertiary)', textTransform: 'uppercase',
        marginBottom: 10,
      }}>
        {formatDate()}
      </div>

      {/* Main greeting */}
      <h1 style={{
        margin: 0, fontSize: 42, fontWeight: 800,
        letterSpacing: '-0.04em', lineHeight: 1.05,
        fontFamily: 'var(--font-display)',
      }}>
        <span style={{ color: 'var(--text-heading-hilite)' }}>Welcome,</span>{' '}
        <span style={{ color: 'var(--blue-700)' }}>{LEARNER.name}.</span>
      </h1>
    </div>
  );
}
