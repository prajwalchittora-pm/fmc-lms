'use client';
import { Video, FileEdit, Clock, CalendarDays, BookOpen, HelpCircle } from 'lucide-react';

interface UpcomingItem {
  id: string;
  type: 'live_session' | 'assignment' | 'quiz' | 'exam';
  title: string;
  course: string;
  date: string;
  time: string;
  daysLeft: number;
  duration?: string;
}

const TYPE_CONFIG: Record<string, { icon: React.ElementType; label: string; color: string; bg: string; border: string }> = {
  live_session: { icon: Video, label: 'Live Session', color: '#072FB5', bg: 'rgba(7,47,181,0.06)', border: 'rgba(7,47,181,0.15)' },
  assignment: { icon: FileEdit, label: 'Assignment Due', color: '#8F3B00', bg: 'rgba(143,59,0,0.06)', border: 'rgba(143,59,0,0.15)' },
  quiz: { icon: HelpCircle, label: 'Quiz', color: '#7C3AED', bg: 'rgba(124,58,237,0.06)', border: 'rgba(124,58,237,0.15)' },
  exam: { icon: BookOpen, label: 'Exam', color: '#DC2626', bg: 'rgba(220,38,38,0.06)', border: 'rgba(220,38,38,0.15)' },
};

const UPCOMING: UpcomingItem[] = [
  { id: 'u1', type: 'live_session', title: 'Counselling Session - Managerial Economics', course: 'Managerial Economics', date: 'Tomorrow', time: '10:00 AM - 11:30 AM', daysLeft: 1, duration: '1.5 hrs' },
  { id: 'u2', type: 'assignment', title: 'Case Study: Elasticity Analysis', course: 'Managerial Economics', date: 'Fri, 6 Jun', time: '11:59 PM', daysLeft: 3 },
  { id: 'u3', type: 'quiz', title: 'Module 2 Assessment - Communication', course: 'Managerial Communication', date: 'Mon, 9 Jun', time: '9:00 AM - 10:00 AM', daysLeft: 6, duration: '60 min' },
  { id: 'u4', type: 'exam', title: 'Mid-Semester Examination', course: 'All Courses', date: 'Mon, 23 Jun', time: '10:00 AM', daysLeft: 20 },
];

function DaysLeftBadge({ days }: { days: number }) {
  const urgent = days <= 2;
  const soon = days <= 5;
  const color = urgent ? '#DC2626' : soon ? '#D97706' : 'var(--text-tertiary)';
  const bg = urgent ? 'rgba(220,38,38,0.08)' : soon ? 'rgba(217,119,6,0.08)' : 'var(--bg-section)';
  return (
    <div style={{ display: 'inline-flex', alignItems: 'center', gap: 4, padding: '3px 8px', background: bg, borderRadius: 'var(--radius-sm)', fontSize: 10, fontWeight: 700, color, fontFamily: 'var(--font-mono)', whiteSpace: 'nowrap' }}>
      <Clock size={9} strokeWidth={2.5} />
      {days === 0 ? 'Today' : days === 1 ? 'Tomorrow' : days + 'd left'}
    </div>
  );
}

export default function UpcomingActivities() {
  const sorted = [...UPCOMING].sort((a, b) => a.daysLeft - b.daysLeft);

  return (
    <div className="enter enter-5" style={{ marginTop: 0 }}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 16 }}>
        <div>
          <span className="label">Upcoming</span>
          <div style={{ fontSize: 18, fontWeight: 800, color: 'var(--text-primary)', fontFamily: 'var(--font-display)', letterSpacing: '-0.02em', marginTop: 4 }}>
            Scheduled activities
          </div>
        </div>
        <button
          style={{ display: 'inline-flex', alignItems: 'center', gap: 5, padding: '6px 14px', fontSize: 12, fontWeight: 600, color: 'var(--text-secondary)', background: 'transparent', border: '1px solid var(--border-subtle)', borderRadius: 'var(--radius-sm)', cursor: 'pointer', fontFamily: 'var(--font-sans)', transition: 'border-color 0.12s ease' }}
          onMouseEnter={e => { e.currentTarget.style.borderColor = 'var(--text-tertiary)'; }}
          onMouseLeave={e => { e.currentTarget.style.borderColor = 'var(--border-subtle)'; }}
        >
          <CalendarDays size={12} /> View calendar
        </button>
      </div>

      {/* Timeline */}
      <div style={{ position: 'relative', paddingLeft: 40 }}>
        {/* Vertical line */}
        <div style={{ position: 'absolute', left: 12, top: 4, bottom: 4, width: 1.5, background: 'var(--border-subtle)', borderRadius: 1 }} />

        {sorted.map((item, idx) => {
          const config = TYPE_CONFIG[item.type];
          const Icon = config.icon;
          const isLast = idx === sorted.length - 1;
          return (
            <div key={item.id} style={{ position: 'relative', paddingBottom: isLast ? 0 : 16 }}>
              {/* Timeline dot */}
              <div style={{
                position: 'absolute', left: -40, top: 14,
                width: 26, height: 26,
                borderRadius: '50%',
                background: '#fff',
                border: '2.5px solid ' + config.color,
                display: 'grid', placeItems: 'center',
                zIndex: 1,
              }}>
                <Icon size={12} strokeWidth={2.5} style={{ color: config.color }} />
              </div>

              {/* Card */}
              <div
                style={{
                  background: '#fff',
                  border: '2px solid rgba(15,15,15,0.45)',
                  borderRadius: 10,
                  padding: '16px 18px',
                  cursor: 'pointer',
                  transition: 'box-shadow 0.12s ease, transform 0.12s ease',
                }}
                onMouseEnter={e => { e.currentTarget.style.boxShadow = '0 4px 14px rgba(0,0,0,0.06)'; e.currentTarget.style.transform = 'translateY(-1px)'; }}
                onMouseLeave={e => { e.currentTarget.style.boxShadow = 'none'; e.currentTarget.style.transform = 'translateY(0)'; }}
              >
                {/* Top row */}
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 8, marginBottom: 6 }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                    <div style={{ fontSize: 10, fontWeight: 700, color: config.color, letterSpacing: '0.02em', padding: '2px 7px', background: config.bg, borderRadius: 'var(--radius-sm)' }}>
                      {config.label}
                    </div>
                    <DaysLeftBadge days={item.daysLeft} />
                  </div>
                  {item.duration && (
                    <span style={{ fontSize: 11, color: 'var(--text-tertiary)', fontWeight: 500 }}>{item.duration}</span>
                  )}
                </div>

                {/* Title */}
                <div style={{ fontSize: 13.5, fontWeight: 700, color: 'var(--text-primary)', fontFamily: 'var(--font-display)', letterSpacing: '-0.01em', marginBottom: 4 }}>
                  {item.title}
                </div>

                {/* Meta */}
                <div style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: 11.5, color: 'var(--text-tertiary)', fontWeight: 500 }}>
                  <span>{item.course}</span>
                  <span style={{ opacity: 0.4 }}>{'·'}</span>
                  <span>{item.date}, {item.time}</span>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
